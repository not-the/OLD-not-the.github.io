// HTML
const body        = $('body'),
nav               = document.getElementById('nav'),
menu_button       = document.getElementById('menu_button'),
hamburger_menu    = document.getElementById('hamburger_menu'),
theme_button      = document.getElementById('theme_button'),
video_main        = document.querySelector('.video_main'),
reduce_motion     = document.getElementById('reduce_motion'),
backdrop          = document.getElementById('backdrop');

// Variables
const mobile_layout_width = 600;
let hamburger_open = false;
let ti1; // Timeout 1
let ti2; // Timeout 2
let searchdata;
let privacy_policy_version = 1;

// Utility functions
/** Loops a number within a min and max value */
function clampLoop(value, max) {
    if(Math.sign(value) === -1) value += max;
    return value % max;
}
/** Fetch a JSON file using XMLHttpRequest */
function get(url, parse){
    var rq = new XMLHttpRequest(); // a new request
    rq.open("GET", url, false);
    rq.send(null);
    return parse ? JSON.parse(rq.responseText) : rq.responseText;          
}

// Functions
/** Hamburger menu toggle */
function toggleMenu() {
    if(!hamburger_open && window.innerWidth > mobile_layout_width) return;
    hamburger_open = !hamburger_open;
    style(nav, 'menu_open', hamburger_open);    // Open navbar
    style(backdrop, 'visible', hamburger_open); // Show backdrop
}
/** Option values and methods */
const options = {
    cookies: JSON.parse(store('main_cookies')) ?? undefined,
    theme: false,
    reduce_motion: false,
    policy_version: store('main_policy_version'),
    list: ['cookies', 'theme', 'reduce_motion'],
    set(name, state, save=true) {
        console.log(name, state);

        if(save) this.save(name, state);
        document.querySelectorAll(`[data-option="${name}"]`).forEach(element => {
            console.log(element.tagName);
            let property = element.tagName === 'SELECT' ? 'value' : 'checked';
            element[property] = state
        }) // Update all checkboxes on page
        
        // Run after function
        let func = this.after[name];
        if(func !== undefined) func(state);
    },
    save(name, state) {
        this[name] = state;
        if(this.cookies || name === 'cookies') store(`main_${name}`, `${this[name]}`); // Save in localStorage
    },
    createListeners(parent=document, type='input') {
        let listener_type = type === 'select' ? 'change' : 'click';
        parent.querySelectorAll(`${type}[data-option]`).forEach(element => element.addEventListener(listener_type, function() {
            let option_name = this.dataset.option;
            options.set(option_name, type === 'select' ? this.value : this.checked);
        }));
    },
    updateAll(save=true) {
        for(let name of options.list) {
            let value = store(`main_${name}`);
            if(value == 'undefined') continue;
            try { value = JSON.parse(value); } catch (error) {}
            if(value) options.set(name, value, save);
        }
    },

    menu(close) {
        let menu = document.querySelector('#options'); // Palette already open
        if(menu !== null || close) return menu?.remove();

        let element = document.createElement('div');
        element.id = 'options';
        element.className = 'options';
        element.innerHTML = `
        <h3>Options</h3>
        <hr/>
        <div class="item">
            <img src="/assets/icon/moon.svg" class="icon" id="theme_button_icon">
            <p>Theme</p>
            <select name="theme_dropdown" id="theme_dropdown" data-option="theme">
                <option value="system">System (default)</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="red">Red</option>
            </select>
        </div>
        <div class="item">
            <img src="/assets/icon/motion_mode_FILL0_wght600_GRAD0_opsz20.svg" class="icon">
            <p>Reduce motion</p>
            <label class="switch">
                <input type="checkbox" data-option="reduce_motion">
                <span></span>
                <div class="off">O</div>
                <div class="on">I</div>
            </label>
        </div>
        <div class="item">
            <img src="/assets/icon/cookie_FILL1_wght600_GRAD0_opsz48.svg" class="icon cookie_icon">
            <p>
                Consent to cookies<br/>
                <span class="secondary_text"><a href="/about/#privacy">Privacy policy</a></span>
            </p>
            <label class="switch">
                <input type="checkbox" data-option="cookies">
                <span></span>
                <div class="off">O</div>
                <div class="on">I</div>
            </label>
        </div>`;

        body.append(element);
        this.createListeners(element);
        this.createListeners(element, 'select');
        this.updateAll(false);
    },

    /** Unique code to run after an option is changed */
    after: {
        'cookies': state => {
            options.set('policy_version', privacy_policy_version);
            if(!state) {
                for(let [key, value] of Object.entries(localStorage)) {
                    if(key.startsWith('main_') && key !== 'main_cookies') localStorage.removeItem(key);
                }
                // toast.send(undefined, 'Settings cleared');
            }
            // document.querySelectorAll('.cookie_icon').forEach(element => element.src = state ? '/assets/icon/cookie_FILL1_wght600_GRAD0_opsz48.svg' : '/assets/icon/cookie_off_FILL1_wght500_GRAD0_opsz24.svg');
        },
        'theme': state => {
            // Temporary
            function removeClassByPrefix(element, prefix) {
                var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
                element.className = element.className.replace(regx, '');
                return element;
            }

            removeClassByPrefix(body, 'theme_'); // Reset
            if(state !== 'system') body.classList.add(`theme_${state}`);

            let iconsrc = options.theme === 'light' ? '/assets/icon/sun.svg' : '/assets/icon/moon.svg';
            let theme_button_icon = document.getElementById('theme_button_icon');
            if(!theme_button_icon) return;
            if(theme_button_icon?.src?.endsWith?.(iconsrc)) return;

            theme_button_icon.classList.remove('a_rollout')
            theme_button_icon.classList.add('a_rollout');
            clearTimeout(ti1);
            clearTimeout(ti2);
            ti1 = setTimeout(themeIcon, 300);
            ti2 = setTimeout(() => theme_button_icon.classList.remove('a_rollout'), 600);
            /** Update theme button */
            function themeIcon() { theme_button_icon.src = iconsrc; }
        },
        'reduce_motion': state => {
            style(body, 'reduced_motion', state); // Set theme
            // reduce_motion.innerText = state ? 'Reduce motion ⏵︎' : 'Reduce motion ⏸︎';
        
            // Disable/enable AOS
            let alternate = true;
            document.querySelectorAll('[data-aos]').forEach(element => {
                element.setAttribute("data-aos", state ? "none" : alternate ? "fade-right" : "fade-left");
                alternate = !alternate;
            });

            // Video play/pause
            if(video_main) state ? video_main.pause() : video_main.play();

            // Icon
            let theme_button_icon = document.getElementById('theme_button_icon');
        }
    }
}

