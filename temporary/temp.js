// Author data
const not = {
    name: 'not-the',
    avatar: 'https://avatars.githubusercontent.com/u/87151784?v=4',
    github: 'https://github.com/not-the',
    // role: 'Author',
    role: false,
}
const body_early_project = `
<h3>Description</h3>
<p>
    Early project I made while learning web dev.
</p>`;
const body_no_desc = `
<h3>Description</h3>
<p class="gray"><i>No description available</i></p>`;


/** Project data */
const projects = {
    'carrotclicker': {
        path: 'carrot-clicker',
        name: 'Carrot Clicker',
        header: '/assets/project/carrot_clicker_big.png',
        // box_art: '',

        github_url: 'https://github.com/not-the/Carrot-Clicker',
        url: 'https://carrot.notkal.com/',
        // url_label: 'Play',
        author: not,
        body: /* html */ `
            <h3>Description</h3>
            <p>
                Carrot Clicker is an exponential clicker game inspired by titles like <a href="https://en.wikipedia.org/wiki/Cookie_Clicker" target="_blank" rel="noreferrer">Cookie Clicker</a> and <a href="https://en.wikipedia.org/wiki/Egg,_Inc." target="_blank" rel="noreferrer">Egg, Inc</a>, and has been an ongoing collaborative project between a friend and I since it got started in 2021. I had created a very simple clicker game to test my Javascript skills and the concept quickly evolved. The premise, gameplay, and characters all emerged from inside jokes as well as lore about a fictional religion my friend had created. Carrot Clicker is an admittedly flawed game that doesn't always follow best practices as far as web development goes, but it has taught me a lot about Javascript, and it was fun to create.
            </p>`,
    },
    'minecraftworlds': {
        path: 'minecraft-worlds',
        name: 'Minecraft Worlds',
        header: '/assets/project/minecraft_worlds_big.png',
        // box_art: '',

        github_url: 'https://github.com/not-the/Minecraft-Worlds-Directory',
        url: 'https://worlds.notkal.com/',
        // url_label: false,
        author: not,
        body: /* html */ `
            <h3>Description</h3>
            <p>
                This is a website I created to neatly organise downloads for old Minecraft worlds. I've also added screenshots, statistics and more. I learned a lot about accessibility during this project, specifically how difficult it is to maintain in a single-page application.
            </p>`,
    },
    'rubiks': {
        path: 'rubiks',
        name: 'Rubik\'s Cube',
        header: '/assets/project/rubiks_big.png',
        // box_art: '',

        github_url: 'https://github.com/not-the/puzzle-cube',
        url: 'https://rubiks.notkal.com/',
        // url_label: false,
        author: not,
        body: /* html */ `
            <h3>Description</h3>
            <p>
                My goal with this project was to create a digital Rubik's cube using only HTML, CSS and Javascript over a weekend. No canvases or 3D libraries are used.
            </p>`,
    },
    'confetti': {
        path: 'confetti',
        name: 'HTML Confetti',
        header: '/assets/project/confetti.png',
        // box_art: '',

        github_url: 'https://github.com/not-the/Mouse-Confetti',
        url: 'https://confetti.notkal.com/',
        // url_label: false,
        author: not,
        body: body_no_desc,
    },
    'tictactoe': {
        path: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        header: '/assets/project/ttt.png',
        // box_art: '',
        light: true,

        github_url: 'https://github.com/not-the/TicTacToe',
        url: 'https://tictactoe.notkal.com/',
        // url_label: 'Play',
        author: not,
        body: /* html */ `
            <h3>Description</h3>
            <p>
                Basic Tic Tac With a fun user interface.
            </p>`,
    },
    'cssloadingscreens': {
        path: 'css-loading-screens',
        name: 'CSS Loading Screens',
        // header: false,
        // box_art: '',

        github_url: 'https://github.com/not-the/Loading-Screens',
        url: 'https://not-the.github.io/Loading-Screens/',
        // url_label: false,
        author: not,
        body: /* html */ `
            <h3>Description</h3>
            <p>
                A small collection of CSS loading icons.
            </p>`,
    },

    // View more
    'geolocation': {
        path: 'geolocation',
        name: 'Geolocation',
        header: '/assets/project/geolocation_big.png',
        // box_art: '',
        light: true,

        github_url: 'https://github.com/not-the/geolocation-html',
        url: 'https://not-the.github.io/geolocation-html/',
        // url_label: false,
        author: not,
        body: body_early_project,
    },

    // View more
    'leapyears': {
        path: 'leap-years',
        name: 'Leap years list',
        // header: false,
        // box_art: '',

        github_url: 'https://github.com/not-the/LeapYear',
        url: 'https://not-the.github.io/LeapYear/',
        // url_label: false,
        author: not,
        body: body_early_project,
    },
    'jspyramid': {
        path: 'js-pyramid',
        name: 'JS Pyramid',
        // header: false,
        // box_art: '',

        github_url: 'https://github.com/not-the/js-pyramid',
        url: 'https://not-the.github.io/js-pyramid/',
        // url_label: false,
        author: not,
        body: body_early_project,
    },
}











