const themes = [
    ['#fff',
        '#ccbfbf',
        'url("img/flag.png") center center / 90% no-repeat rgb(52, 64, 132)',
        '#45be35',
        '#ebe4e4',
        'url("img/bomb.png") center center / 90% no-repeat rgb(194, 28, 28)',
        '#20232a',
        '#2a9c2a',
        '#b01e1e'
    ],

    ['#20232a',
        '#5c4b4b',
        'url("img/flag.png") center center / 90% no-repeat rgb(24, 31, 74)',
        '#245d24',
        '#000',
        'url("img/bomb.png") center center / 90% no-repeat rgb(146, 28, 28)',
        '#fff',
        '#022802',
        '#3a0303'
    ]
];
let show = [];

function set_theme() {
    let n = localStorage.getItem('theme');
    let theme = themes[n];
    document.body.style.background = theme[4];
    document.body.style.color = theme[6];
    back.style.color = theme[6];
    records_div.style.background = theme[0];
    back.style.background = theme[0];
}

function f_show(i) {
    let x;
    if (show[i]) {
        x = [false, '+', true];
    } else {
        x = [true, '-', false];
    }
    show[i] = x[0];
    document.querySelectorAll('.show')[i].innerHTML = x[1];
    document.querySelector(`#records${i}`).hidden = x[2];
}

function generate() {
    for (let i = 0; i < 5; i++) {
        show.push(true);
        records_div.innerHTML += `<h2 onclick="f_show(${i})">Уровень сложности: ${i + 1} <span class='show'>-</span></h2>`
        records_div.innerHTML += `<div class="records" id="records${i}"></div>`;
        let div = document.querySelector(`#records${i}`)
        for (let size = 5; size <= 25; size++) {
            let t = localStorage.getItem(`${i + 1}_${size}`);
            if (t != null) {
                let s = `${Math.floor(t / 60)}:${Math.floor(t % 60 / 10)}${Math.floor(t % 10)}.${Math.floor(t % 1 * 10)}`
                div.innerHTML += `<p class="record">Размер: ${size}; время: ${s}</p>`
            }
        }
    }
}

function start() {
    function f() {
        return false;
    }
    window.oncontextmenu = f;
    // window.onkeydown = f;
    // window.onkeypress = f;

    generate()
    set_theme()
}

start()