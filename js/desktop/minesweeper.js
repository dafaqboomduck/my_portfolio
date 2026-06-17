// ========== MINESWEEPER GAME ==========
// CSS is linked statically via css/desktop/minesweeper.css (not injected).

class Minesweeper {
    constructor(container, rows = 9, cols = 9, mines = 10) {
        this.container = container;
        this.rows = rows;
        this.cols = cols;
        this.totalMines = mines;
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.minesLeft = mines;
        this.timeElapsed = 0;
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.board = [];
        this.revealed = [];
        this.flagged = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.minesLeft = this.totalMines;
        this.timeElapsed = 0;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;

        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            this.revealed[i] = [];
            this.flagged[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
                this.revealed[i][j] = false;
                this.flagged[i][j] = false;
            }
        }
        this.render();
    }

    placeMines(excludeRow, excludeCol) {
        let placed = 0;
        while (placed < this.totalMines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (this.board[r][c] !== -1 && !(r === excludeRow && c === excludeCol)) {
                this.board[r][c] = -1;
                placed++;
            }
        }
        this.calculateNumbers();
    }

    calculateNumbers() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] === -1) continue;
                let count = 0;
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        const ni = i + di, nj = j + dj;
                        if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols) {
                            if (this.board[ni][nj] === -1) count++;
                        }
                    }
                }
                this.board[i][j] = count;
            }
        }
    }

    reveal(row, col) {
        if (this.gameOver || this.gameWon) return;
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;
        if (this.revealed[row][col] || this.flagged[row][col]) return;

        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(row, col);
            this.startTimer();
        }

        this.revealed[row][col] = true;

        if (this.board[row][col] === -1) {
            this.gameOver = true;
            this.stopTimer();
            this.revealAll();
            this.render();
            return;
        }

        if (this.board[row][col] === 0) {
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    this.reveal(row + di, col + dj);
                }
            }
        }

        this.checkWin();
        this.render();
    }

    toggleFlag(row, col) {
        if (this.gameOver || this.gameWon) return;
        if (this.revealed[row][col]) return;

        this.flagged[row][col] = !this.flagged[row][col];
        this.minesLeft += this.flagged[row][col] ? -1 : 1;
        this.render();
    }

    revealAll() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.revealed[i][j] = true;
            }
        }
    }

    checkWin() {
        let unrevealedSafe = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (!this.revealed[i][j] && this.board[i][j] !== -1) {
                    unrevealedSafe++;
                }
            }
        }
        if (unrevealedSafe === 0) {
            this.gameWon = true;
            this.stopTimer();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            this.updateDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateDisplay() {
        const mineCounter = this.container.querySelector('.mine-counter');
        const timer = this.container.querySelector('.timer');
        if (mineCounter) mineCounter.textContent = String(this.minesLeft).padStart(3, '0');
        if (timer) timer.textContent = String(Math.min(this.timeElapsed, 999)).padStart(3, '0');
    }

    getNumberColor(num) {
        const dark = document.body.classList.contains('dark-theme');
        const light = ['', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
        const darkP = ['', '#6cb0ec', '#5fd35f', '#ff6b6b', '#9b8cff', '#ff9e6b', '#4fd0d0', '#e8e6e3', '#b0b4b8'];
        const colors = dark ? darkP : light;
        return colors[num] || (dark ? '#e8e6e3' : '#000');
    }

    render() {
        const faceEmoji = this.gameOver ? '😵' : this.gameWon ? '😎' : '🙂';

        this.container.innerHTML = `
            <div class="ms-game">
                <div class="ms-header">
                    <div class="ms-display mine-counter">${String(this.minesLeft).padStart(3, '0')}</div>
                    <button class="ms-face" onclick="minesweeperGame.init()">${faceEmoji}</button>
                    <div class="ms-display timer">${String(this.timeElapsed).padStart(3, '0')}</div>
                </div>
                <div class="ms-board" style="grid-template-columns: repeat(${this.cols}, 25px);">${this.renderBoard()}</div>
                ${this.gameOver ? '<div class="ms-message ms-lose">💥 Game Over! Click face to restart.</div>' : ''}
                ${this.gameWon ? '<div class="ms-message ms-win">🎉 You Win! Time: ' + this.timeElapsed + 's</div>' : ''}
                <div class="ms-controls">
                    <button class="vista-btn ms-btn" onclick="setDifficulty('easy')">Easy</button>
                    <button class="vista-btn ms-btn" onclick="setDifficulty('medium')">Medium</button>
                    <button class="vista-btn ms-btn" onclick="setDifficulty('hard')">Hard</button>
                </div>
            </div>
        `;
    }

    renderBoard() {
        let html = '';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const revealed = this.revealed[i][j];
                const flagged = this.flagged[i][j];
                const value = this.board[i][j];

                let cellClass = 'ms-cell';
                let content = '';

                if (revealed) {
                    cellClass += ' revealed';
                    if (value === -1) {
                        cellClass += ' mine';
                        content = '💣';
                    } else if (value > 0) {
                        content = `<span style="color:${this.getNumberColor(value)}">${value}</span>`;
                    }
                } else if (flagged) {
                    content = '🚩';
                }

                html += `<div class="${cellClass}" data-row="${i}" data-col="${j}"
                    onclick="minesweeperGame.reveal(${i},${j})"
                    oncontextmenu="event.preventDefault();minesweeperGame.toggleFlag(${i},${j})">${content}</div>`;
            }
        }
        return html;
    }
}

let minesweeperGame = null;

function initMinesweeper(container) {
    minesweeperGame = new Minesweeper(container, 9, 9, 10);
}

function setDifficulty(level) {
    const container = minesweeperGame.container;
    minesweeperGame.stopTimer();

    switch(level) {
        case 'easy':
            minesweeperGame = new Minesweeper(container, 9, 9, 10);
            break;
        case 'medium':
            minesweeperGame = new Minesweeper(container, 16, 16, 40);
            break;
        case 'hard':
            minesweeperGame = new Minesweeper(container, 16, 30, 99);
            break;
    }
}