/** Generate project page HTML */
function populatePage(id, fullpage=false) {
    const item = typeof id == 'string' ? projects?.[id] : id; // Get data
    if(item == undefined) return console.warn('Invalid ID');

    let title = `notkal - Projects / ${item.name}`;
    let box_art_html = item.box_art ? `<img src="${item.box_art}" alt="Icon" id="box_art">` : '';
    // let box_art_html = `<img src="${item.box_art || '/assets/decoration/blank.png'}" alt="Icon" id="box_art">`;
    let background_src = item.header ? ` style="background-image: url(${item.header})` : '';

    const html = /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>

    <!-- Visual -->
    <link rel="stylesheet" href="/index.css">
    <link rel="stylesheet" href="/projects/project.css">
    <meta name="theme-color" content="#171718"/>

    <!-- Meta -->
    <meta property="og:url" content="https://www.notkal.com/projects/${item.path}">
    <meta property="og:title" content="${title}">
    <!-- <meta property="og:description" content="${item.desc}"> -->
    <meta property="og:image" content="${item.header}">
    <!-- <meta name="twitter:image:alt" content="Alt text for image"> -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:site_name" content="notkal">

    <!-- not-util -->
    <link rel="stylesheet" href="https://not-the.github.io/not-util/not-util.css" crossorigin>
    <script src="https://not-the.github.io/not-util/not-util.js" crossorigin></script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body ${item.light ? 'class="light_header"' : ''}>
    <!---------- Navigation ---------->
    <nav id="nav" class="overlay_element flex nav_transparent">
        <!-- Menu button -->
        <div role="button" tabindex="0" id="menu_button" class="nav_button">
            <img src="/assets/icon/hamburger.svg" alt="Menu" id="menu_button_icon" class="icon button_icon">
        </div>

        <!-- Page name -->
        <h1 class="nav_item page_title">notkal</h1>

        <div class="flex" id="hamburger_menu">
            <!-- Nav items -->
            <div id="nav_list" class="flex">
                <a href="/" class="nav_item">Home</a>
                <a href="/#projects" class="nav_item">Projects</a>
                <a href="/#contact" class="nav_item">Contact</a>    
            </div>
            
            <!-- Additional buttons -->
            <div class="nav_item nav_right flex">
                <a href="https://github.com/not-the" target="_blank" rel=”noreferrer” title="Github">
                    <div class="nav_button">
                        <img src="/assets/icon/github.svg" alt="Github" class="icon button_icon">
                    </div>
                </a>
                <div role="button" tabindex="0" id="theme_button" class="nav_button">
                    <img src="/assets/icon/moon.svg" alt="Change Theme" id="theme_button_icon" class="icon button_icon">
                </div>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <header>
        <!-- Banner image -->
        <div id="banner" class="banner"${background_src};"></div>

        <!-- Title -->
        <div class="title_section container flex">
            <div>
                <h1>${item.name}</h1>
                <p id="path" class="secondary_text gray">
                    <a href="/">notkal</a> / <a href="/projects">Projects</a> / <a href="./">${item.name}</a>
                </p>
            </div>
            <div class="title_buttons flex">
                <!-- Github -->
                <a href="${item.github_url}" class="label_github" target="_blank" rel="noreferrer">
                    <div class="button bold small_button">
                        <img src="/assets/icon/github.svg" alt="View on Github" class="button_icon">
                        <div class="button_shade"></div>
                    </div>
                </a>
                <!-- Visit -->
                <a href="${item.url}" rel="noreferrer">
                    <div class="button bold button_blue">
                        <p>${item.url_label || 'Open'} <img src="/assets/icon/external_link.svg" alt="" class="button_icon"></p>
                        <div class="button_shade"></div>
                    </div>
                </a>
            </div>
        </div>
    </header>
    

    <!---------- Main ---------->
    <main id="main" class="doc container flex">
        <div class="info_column">
        ${box_art_html}
            <div class="user_card flex">
                <img src="${item.author.avatar}" alt="">
                <div>
                    <a href="${item.author.github}" target="_blank" rel="noreferrer" class="emphasize bold">${item.author.name}</a>
                    ${item.author.role ? `<p class="secondary_text">${item.author.role}</p>` : ''}
                </div>
            </div>
        </div>
        </div>
        <div class="body_column">
            ${item.body}
        </div>
    </main>

    <!---------- Footer ---------->
    <footer id="footer" class="flex">
        <div class="container">
            <div class="column">
                <!-- Attribution -->
                <p class="emphasize bold">Image attribution</p>
                <p>
                    <a href="https://www.pexels.com/video/changes-in-form-and-appearance-of-a-submerged-material-3163534/" target="_blank" rel="noreferrer">Header video</a> from <a href="https://www.pexels.com/">pexels.com</a>
                </p>
                <p>
                    <a href="https://commons.wikimedia.org/wiki/File:Hamburger_icon.svg" target="_blank" rel="noreferrer">Hamburger icon</a> by Timothy Miller, Public domain, via Wikimedia Commons
                </p>
                <p>
                    <a href="https://commons.wikimedia.org/wiki/File:Feather-weather-sun.svg" target="_blank" rel="noreferrer">Sun</a> and <a href="https://commons.wikimedia.org/wiki/File:Feather-weather-moon.svg" target="_blank" rel="noreferrer">Moon</a> icons by Cole Bemis, <a href="http://opensource.org/licenses/mit-license.php" target="_blank" rel="noreferrer">MIT</a>, via Wikimedia Commons
                </p>
                <p>
                    <a href="https://commons.wikimedia.org/wiki/File:Aiga_mail_inverted_nobg.svg" target="_blank" rel="noreferrer">Envelope icon</a> by US DoT - AIGA, Public domain, via Wikimedia Commons
                </p>
                <p>
                    <a href="https://commons.wikimedia.org/wiki/File:Antu_folder-cloud.svg" target="_blank" rel="noreferrer">Cloud Icon</a> by Fabián Alexis, <a href="https://creativecommons.org/licenses/by-sa/3.0" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>, via Wikimedia Commons
                </p>
                <br/>
    
                <!-- Copyright -->
                <p class="emphasize">Ⓒ 2022 notkal.com</p>
            </div>
            <div class="column">
                <a href="#" onclick="toTop()">Return to top</a>
            </div>
        </div>
    </footer>


    <!---------- Overlays ---------->
    <div id="backdrop"></div>

    <!-- JS -->
    <script src="/index.js"></script>
</body>
</html>
`;


    // Output
    document.getElementById('output').value = html;

    // Full page
    if(!fullpage) return;
    document.querySelector('body').innerHTML = html;
    // let lightstate = item.light ? ' class="light_header"' : '';
    style(document.querySelector('body'), 'light_header', item.light); // Doesn't work inline for some reason
}

/** Generate projects list HTML */
function populateList(fullpage=false) {
    let html = '';
    let keys = Object.keys(projects);

    for(i = 0; i < keys.length; i++) {
        let item = projects[keys[i]];
        
        html += /* html */ `
        <div class="project" id="${item.path}"${item.header ? `style="background: var(--project-gradient), url(${item.header});"` : ''}>
            <div class="title_section flex">
                <div>
                    <a href="/projects/${item.path}" class="project_link"><div class="project_link_area"></div></a>
                    <h3>${item.name}</h3>
                </div>
                <div class="title_buttons flex">
                    <!-- Github -->
                    <a href="${item.github_url}" class="label_github" target="_blank" rel="noreferrer">
                        <div class="button bold small_button">
                            <img src="/assets/icon/github.svg" alt="View on Github" class="button_icon">
                            <div class="button_shade"></div>
                        </div>
                    </a>
                    <!-- Visit -->
                    <a href="${item.url}">
                        <div class="button bold button_blue">
                            <p>${item.url_label || 'Open'} <img src="/assets/icon/external_link.svg" alt="" class="button_icon" rel="noreferrer"></p>
                            <div class="button_shade"></div>
                        </div>
                    </a>
                </div>
            </div>
        </div>`
        }
    

    // Output
    document.getElementById('output').value = html;

    // Full page
    if(!fullpage) return;
    document.querySelector('body').innerHTML = html;
    // let lightstate = item.light ? ' class="light_header"' : '';
    style(document.querySelector('body'), 'light_header', item.light); // Doesn't work inline for some reason
}