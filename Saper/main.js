const empty = ' ';
const zero = '';
const flag = '⛳';
let bombs = [];
let bombs_around = [];
let size = 0;
let progress = 0;
let need_progress = 0;

// background; empty; flag; number; body
let themes = [
    ['#eee', '#ccc', '#55d', '#5d5', '#eee'],
    ['#333', '#555', '#226', '#262', '#000']
];
let theme = themes[0];

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

function set_flag(i, j) {
    let btn = search(i, j);
    if (btn.innerHTML == flag) {
        btn.innerHTML = empty;
        btn.style.backgroundColor = theme[1];
    } else if (btn.innerHTML == empty) {
        btn.innerHTML = flag;
        btn.style.backgroundColor = theme[2];
    }
}

function dig(i, j) {
    let btn = search(i, j);
    if (btn.innerHTML == empty || btn.innerHTML == flag) {
        if (bombs[i][j]) {
            lose();
        } else {
            btn.style.backgroundColor = theme[3];
            let n = bombs_around[i][j];
            btn.innerHTML = String(n);
            progress++;
            if (progress == need_progress) {
                win();
            } else if (n == 0) {
                btn.innerHTML = zero;
                for (let i1 = Math.max(i - 1, 0); i1 <= Math.min(i + 1, size - 1); i1++) {
                    for (let j1 = Math.max(j - 1, 0); j1 <= Math.min(j + 1, size - 1); j1++) {
                        if (!(i1 == i && j1 == j)) {
                            dig(i1, j1);
                        }
                    }
                }
            }
        }
    }
}

function shablon(txt) {
    game.style.height = '400px';
    game.style.width = '500px';
    game.innerHTML = `<h1>${txt}</h1>`;
    game.innerHTML += '<p id="val1" class="val"></p>';
    upd_val1(7);
    game.innerHTML += `<input id="input_size" type="range" min="3" max="25" step="1" value="7"
    oninput="upd_val1(this.value)" 
    onchange="upd_val1(this.value)">`;
    game.innerHTML += '<p id="val2" class="val"></p>';
    upd_val2(25);
    game.innerHTML += `<input id="input_p" type="range" min="10" max="90" step="1" value="30"
    oninput="upd_val2(this.value)" 
    onchange="upd_val2(this.value)">`;
    game.innerHTML += '<button onclick="new_game()" id="new_game">OK</button>';
}

function upd_val1(val) {
    val1.innerHTML = `Размеры поля: ${val}`;
}

function upd_val2(val) {
    val2.innerHTML = `Вероятность появления бомбы: ${val}%`;
}

function lose() {
    shablon('Ты проиграл!');
}

function win() {
    shablon('Ты победил!');
}

function new_game() {
    size = input_size.value;
    progress = 0;
    need_progress = 0;
    let f = '';
    for (let i = 0; i < size; i++) {
        bombs[i] = [];
        f += '<div class = "row">';
        for (let j = 0; j < size; j++) {
            let is_bomb = boolRand(input_p.value / 100);
            bombs[i][j] = is_bomb;
            if (!is_bomb) {
                need_progress++;
            }
            f += `<button class='btn' onclick='set_flag(${i}, ${j})' ondblclick='dig(${i}, ${j})' onmousedown='return false'>${empty}</button>`;
        }
        f += '</div>';
    }
    if (need_progress == 0) {
        new_game();
        return 0;
    }
    bombs_around = [];
    for (let i = 0; i < size; i++) {
        bombs_around[i] = [];
        for (let j = 0; j < size; j++) {
            bombs_around[i][j] = 0;
        }
    }
    around();
    game.style.width = `${40*size}px`;
    game.style.height = `${40*size}px`;
    game.innerHTML = f;
    set_theme(theme);
}

function set_theme(th) {
    console.log(`Тема изменена на ${th}`);
    theme = th;
    document.body.style.background = th[4];
    game.style.background = th[0];
    for (let row of game.querySelectorAll('.row')) {
        for (let btn of row.querySelectorAll('.btn')) {
            if (btn.innerHTML == empty) {
                btn.style.background = th[1];
            } else if (btn.innerHTML == flag) {
                btn.style.background = th[2];
            } else {
                btn.style.background = th[3];
            }
        }
    }
}

function create_settings() {
    settings.innerHTML = '';
    for (let theme of themes) {
        let s = '';
        for (let col of theme) {
            s += `"${col}", `
        }
        settings.innerHTML += `<button onclick='set_theme([${s.slice(0, -2)}])'></button>`;
        document.querySelector("#settings button:last-child").style.background = theme[0];
    }
}

set_theme(theme);
shablon('Начни играть!');
create_settings();