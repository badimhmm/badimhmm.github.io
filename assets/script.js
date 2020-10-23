let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let sizeInput = document.getElementById('size');
let scoreLabel = document.getElementById('score');
let endLabel = document.getElementById('welcome');

let score = 0;
let size = 4; // lebar papan main
let width = canvas.width / size - 6;
let cells = [];
let fontSize;
let loss = false;
startGame();

function cell(row, coll) {
    this.value = 0;
    this.x = coll * width + 5 * (coll + 1);
    this.y = row * width + 5 * (row + 1);
}

function createCells() {
    let i, j;
    for (i = 0; i < size; i++) {
        cells[i] = [];
        for (j = 0; j < size; j++) {
            cells[i][j] = new cell(i, j);
        }
    }
}

function drawCell(cell) {
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);
    switch (cell.value) {
        case 0:
            ctx.fillStyle = '#d9ce86'; //warna dasar
            break;
        case 2:
            ctx.fillStyle = '#a7a82c'; //score 2
            break;
        case 4:
            ctx.fillStyle = '#86873a'; // score 4
            break;
        case 8:
            ctx.fillStyle = '#aaab6d'; // score 8
            break;
        case 16:
            ctx.fillStyle = '#e7e89e'; // score 16
            break;
        case 32:
            ctx.fillStyle = '#d7d959'; // score 32
            break;
        case 64:
            ctx.fillStyle = '#fcff36'; // score 64
            break;
        case 128:
            ctx.fillStyle = '#91d47b'; // score 128
            break;
        case 256:
            ctx.fillStyle = '#3fd98e'; // score 256
            break;
        case 512:
            ctx.fillStyle = '#34cfc2'; // score 512
            break;
        case 1024:
            ctx.fillStyle = '#34adcf'; // score 1024
            break;
        default:
            ctx.fillStyle = '#ff0080';
    }

    ctx.fill();
    if (cell.value) {
        fontSize = width / 2;
        ctx.font = fontSize + 'px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(
            cell.value,
            cell.x + width / 2,
            cell.y + width / 2 + width / 7
        );
    }
}

function drawAllCells() {
    let i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            drawCell(cells[i][j]);
        }
    }
}

function canvasClean() {
    ctx.clearRect(0, 0, 500, 500);
}

document.onkeydown = function (event) {
    if (!loss) {
        if (event.keyCode === 38 || event.keyCode === 87) {
            moveUp();
        } else if (event.keyCode === 39 || event.keyCode === 68) {
            moveRight();
        } else if (event.keyCode === 40 || event.keyCode === 83) {
            moveDown();
        } else if (event.keyCode === 37 || event.keyCode === 65) {
            moveLeft();
        }
        scoreLabel.innerHTML = 'Score : ' + score;
    }
};

function startGame() {
    createCells();
    drawAllCells();
    pasteNewCell();
    pasteNewCell();
}

function pasteNewCell() {
    let countFree = 0;
    let i, j;
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            if (!cells[i][j].value) {
                countFree++;
            }
        }
    }
    if (!countFree) {
        finishGame();
        return;
    }

    while (true) {
        let row = Math.floor(Math.random() * size);
        let coll = Math.floor(Math.random() * size);
        if (!cells[row][coll].value) {
            cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
            drawAllCells();
            return;
        }
    }
}

function moveUp() {
    let i, j, row;
    for (j = 0; j < size; j++) {
        for (i = 1; i < size; i++) {
            if (cells[i][j].value) {
                row = i;
                while (row > 0) {
                    if (!cells[row - 1][j].value) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
                    } else if (cells[row][j].value == cells[row - 1][j].value) {
                        cells[row - 1][j].value *= 2;
                        score += cells[row - 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveRight() {
    let i, j;
    let coll;
    for (i = 0; i < size; i++) {
        for (j = size - 2; j >= 0; j--) {
            if (cells[i][j].value) {
                coll = j;
                while (coll + 1 < size) {
                    if (!cells[i][coll + 1].value) {
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll++;
                    } else if (
                        cells[i][coll].value == cells[i][coll + 1].value
                    ) {
                        cells[i][coll + 1].value *= 2;
                        score += cells[i][coll + 1].value;
                        cells[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveDown() {
    let i, j, row;
    for (j = 0; j < size; j++) {
        for (i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                row = i;
                while (row + 1 < size) {
                    if (!cells[row + 1][j].value) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                    } else if (cells[row][j].value == cells[row + 1][j].value) {
                        cells[row + 1][j].value *= 2;
                        score += cells[row + 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveLeft() {
    let i, j;
    let coll;
    for (i = 0; i < size; i++) {
        for (j = 1; j < size; j++) {
            if (cells[i][j].value) {
                coll = j;
                while (coll - 1 >= 0) {
                    if (!cells[i][coll - 1].value) {
                        cells[i][coll - 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll--;
                    } else if (
                        cells[i][coll].value == cells[i][coll - 1].value
                    ) {
                        cells[i][coll - 1].value *= 2;
                        score += cells[i][coll - 1].value;
                        cells[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function finishGame() {
    canvas.style.opacity = '0.3';
    loss = true;
    endLabel.innerHTML = 'Game Over!';
}