/** Toggle between dark/light mode */
function switchTheme(animate=true) {
    console.log('placeholder');   
}
/** Scrolls page to top */
function toTop(closemenu=false) {
    window.scrollTo({top:0, behavior:'smooth'})
    document.activeElement.blur(); // Move keyboard navigation back to start
    if(closemenu) toggleMenu();
}

/** Enlarge image */
function enlargeImage(event, close=false) {
    let p = document.querySelector('.enlarged_image'); // Enlarged image already exists
    if(p !== null) p.remove();
    if(close) return;
    let [src, alt] = [event.srcElement.src, event.srcElement.alt]
    let e = document.createElement('div');
    e.className = 'overlay enlarged_image';
    e.innerHTML = `<img src="${src}" alt="${alt}">`;
    e.addEventListener('click', this.remove);
    body.append(e);
}

/** Toast notification */
const toast = {
    container: document.body.appendChild(Object.assign(document.createElement('div'),{id:"toast_container"})),
    id: 0,

    send(title='', desc='', ...buttons) {
        let t = document.createElement('div');
        t.className = 'toast toast_in';
        t.dataset.toastId = this.id;

        // HTML
        let buttonHTML = '';
        if(buttonHTML !== undefined) {
            buttonHTML += '<div class="flex" style="margin-top: 12px;">';
            for(let button of buttons) {
                buttonHTML += `
                <button class="button full_width ${button.classes ?? ''}" onclick="${button.func}">
                    <p>${button.label}</p>
                    <div class="button_shade"></div>
                </button>`;
            }
            buttonHTML += '</div>';
        }

        t.innerHTML = `
        <div class="dismiss hover_underline" tabindex="0" role="button" onclick="toast.remove(this)">Dismiss</div>
        <h3>${title}</h3>
        <p class="secondary_text">
            ${desc}
        </p>
        ${buttonHTML}`;
        this.container.appendChild(t);
        this.id++;
    },
    remove(target) {
        let t = target.closest('.toast');
        t.remove();
        // t.classList.remove('toast_in');
        // t.classList.add('toast_out');
        // setTimeout(() => t.remove(), 300);
    }
}

