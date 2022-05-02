const empty = ' ';
const zero = '';
const flag = '⛳';
const bomb = '!';
//const flag = 'F';
let field = [];
let bombs = [];
let bombs_around = [];
let size = 0;
let progress = 0;
let need_progress = 0;
let ending = false;

let value1 = 7;
let value2 = 25;

// background; empty; flag; number; body; bomb; text
//     0         1     2      3      4     5     6
let themes = [
    ['#fff', '#ccc', '#55d', '#5d5', '#eee', '#c21c1c', '#20232a'],
    ['#20232a', '#555', '#226', '#262', '#000', '#921c1c', '#fff']
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

function flip(i, j, txt, background) {
    field[i][j] = txt;
    let btn = search(i, j);
    btn.classList.add("flip");
    setTimeout((btn, txt, background) => {
        btn.innerHTML = txt;
        btn.style.background = background;
    }, 175, btn, txt, background);
    setTimeout((btn, i, j) => {
        btn.classList.remove("flip");
    }, 700, btn, i, j);
}

function can_touch(i, j) {
    return (!search(i, j).classList.contains("flip")) && !ending;
}

function set_flag(i, j) {
    if (can_touch(i, j)) {
        if (field[i][j] == flag) {
            flip(i, j, empty, theme[1]);
        } else if (field[i][j] == empty) {
            flip(i, j, flag, theme[2]);
        }
    }
}

function dig(i, j) {
    if ((field[i][j] == empty || field[i][j] == flag) && can_touch(i, j)) {
        if (bombs[i][j]) {
            lose(i, j);
        } else {
            let n = bombs_around[i][j];
            if (n == 0) {
                flip(i, j, zero, theme[3]);
                for (let i1 = Math.max(i - 1, 0); i1 <= Math.min(i + 1, size - 1); i1++) {
                    for (let j1 = Math.max(j - 1, 0); j1 <= Math.min(j + 1, size - 1); j1++) {
                        if (!(i1 == i && j1 == j)) {
                            setTimeout(dig, 100, i1, j1);
                        }
                    }
                }
            } else {
                flip(i, j, String(n), theme[3]);
            }
            progress++;
            if (progress == need_progress) {
                win();
            }
        }
    }
}

function shablon(txt) {
    game.style.height = '400px';
    game.style.width = '500px';
    game.innerHTML = `<h1>${txt}</h1>`;
    game.innerHTML += '<p id="val1" class="val"></p>';
    upd_val1(value1);
    game.innerHTML += `<input id="input_size" type="range" min="3" max="25" step="1" value="${value1}"
    oninput="upd_val1(this.value)" 
    onchange="upd_val1(this.value)">`;
    game.innerHTML += '<p id="val2" class="val"></p>';
    upd_val2(value2);
    game.innerHTML += `<input id="input_p" type="range" min="10" max="90" step="1" value="${value2}"
    oninput="upd_val2(this.value)" 
    onchange="upd_val2(this.value)">`;
    game.innerHTML += '<button onclick="new_game()" id="ok_btn">OK</button>';
    ok_btn.style.color = theme[6];
}

function upd_val1(val) {
    val1.innerHTML = `Размеры поля: ${val}`;
    value1 = val;
}

function upd_val2(val) {
    val2.innerHTML = `Вероятность появления бомбы: ${val}%`;
    value2 = val;
}

function end(n, f) {
    if (n == size * size) {
        f();
    } else {
        let j = n % size;
        let i = (n - j) / size;
        let t = 0;
        if (bombs[i][j]) {
            flip(i, j, bomb, theme[5]);
            t += 50;
        } else if (field[i][j] == flag) {
            flip(i, j, empty, theme[1]);
        }
        setTimeout(end, t, n + 1, f);
    }
}

function lose(i, j) {
    ending = true;
    flip(i, j, bomb, theme[5]);
    end(0, () => { setTimeout(shablon, 1000, "Ты проиграл!"); });
}

function win() {
    ending = true;
    end(0, () => { setTimeout(shablon, 1000, "Ты выиграл!"); });
}

function new_game() {
    size = input_size.value;
    progress = 0;
    need_progress = 0;
    bombs = [];
    field = [];
    ending = false;
    let f = '';
    for (let i = 0; i < size; i++) {
        bombs[i] = [];
        field[i] = [];
        f += '<div class = "row">';
        for (let j = 0; j < size; j++) {
            let is_bomb = boolRand(input_p.value / 100);
            bombs[i][j] = is_bomb;
            field[i][j] = empty;
            if (!is_bomb) {
                need_progress++;
            }
            f += `<button class='btn' oncontextmenu='set_flag(${i}, ${j})' onclick='dig(${i}, ${j})'>${empty}</button>`;
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
    theme = th;
    document.body.style.background = th[4];
    game.style.background = th[0];
    game.style.color = th[6];
    for (let btn of game.querySelectorAll("#ok_btn")) {
        btn.style.color = th[6];
    }
    for (let row of game.querySelectorAll('.row')) {
        for (let btn of row.querySelectorAll('.btn')) {
            btn.style.color = th[6];
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

document.oncontextmenu = () => { return false; }

set_theme(theme);
shablon('Начни играть!');
create_settings();