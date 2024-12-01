var gamegrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];
var moving = false;
const movingdelay = 10;
const anidelay = 100;
var score = 0;
var max_score = 0;
var hasWon = false;
//various settings for future implementation
//idk how to make a settings screen
var doScoreAnimations = true; //whether or not to show +2 +4 etc
var winOn2048 = true; //whether or not to show win screen every time 2048 is created
var useImages = false; //todo
//custom colors
//add shaking screen or smth

function diff(a, b) {
    let d = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (b[i][j] != a[i][j]) {
                d = true;
            }
        }
    }
    return d;
}
function calcExp(n) {
    return (Math.log2(n) - 0.1) * n;
}
function totalExp() {
    let sum = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            n = gamegrid[i][j];
            if (n != 0) {
                sum += calcExp(n);
            }
        }
    }
    return sum;
}
function bg(x, y) {
    let u = document.getElementsByClassName("game-container")[0];
    let c = document.createElement("div");
    c.setAttribute("class", "back");
    c.classList.add("trow" + x);
    c.classList.add("tcol" + y);
    u.appendChild(c);
}
function spawn(x, y, n) {
    gamegrid[x][y] = n;
    let u = document.getElementsByClassName("game-container")[0];
    let c = document.createElement("div");
    let p = document.createElement("b");
    c.setAttribute("class", "egg");
    text_to_display = "-";

    switch (n) {
        case 2:
            text_to_display = "S";
            break;
        case 4:
            text_to_display = "SC";
            break;
        case 8:
            text_to_display = "SCI";
            break;
        case 16:
            text_to_display = "SCIE";
            break;
        case 32:
            text_to_display = "SCIEN";
            break;
        case 64:
            text_to_display = "SCIENC";
            break;
        case 128:
            text_to_display = "SCIENCE";
            break;
        case 256:
            text_to_display = "SCIENCE F";
            break;
        case 512:
            text_to_display = "SCIENCE FA";
            break;
        case 1024:
            text_to_display = "SCIENCE FAI";
            break;
        case 2048:
            text_to_display = "SCIENCE FAIR";
            break;
    }

    p.innerHTML = text_to_display;
    c.classList.add("trow" + x);
    c.classList.add("tcol" + y);
    c.classList.add("val" + n);
    u.appendChild(c);
    setTimeout(() => {
        c.classList.add("tile");
        c.appendChild(p);
    }, anidelay);
    changeScore(n);
}
function rspawn() {
    let zeros = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gamegrid[i][j] == 0) {
                zeros.push([i, j]);
            }
        }
    }
    let p = Math.floor(Math.random() * zeros.length);
    let n = 2;
    if (Math.random() > 0.9) {
        n = 4;
    }
    spawn(zeros[p][0], zeros[p][1], n);
}
function find(x, y) {
    let v = document.getElementsByClassName(
        String("egg trow" + x + " tcol" + y)
    );
    return v[0];
}
function move(x1, y1, x2, y2) {
    let c = find(x1, y1);
    c.classList.remove("tcol" + y1);
    c.classList.add("tcol" + y2);
    c.classList.remove("trow" + x1);
    c.classList.add("trow" + x2);
}
function spawnNumber(x, y, n, z) {
    let c = document.createElement("div");
    let l = document.createElement("p");
    c.setAttribute("class", "score-add");
    c.style.top = y + "px";
    c.style.left = x + "px";
    l.innerHTML = "+" + String(n);
    c.appendChild(l);
    z.appendChild(c);
    return c;
}
function fadeNumber(c) {
    c.style.opacity = "0";
    let curx = parseInt(c.style.top);
    c.style.top = curx + 10 + "px";
    setTimeout(() => {
        c.parentNode.removeChild(c);
    }, 1000);
}

