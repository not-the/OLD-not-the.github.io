// HTML
const body        = $('body'),
nav               = dom('nav'),
menu_button       = dom('menu_button'),
hamburger_menu    = dom('hamburger_menu'),
theme_button      = dom('theme_button'),
theme_button_icon = dom('theme_button_icon'),
video_main        = dom('video_main'),
reduce_motion     = dom('reduce_motion'),
backdrop          = dom('backdrop');

// Variables
const mobile_layout_width = 600;
var hamburger_open = false;
var theme = false; // true = light
var reducedMotion = false;
var ti1; // Timeout 1
var ti2; // Timeout 2

// Functions
/** Hamburger menu toggle */
function toggleMenu() {
    if(!hamburger_open && window.innerWidth > mobile_layout_width) return;
    hamburger_open = !hamburger_open;
    style(nav, 'menu_open', hamburger_open);    // Open navbar
    style(backdrop, 'visible', hamburger_open); // Show backdrop
}
/** Toggle between dark/light mode */
function switchTheme(animate=true) {
    theme = !theme;
    store('theme', `${theme}`); // Save in localStorage
    style(body, 'theme_light', theme); // Set theme
    if(!animate) return themeIcon(); // Animate
    theme_button_icon.classList.remove('a_rollout')
    theme_button_icon.classList.add('a_rollout');
    clearTimeout(ti1);
    clearTimeout(ti2);
    ti1 = setTimeout(themeIcon, 250);
    ti2 = setTimeout(() => { theme_button_icon.classList.remove('a_rollout'); }, 500);
    /** Update theme button */
    function themeIcon() { theme_button_icon.src = theme ? '/assets/icon/sun.svg' : '/assets/icon/moon.svg'; }
}
/** Scrolls page to top */
function toTop(closemenu=false) {
    window.scrollTo(0, 0);
    document.activeElement.blur(); // Move keyboard navigation back to start
    if(closemenu) toggleMenu();
}

/** Toggles "Reduce Motion" */
function toggleMotion() {
    reducedMotion = !reducedMotion;
    store('reducedMotion', `${reducedMotion}`); // Save in localStorage
    style(body, 'reduced_motion', reducedMotion); // Set theme
    reduce_motion.innerText = reducedMotion ? '⏵︎ Reduce motion' : '⏸︎ Reduce motion';

    // Disable/enable AOS
    let alternate = true;
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.setAttribute("data-aos", reducedMotion ? "none" : alternate ? "fade-right" : "fade-left");
        alternate = !alternate;
    });

    // Video play/pause
    if(reducedMotion) video_main.pause(); else video_main.play();
}

/** Enlarge image */
function enlargeImage(event, close=false) {
    let p = document.querySelector('.enlarged_image'); // Enlarged image already exists
    if(p != undefined) p.remove();
    if(close) return;
    let [src, alt] = [event.srcElement.src, event.srcElement.alt]
    let e = document.createElement('div');
    e.classList.add('enlarged_image')
    e.innerHTML = `<img src="${src}" alt="${alt}">`;
    e.setAttribute('onclick', "this.remove()");
    body.append(e);
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

/** closeDetails - Replacement for dialog function */
document.querySelectorAll('.dialog_close').forEach(element => {
    element.addEventListener('click', event => {
        let details = event.currentTarget.parentNode.parentNode.parentNode;
        details.open = !details.open;
    })
});

/** Copy article URL */
function articleCopyURL(event) {
    let url = `${window.location.href}#${event.srcElement.parentNode.parentNode.id}`;
    let copy_text = document.createElement('textarea');
    copy_text.id = "copy_text";
    copy_text.value = url;
    body.appendChild(copy_text);
    let e = dom('copy_text');
    e.focus(); e.select();
    document.execCommand("copy");
    e.remove();
}

// Event listeners
//#region 
menu_button.addEventListener('click', toggleMenu);
backdrop.addEventListener('click', toggleMenu);
theme_button.addEventListener('click', switchTheme);
/** Click on figure image to enlarge */
document.querySelectorAll('figure img').forEach(e => { e.setAttribute("tabindex", "0"); e.addEventListener('click', enlargeImage); });
// document.querySelectorAll('.dialog_trigger').forEach(e => { e.setAttribute("tabindex", "0"); e.addEventListener('click', dialog); });
document.querySelectorAll('article .article_url_button').forEach(e => { e.addEventListener('click', articleCopyURL); });
/** Enter acts as click */
document.addEventListener("keydown", e => {
    // if(document.activeElement.tagName == 'details') return;
    if(e.key === "Enter") document.activeElement.click();
    else if(e.key === "Escape") enlargeImage(false, true);
});

// let parallaxElement = video_main != null ? video_main : dom('banner');
let parallaxElement2 = dom('home_center');
/** On scroll */
window.onscroll = () => {
    // Nav bar
    let distance = document.documentElement.scrollTop || document.body.scrollTop;
    style(nav, 'nav_transparent', (distance <= 120));

    // Parallax
    // parallaxElement.style.transform = `translateY(${distance / 2.5}px)`;
    // parallaxElement2.style.transform = `translate(-50%, calc(${distance / 10}px - 50%))`;
};

/** On resize */
window.onresize = () => { if(hamburger_open && window.innerWidth > mobile_layout_width) toggleMenu(); };

/** On load */
window.onload = event => {
    // Reduced motion
    let m = store('reducedMotion');
    const reduce_motion_preference = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
    if(m == 'true' || m == null && reduce_motion_preference) toggleMotion();

    // Theme
    let t = store('theme');
    if(t == null || t == 'false') return;
    switchTheme(false);
};
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
