const empty = ' ';
const zero = '';
const flag = 'f';
const bomb = 'b';

let field = [];
let bombs = [];
let bombs_around = [];

let size = 0;

let progress = 0;

let ending = false;
let is_generated = false;

let value1 = 10;
let lvl = 2;
let value2;

let time_start;
let timer;

// elements; empty; flag; number; body; bomb; text; win; lose
//    0        1     2      3      4     5     6     7     8
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
let theme;
let theme_ind;

function boolRand(p) {
    return Math.random() < p;
}

function search(i, j) {
    return game.querySelectorAll('.row')[i].querySelectorAll('.btn')[j];
}

function around() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (bombs[i][j]) {
                bombs_around[i][j] = -1;
                for (let i1 = Math.max(i - 1, 0); i1 <= Math.min(i + 1, size - 1); i1++) {
                    for (let j1 = Math.max(j - 1, 0); j1 <= Math.min(j + 1, size - 1); j1++) {
                        if (!(i1 == i && j1 == j)) {
                            if (!bombs[i1][j1]) {
                                bombs_around[i1][j1]++;
                            }
                        }
                    }
                }
            }
        }
    }
}

function flip(i, j, txt, teg, background) {
    field[i][j] = teg;
    let btn = search(i, j);
    btn.classList.add("flip");
    setTimeout((btn, txt, background) => {
        btn.innerHTML = txt;
        btn.style.background = background;
        btn.style.backgroundSize = '90%';
    }, 175, btn, txt, background);
    setTimeout((btn) => {
        btn.classList.remove("flip");
    }, 700, btn);
}

function can_touch(i, j) {
    return (!search(i, j).classList.contains("flip")) && !ending;
}

function set_flag(i, j) {
    if (can_touch(i, j) && is_generated) {
        if (field[i][j] == flag) {
            flip(i, j, empty, empty, theme[1]);
            if (bombs[i][j]) {
                progress--;
            }
        } else if (field[i][j] == empty) {
            flip(i, j, empty, flag, theme[2]);
            if (bombs[i][j]) {
                progress++;
                if (progress == size * size) {
                    win();
                }
            }
        }
    }
}

function dig(i, j) {
    if ((field[i][j] == empty || field[i][j] == flag) && can_touch(i, j)) {
        if (!is_generated) generate(i, j);
        if (bombs[i][j]) {
            lose(i, j);
        } else {
            let n = bombs_around[i][j];
            if (n == 0) {
                flip(i, j, zero, zero, theme[3]);
                for (let i1 = Math.max(i - 1, 0); i1 <= Math.min(i + 1, size - 1); i1++) {
                    for (let j1 = Math.max(j - 1, 0); j1 <= Math.min(j + 1, size - 1); j1++) {
                        if (!(i1 == i && j1 == j)) {
                            setTimeout(dig, 100, i1, j1);
                        }
                    }
                }
            } else {
                flip(i, j, String(n), String(n), theme[3]);
            }
            progress++;
            if (progress == size * size) {
                win();
            }
        }
    }
}

function shablon() {
    time.innerHTML = '<a href="show_records.html">Рекорды</a>';
    game.style.height = '400px';
    game.style.width = '500px';
    game.innerHTML = `<h1>Сапёр</h1>`;
    game.innerHTML += '<p id="val1" class="val"></p>';
    upd_val1(value1);
    game.innerHTML += `<input id="input_size" type="range" min="5" max="25" step="1" value="${value1}"
    oninput="upd_val1(this.value)" 
    onchange="upd_val1(this.value)">`;
    game.innerHTML += '<p id="val2_1" class="val"></p>';
    game.innerHTML += `<input id="input_p" type="range" min="1" max="5" step="1" value="${lvl}"
    oninput="upd_val2(this.value)" 
    onchange="upd_val2(this.value)">`;
    game.innerHTML += '<p id="val2_2" class="val"></p>';
    upd_val2(lvl);
    ok_btn.onclick = new_game;
    ok_btn.innerHTML = 'Начать игру';
    ending = false;
    set_theme(theme_ind);
}

function upd_val1(val) {
    val1.innerHTML = `Размеры поля: ${val}`;
    value1 = val;
}