function horCrush() {
    let crushed = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let v = gamegrid[i][j];
            if (v > 0) {
                crushed[i].push(v);
            }
        }
    }
    //console.log(crushed)
    return crushed;
}
function verCrush() {
    let crushed = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let v = gamegrid[i][j];
            if (v > 0) {
                crushed[j].push(v);
            }
        }
    }
    //console.log(crushed)
    return crushed;
}
function rightCrush() {
    let crushed = horCrush();
    let ng = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        let row = crushed[i];
        let c = 0;
        for (let j = row.length - 1; j > -1; j--) {
            if (row[j] == c) {
                ng[i].unshift(c * 2);
                c = 0;
            } else if (c == 0) {
                c = row[j];
            } else {
                ng[i].unshift(c);
                c = row[j];
            }
        }
        if (c != 0) {
            ng[i].unshift(c);
        }
    }
    for (let i = 0; i < 4; i++) {
        while (ng[i].length < 4) {
            ng[i].unshift(0);
        }
    }
    return ng;
}
function leftCrush() {
    let crushed = horCrush();
    let ng = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        let row = crushed[i];
        let c = 0;
        for (let j = 0; j < row.length; j++) {
            if (row[j] == c) {
                ng[i].push(c * 2);
                c = 0;
            } else if (c == 0) {
                c = row[j];
            } else {
                ng[i].push(c);
                c = row[j];
            }
        }
        if (c != 0) {
            ng[i].push(c);
        }
    }
    for (let i = 0; i < 4; i++) {
        while (ng[i].length < 4) {
            ng[i].push(0);
        }
    }
    return ng;
}
function upCrush() {
    let crushed = verCrush();
    let ng = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        let col = crushed[i];
        let c = 0;
        for (let j = 0; j < col.length; j++) {
            if (col[j] == c) {
                ng[i].push(c * 2);
                c = 0;
            } else if (c == 0) {
                c = col[j];
            } else {
                ng[i].push(c);
                c = col[j];
            }
        }
        if (c != 0) {
            ng[i].push(c);
        }
    }
    for (let i = 0; i < 4; i++) {
        while (ng[i].length < 4) {
            ng[i].push(0);
        }
    }
    let ngl = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ngl[i][j] = ng[j][i];
        }
    }
    return ngl;
}
function downCrush() {
    let crushed = verCrush();
    let ng = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        let col = crushed[i];
        let c = 0;
        for (let j = col.length - 1; j > -1; j--) {
            if (col[j] == c) {
                ng[i].unshift(c * 2);
                c = 0;
            } else if (c == 0) {
                c = col[j];
            } else {
                ng[i].unshift(c);
                c = col[j];
            }
        }
        if (c != 0) {
            ng[i].unshift(c);
        }
    }
    for (let i = 0; i < 4; i++) {
        while (ng[i].length < 4) {
            ng[i].unshift(0);
        }
    }
    let ngl = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            ngl[i][j] = ng[j][i];
        }
    }
    return ngl;
}
function canMove() {
    if (diff(upCrush(), gamegrid)) {
        return true;
    }
    if (diff(downCrush(), gamegrid)) {
        return true;
    }
    if (diff(leftCrush(), gamegrid)) {
        return true;
    }
    if (diff(rightCrush(), gamegrid)) {
        return true;
    }
    return false;
}
function restart() {
    let s = document.getElementsByClassName("game-message")[0];
    s.setAttribute("class", "game-message");
    s.innerHTML = "";
    let c = document.getElementsByClassName("tile");
    for (let i = c.length - 1; i > 0; i--) {
        setTimeout(() => {
            c[i].parentNode.removeChild(c[i]);
        }, 10);
    }
    gamegrid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    rspawn();
    rspawn();
    moving = false;
    score = 0;
    changeScore(0);
}
function cont() {
    let s = document.getElementsByClassName("game-message")[0];
    s.setAttribute("class", "game-message");
    s.innerHTML = "";
    moving = false;
}
function won() {
    setTimeout(() => {
        moving = true;
    }, 120);
    let s = document.getElementsByClassName("game-message")[0];
    let g2 = document.createElement("div");
    g2.setAttribute("class", "gap");
    s.appendChild(g2);
    s.classList.add("game-won");
    //s.classList.remove('game-message');
    let m = document.createElement("b");
    m.innerHTML = "You Won!";
    let c = document.createElement("div");
    c.appendChild(m);
    s.appendChild(c);
    let g1 = document.createElement("div");
    g1.setAttribute("class", "gap");
    s.appendChild(g1);
    let b = document.createElement("div");
    let r = document.createElement("b");
    let g = document.createElement("div");
    r.innerHTML = "restart";
    b.appendChild(r);
    b.setAttribute("class", "restart-button");
    g.appendChild(b);
    b.addEventListener("click", restart);
    //s.appendChild(g);
    let b2 = document.createElement("div");
    let c2 = document.createElement("b");
    c2.innerHTML = "continue";
    b2.appendChild(c2);
    b2.setAttribute("class", "restart-button");
    g.appendChild(b2);
    b2.addEventListener("click", cont);
    s.appendChild(g);
}
function lost() {
    setTimeout(() => {
        moving = true;
    });
    let s = document.getElementsByClassName("game-message")[0];
    s.classList.add("game-lost");
    let g2 = document.createElement("div");
    g2.setAttribute("class", "gap");
    s.appendChild(g2);
    //s.classList.remove('game-message');
    let m = document.createElement("b");
    m.innerHTML = "You Lost";
    let c1 = document.createElement("div");
    c1.appendChild(m);
    s.appendChild(c1);
    let n = document.createElement("b");
    n.innerHTML = "The Game!";
    let c2 = document.createElement("div");
    c2.appendChild(n);
    s.appendChild(c2);
    let g1 = document.createElement("div");
    g1.setAttribute("class", "gap");
    s.appendChild(g1);
    let b = document.createElement("div");
    let r = document.createElement("b");
    r.innerHTML = "restart";
    b.appendChild(r);
    b.setAttribute("class", "restart-button");
    s.appendChild(b);
    b.addEventListener("click", restart);
}
function checkstates() {
    setTimeout(() => {
        if (!canMove()) {
            lost();
        }
    }, 10);
}
function changeScore(n) {
    score += n;
    m = document.getElementsByClassName("max-content")[0];
    s = document.getElementsByClassName("score-content")[0];
    s.innerHTML = score;
    if (score > max_score) {
        max_score = score;
        m.innerHTML = max_score;
        if (doScoreAnimations) {
            theta = Math.random() * 2 * Math.PI;
            r = Math.random() * 30 + 30;
            xdis = Math.floor(r * Math.cos(theta)) + 15;
            ydis = Math.floor(r * Math.sin(theta));
            //console.log(Math.sqrt(xdis**2+ydis**2))
            let z = m.parentElement;
            let c = spawnNumber(xdis, ydis, n, z);
            setTimeout(() => {
                fadeNumber(c);
            }, 100);
        }
    }
    if (doScoreAnimations) {
        theta = Math.random() * 2 * Math.PI;
        r = Math.random() * 30 + 30;
        xdis = Math.floor(r * Math.cos(theta)) + 15;
        ydis = Math.floor(r * Math.sin(theta));
        //console.log(Math.sqrt(xdis**2+ydis**2))
        let z = s.parentElement;
        let c = spawnNumber(xdis, ydis, n, z);
        setTimeout(() => {
            fadeNumber(c);
        }, 100);
    }
}
function mergeMove(x1, y1, x2, y2, r, ng) {
    let e = find(x1, y1);
    move(x1, y1, x2, y2);
    e.classList.remove("egg");
    if (r) {
        spawn(x2, y2, ng[x2][y2]);
        setTimeout(() => {
            e.parentNode.removeChild(e);
        }, anidelay);
        if (ng[x2][y2] == 2048) {
            if (!hasWon) {
                won();
                if (winOn2048) {
                    hasWon = true;
                }
            }
        }
    } else {
        setTimeout(() => {
            e.parentNode.removeChild(e);
        }, anidelay);
    }
}
function up() {
    if (moving) {
        console.log("moving");
        return 0;
    }
    let ng = upCrush();
    if (diff(ng, gamegrid)) {
        moving = true;
        setTimeout(() => {
            moving = false;
        }, movingdelay);
        for (let j = 0; j < 4; j++) {
            let c = 0;
            let r = false;
            for (let i = 0; i < 4; i++) {
                if (gamegrid[i][j] != 0) {
                    if (ng[c][j] == gamegrid[i][j]) {
                        move(i, j, c, j);
                        c++;
                    } else if (r) {
                        mergeMove(i, j, c, j, r, ng);
                        c++;
                        r = false;
                    } else {
                        mergeMove(i, j, c, j, r, ng);
                        r = true;
                    }
                }
            }
        }
        gamegrid = ng;
        rspawn();
        checkstates();
    }
}
function down() {
    if (moving) {
        console.log("moving");
        return 0;
    }
    let ng = downCrush();
    if (diff(ng, gamegrid)) {
        moving = true;
        setTimeout(() => {
            moving = false;
        }, movingdelay);
        for (let j = 0; j < 4; j++) {
            let c = 3;
            let r = false;
            for (let i = 3; i >= 0; i--) {
                if (gamegrid[i][j] != 0) {
                    if (ng[c][j] == gamegrid[i][j]) {
                        move(i, j, c, j);
                        c--;
                    } else if (r) {
                        mergeMove(i, j, c, j, r, ng);
                        c--;
                        r = false;
                    } else {
                        mergeMove(i, j, c, j, r, ng);
                        r = true;
                    }
                }
            }
        }
        gamegrid = ng;
        rspawn();
        checkstates();
    }
}
function left() {
    if (moving) {
        console.log("moving");
        return 0;
    }
    let ng = leftCrush();
    if (diff(ng, gamegrid)) {
        moving = true;
        setTimeout(() => {
            moving = false;
        }, movingdelay);
        for (let i = 0; i < 4; i++) {
            let c = 0;
            let r = false;
            for (let j = 0; j < 4; j++) {
                if (gamegrid[i][j] != 0) {
                    if (ng[i][c] == gamegrid[i][j]) {
                        move(i, j, i, c);
                        c = c + 1;
                    } else if (r) {
                        mergeMove(i, j, i, c, r, ng);
                        c = c + 1;
                        r = false;
                    } else {
                        mergeMove(i, j, i, c, r, ng);
                        r = true;
                    }
                }
            }
        }
        gamegrid = ng;
        rspawn();
        checkstates();
    }
}
function right() {
    if (moving) {
        console.log("moving");
        return 0;
    }
    let ng = rightCrush();
    if (diff(ng, gamegrid)) {
        moving = true;
        setTimeout(() => {
            moving = false;
        }, movingdelay);
        for (let i = 0; i < 4; i++) {
            let c = 3;
            let r = false;
            for (let j = 3; j > -1; j--) {
                if (gamegrid[i][j] != 0) {
                    if (ng[i][c] == gamegrid[i][j]) {
                        move(i, j, i, c);
                        c--;
                    } else if (r) {
                        mergeMove(i, j, i, c, r, ng);
                        c--;
                        r = false;
                    } else {
                        mergeMove(i, j, i, c, r, ng);
                        r = true;
                    }
                }
            }
        }
        gamegrid = ng;
        rspawn();
        checkstates();
    }
}
for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
        bg(i, j);
    }
}
rspawn();
rspawn();
document.addEventListener("keydown", function (event) {
    const callback = {
        ArrowLeft: left,
        ArrowRight: right,
        ArrowUp: up,
        ArrowDown: down,
    }[event.key];
    callback?.(); // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
});
document
    .getElementsByClassName("restart-button")[0]
    .addEventListener("click", restart);

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
    return (
        evt.touches || // browser API
        evt.originalEvent.touches
    ); // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
            left();
        } else {
            right();
        }
    } else {
        if (yDiff > 0) {
            up();
        } else {
            down();
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
}