/** Palette */
function palette(close) {
    let p = document.querySelector('.palette'); // Palette already open
    if(p !== null || close) return p?.remove();

    if(searchdata === undefined) searchdata = get('/search.json', true);

    // if(close) return;
    let e = document.createElement('div');
    e.className = 'overlay palette';

    function closePalette() {
        document.querySelector('.palette')?.remove();
    }

    // HTML
    e.innerHTML = `
    <div class="palette_inner">
        <div class="dialog_content">
            <label for="palette_search">
                <svg class="palette_symbol" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M375.478-306.999q-114.087 0-193.544-79.457Q102.477-465.913 102.477-580q0-114.087 79.457-193.544 79.457-79.457 193.544-79.457 114.087 0 193.544 79.457Q648.479-694.087 648.479-580q0 45.13-12.87 83.283-12.869 38.152-34.608 67.021l219.478 220.044q14.956 15.522 14.956 37.326 0 21.805-15.522 36.761-14.956 14.957-37.043 14.957-22.088 0-37.044-14.957L526.913-354.477q-29.435 21.739-68.152 34.608-38.718 12.87-83.283 12.87Zm0-106.002q69.913 0 118.456-48.543Q542.477-510.087 542.477-580q0-69.913-48.543-118.456-48.543-48.543-118.456-48.543-69.913 0-118.456 48.543Q208.479-649.913 208.479-580q0 69.913 48.543 118.456 48.543 48.543 118.456 48.543Z"/></svg>
                <input type="text" name="palette_search" id="palette_search" placeholder="Type to search" autocomplete="off" enterkeyhint="go">
            </label>
            <div class="palette_results"></div>
        </div>
    </div>
    `;
    e.addEventListener('click', event => { let classes = event.target.classList; if(classes.contains('overlay') || classes.contains('palette_inner')) closePalette() });
    body.append(e);

    // Focus
    let palette = document.querySelector('.palette');
    let search_bar = document.getElementById('palette_search');
    let results = document.querySelector('.palette_results');
    search_bar.focus();
    search_bar.addEventListener('keyup', search);

    /** Number min/max */
    function clamp(value, min, max) {
        if(value < min) value = min;
        else if(value > max) value = max;
        return value;
    }

    // Arrow keys
    let items; // Results list
    let index = 0;
    let active = 0;
    search_bar.addEventListener('keydown', event => {
        if(event.key === 'Enter') {
            items[active].click(); // Enter
            closePalette();
        }
        if(!event.key.startsWith('Arrow')) return;
        items.forEach(item => item.classList.remove('active')); // Reset
        if(event.key === 'ArrowDown') active++;
        else if(event.key === 'ArrowUp') active--;
        active = clampLoop(active, items.length);
        items[active].classList.add('active');
        items[active].scrollIntoView({
            block:"nearest",
            behavior:"smooth"
        });
        console.log(active);
    })
    // search();

    /** Populate search results */
    function search(event) {
        if(event.key.startsWith('Arrow')) return;
        let html = '';
        let term = search_bar.value;
        let unsorted = [];
        index = 0;
        active = 0;
        for(data of searchdata) {
            let includes = data.name.toLowerCase().includes(term);
            // let threshold = includes ? 1 : 3;
            let threshold = 3;
            // Typo correction
            let proximity = levenshtein(term.toLowerCase(), data.name.toLowerCase());
            let word_proximity = false;
            for(let word of data.name.split(' ')) if(levenshtein(term.toLowerCase(), word.toLowerCase()) <= threshold-1) word_proximity = true;

            // Matches search term
            if(
                // term === '' || // Is empty
                term !== '' && // Isn't empty
                (includes // Includes search term
                || word_proximity || proximity <= threshold) // Typo proximity
            ) {
                let src = data.icon ? `src="${data.icon}" alt="" ${data.filter_icon ? 'class="icon"' : ''}` : '';
                let external = data.type === 'url';
                proximity -= includes ? 10 : 0; // Increase rank if there is an exact match
                let item = `
                <a class="item" href="${data.url}">
                    <img ${src}>
                    <h4>${data.name}</h4>
                    <p class="secondary_text">
                        ${external ? data.url.replace(/https:\/\//g,'') : data.type}
                    </p>
                    ${external ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="ext"><path d="M6 2H4C2.89543 2 2 2.89543 2 4V10C2 11.1046 2.89543 12 4 12H10C11.1046 12 12 11.1046 12 10V8H10V10H4V4H6V2Z" fill="white"/><path d="M9.20711 1H12.5C12.7761 1 13 1.22386 13 1.5V4.79289C13 5.23835 12.4614 5.46143 12.1464 5.14645L11.182 4.18197L8.82493 6.53902C8.43441 6.92954 7.80124 6.92954 7.41072 6.53902C7.0202 6.14849 7.0202 5.51533 7.41072 5.1248L9.76776 2.76776L8.85355 1.85355C8.53857 1.53857 8.76165 1 9.20711 1Z" fill="white"/></svg>':''}
                </a>`;

                index++;
                unsorted.push({item, proximity});
            }
        }

        // Sort
        unsorted = unsorted.sort((a, b) => a.proximity - b.proximity);
        for(let item of unsorted) html += item.item;

        // Update page
        if(html === '' && term !== '') html = '<p class="secondary_text center">No results found</p>';
        results.innerHTML = html;
        items = Array.from(palette.querySelectorAll('.item'));
        items[active].classList.add('active');
    }
}