function upd_val2(level) {
    val2_1.innerHTML = `Уровень сложности: ${level}`
    val2_2.innerHTML = `Вероятность появления бомбы: ${level*15 - 5}%`;
    lvl = level;
    value2 = level * 15 - 5;
}

function end() {
    clearInterval(timer);
    ending = true;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (bombs[i][j]) {
                flip(i, j, empty, bomb, theme[5]);
            } else if (field[i][j] == flag) {
                flip(i, j, empty, empty, theme[1]);
            }
        }
    }
    ok_btn.onclick = shablon;
    ok_btn.innerHTML = 'Играть ещё';
}

function lose() {
    document.body.style.backgroundColor = theme[8];
    end();
}

function win() {
    document.body.style.backgroundColor = theme[7];
    let s = `${lvl}_${size}`;
    let t = (new Date() - time_start) / 1000;
    if (localStorage.getItem(s) == null || t < localStorage.getItem(s)) {
        localStorage.setItem(s, t);
    }
    end();
}

function generate(i, j) {
    bombs = [];
    for (let i1 = 0; i1 < size; i1++) {
        bombs[i1] = [];
        for (let j1 = 0; j1 < size; j1++) {
            if (Math.abs(i1 - i) <= 1 && Math.abs(j1 - j) <= 1) {
                bombs[i1][j1] = false;
            } else {
                let b = boolRand(value2 / 100);
                bombs[i1][j1] = b;
            }
        }
    }
    around();
    ok_btn.onclick = lose;
    ok_btn.innerHTML = 'Сдаюсь';
    is_generated = true;
    time_start = new Date();
    time.innerHTML = 0.0;
    timer = setInterval(() => {
        let d = (new Date() - time_start) / 1000;
        time.innerHTML = `${Math.floor(d / 60)}:${Math.floor(d % 60 / 10)}${Math.floor(d % 10)}.${Math.floor(d % 1 * 10)}`;
    }, 50);
}

function new_game() {
    is_generated = false;
    size = value1;
    progress = 0;
    field = [];
    let f = '';
    for (let i = 0; i < size; i++) {
        bombs[i] = [];
        field[i] = [];
        f += '<div class = "row">';
        for (let j = 0; j < size; j++) {
            field[i][j] = empty;
            f += `<button class='btn' oncontextmenu='set_flag(${i}, ${j})' onclick='dig(${i}, ${j})'>${empty}</button>`;
        }
        f += '</div>';
    }
    bombs_around = [];
    for (let i = 0; i < size; i++) {
        bombs_around[i] = [];
        for (let j = 0; j < size; j++) {
            bombs_around[i][j] = 0;
        }
    }
    game.style.width = `${40*size}px`;
    game.style.height = `${40*size}px`;
    game.innerHTML = f;
    set_theme(theme_ind);
    ok_btn.onclick = shablon;
    ok_btn.innerHTML = 'Назад';
}

function set_theme(n) {
    if (ending) return false;
    localStorage.setItem('theme', n);
    theme_ind = n;
    theme = themes[n];
    document.body.style.background = theme[4];
    game.style.background = theme[0];
    ok_btn.style.background = theme[0];
    game.style.color = theme[6];
    ok_btn.style.color = theme[6];
    time.style.color = theme[6];
    for (let a of document.querySelectorAll('a')) a.style.color = theme[6];
    let i = 0;
    for (let row of game.querySelectorAll('.row')) {
        let j = 0;
        for (let btn of row.querySelectorAll('.btn')) {
            btn.style.color = theme[6];
            if (field[i][j] == empty) {
                btn.style.background = theme[1];
            } else if (field[i][j] == flag) {
                btn.style.background = theme[2];
            } else {
                btn.style.background = theme[3];
            }
            btn.style.backgroundSize = '90%';
            j++;
        }
        i++;
    }
}

function create_settings() {
    settings.innerHTML = '';
    for (let i = 0; i < themes.length; i++) {
        settings.innerHTML += `<button onclick='set_theme(${i})' style='background: ${themes[i][0]};'></button>`;
    }
}

function start() {
    let th = localStorage.getItem('theme');
    if (th == null) {
        set_theme(0);
    } else {
        set_theme(th);
    }
    document.body.style.transition = '0.5s';

    function f() {
        return false;
    }
    window.oncontextmenu = f;
    // window.onkeydown = f;
    // window.onkeypress = f;

    shablon();
    create_settings();
}

start()