/** Dialog (enlarge image but for text) */
// function dialog(event) {
//     let content = event.srcElement.parentNode.lastElementChild;
//     if(content.className !== 'dialog_content') return console.warn('No content for dialog to show');

//     let p = document.querySelector('.dialog'); // Dialog already exists
//     if(p != undefined) p.remove();
//     let e = document.createElement('div');
//     e.classList.add('dialog')
//     e.innerHTML = `
//     <div class="dialog_content">
//         <button class="button bold dialog_close" style="float: right; width: 160px;" onclick="this.parentNode.parentNode.remove();">
//             <p>Done</p>
//             <div class="button_shade"></div>
//         </button>
//         ${content.innerHTML}
//     </div>`;
//     e.setAttribute('onclick', "if(event.srcElement.classList.contains('dialog')) this.remove();");
//     body.append(e);
// }

// Cookie notice
if(options.cookies === undefined) {
    toast.send(
        'Cookie Usage',
        'This website uses cookies to remember your settings and save game progress. It also uses third-party cookies to serve personalized ads on some pages. <a href="/about/#privacy">Privacy Policy</a>',
        { label:'Accept', classes:'button_white', func:`options.set('cookies', true); toast.remove(this);` },
        { label:'Reject', func:"options.set('cookies', false); toast.remove(this);" }
    )
}
    // Updated policy notice
else if(options.cookies !== false) {
    if(options.cookies !== 'false' && privacy_policy_version > options.policy_version) {
        toast.send('Privacy Policy Updated', 'Our privacy policy has been updated.<br/><a href="/about/#privacy">Privacy Policy</a>');
    }
}

// Option toggles
options.createListeners();
options.createListeners(undefined, 'select');
options.updateAll();



/** closeDetails - Replacement for dialog function */
// document.querySelectorAll('.dialog_close').forEach(element => {
//     element.addEventListener('click', event => {
//         let details = event.currentTarget.parentNode.parentNode.parentNode;
//         details.open = !details.open;
//     })
// });

/** Copy article URL */
function articleCopyURL(event) {
    let url = `${window.location.href}#${event.srcElement.parentNode.parentNode.id}`;
    let copy_text = document.createElement('textarea');
    copy_text.id = "copy_text";
    copy_text.value = url;
    body.appendChild(copy_text);
    let e = document.getElementById('copy_text');
    e.focus(); e.select();
    document.execCommand("copy");
    e.remove();
}

// Event listeners
//#region 
menu_button.addEventListener('click', toggleMenu);
backdrop.addEventListener('click', toggleMenu);
// theme_button.addEventListener('click', switchTheme);
document.getElementById('options_button').addEventListener('click', () => options.menu());
document.getElementById('search_button')?.addEventListener('click', () => palette());
/** Click on figure image to enlarge */
document.querySelectorAll('figure img').forEach(e => { e.setAttribute("tabindex", "0"); e.addEventListener('click', enlargeImage); });
// document.querySelectorAll('.dialog_trigger').forEach(e => { e.setAttribute("tabindex", "0"); e.addEventListener('click', dialog); });
document.querySelectorAll('article .article_url_button').forEach(e => { e.addEventListener('click', articleCopyURL); });
/** Enter acts as click */
document.addEventListener("keydown", e => {
    // if(document.activeElement.tagName == 'details') return;
    let key = e.key.toLowerCase();
    if(key === "enter") document.activeElement.click();
    else if(key === "escape") {
        enlargeImage(false, true);
        palette(true);
    }
    else if((e.ctrlKey || e.metaKey) && key === 'k') {
        e.preventDefault();
        palette();
    }
});

// let parallaxElement = document.getElementById('banner');
// let parallaxElement2 = document.getElementById('home_center');
// /** On scroll */
window.onscroll = () => {
    // Nav bar
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'nav_transparent', (distance <= 120));

    // Parallax
    // parallaxElement.style.transform = `translateY(${distance / 2.3}px)`;
    // parallaxElement2.style.transform = `translate(-50%, calc(${distance / 5}px - 50%))`;
};

/** On resize */
window.onresize = () => { if(hamburger_open && window.innerWidth > mobile_layout_width) toggleMenu(); };

/** On load */
(() => {
    // Reduced motion
    const reduce_motion_preference = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    // Theme
    // let t = store('main_theme');
    // if(t === null || t === 'false') return;
    // switchTheme(false);
})()
//#endregion

// Easter Egg
try {
    document.querySelector('#easter_egg').addEventListener('input', e => {
        let root = document.querySelector(':root');
        root.style.setProperty('--accent-color', e.srcElement.value);
        root.style.setProperty('--link-color', e.srcElement.value);
        root.style.setProperty('--gradient-b', e.srcElement.value);
    });
} catch (error) { console.warn(error); }
