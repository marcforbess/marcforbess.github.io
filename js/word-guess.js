/**
 * Wordle Game Logic - Multi-Round Edition
 */

const WORDLE_CONFIG = {
    words: [
        {
            word: "TULIPS",
            hint: "Some flowers"
        },
        {
            word: "HEARTSTRINGS",
            hint: "When all of this, was just in the movies"
        },
        {
            word: "HANDBAG",
            hint: "For turning 25"
        },
        {
            word: "HAUS",
            hint: "A well-known lab? Idk"
        },
        {
            word: "HOCHI",
            hint: "Blotched tabby"
        },
        {
            word: "SAPA",
            hint: "Gets snowy sometimes"
        }
    ],
    maxTries: 6,
    discoveryTokenId: 13,
};

document.addEventListener('DOMContentLoaded', () => {
    let currentRound = 0;
    const words = WORDLE_CONFIG.words.map(w => w.word.trim().toUpperCase());
    const maxTries = WORDLE_CONFIG.maxTries;
    const discoveryTokenId = WORDLE_CONFIG.discoveryTokenId;

    let targetWord = "";
    let wordLength = 0;
    let currentRow = 0;
    let currentCol = 0;
    let guesses = [];
    let gameOver = false;

    const grid = document.getElementById('wordle-grid');
    const keyboard = document.getElementById('wordle-keyboard');
    const statusText = document.getElementById('session-status');
    const gameOverModal = document.getElementById('game-over-modal');
    const restartBtn = document.getElementById('restart-game-btn');

    function initRound() {
        targetWord = words[currentRound];
        wordLength = targetWord.length;
        currentRow = 0;
        currentCol = 0;
        guesses = Array(maxTries).fill("").map(() => Array(wordLength).fill(""));
        gameOver = false;

        // UI Updates
        statusText.textContent = "Word hint: " + WORDLE_CONFIG.words[currentRound].hint;
        grid.style.setProperty('--rows', maxTries);
        grid.style.setProperty('--cols', wordLength);

        // Hide modal
        gameOverModal.style.display = 'none';

        // Reset Keyboard Colors
        const keys = document.querySelectorAll('.key');
        keys.forEach(k => {
            k.classList.remove('correct', 'present', 'absent');
        });

        initGrid();
    }

    function initGrid() {
        grid.innerHTML = '';
        for (let r = 0; r < maxTries; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'wordle-row';
            rowDiv.id = `row-${r}`;
            for (let c = 0; c < wordLength; c++) {
                const tileDiv = document.createElement('div');
                tileDiv.className = 'wordle-tile';
                tileDiv.id = `tile-${r}-${c}`;
                rowDiv.appendChild(tileDiv);
            }
            grid.appendChild(rowDiv);
        }
    }

    function handleKeyInput(key) {
        if (gameOver) return;

        if (key === 'ENTER') {
            if (currentCol === wordLength) submitGuess();
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
            deleteLetter();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }

    function addLetter(letter) {
        if (currentCol < wordLength) {
            guesses[currentRow][currentCol] = letter;
            const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
            tile.textContent = letter;
            tile.classList.add('pop');
            setTimeout(() => tile.classList.remove('pop'), 100);
            currentCol++;

            // Auto-submit feature
            if (currentCol === wordLength) {
                setTimeout(() => {
                    if (!gameOver) submitGuess();
                }, 400); // 400ms delay to let user see final letter
            }
        }
    }

    function deleteLetter() {
        if (currentCol > 0) {
            currentCol--;
            guesses[currentRow][currentCol] = "";
            const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
            tile.textContent = "";
        }
    }

    function submitGuess() {
        if (currentCol !== wordLength) {
            shakeRow(currentRow);
            return;
        }

        const guess = guesses[currentRow].join("");
        revealRow(currentRow, guess);

        if (guess === targetWord) {
            handleWordSolved();
        } else if (currentRow === maxTries - 1) {
            endGame(false);
        } else {
            currentRow++;
            currentCol = 0;
        }
    }

    function shakeRow(row) {
        const rowEl = document.getElementById(`row-${row}`);
        if (rowEl) {
            rowEl.classList.add('shake');
            setTimeout(() => rowEl.classList.remove('shake'), 500);
        }
    }

    function revealRow(row, guess) {
        const rowTiles = [];
        for (let c = 0; c < wordLength; c++) {
            rowTiles.push(document.getElementById(`tile-${row}-${c}`));
        }

        const targetArr = targetWord.split("");
        const guessArr = guess.split("");
        const states = Array(wordLength).fill("absent");

        // First pass: Correct positions
        for (let i = 0; i < wordLength; i++) {
            if (guessArr[i] === targetArr[i]) {
                states[i] = "correct";
                targetArr[i] = null;
            }
        }

        // Second pass: Present elsewhere
        for (let i = 0; i < wordLength; i++) {
            if (states[i] === "correct") continue;
            const targetIdx = targetArr.indexOf(guessArr[i]);
            if (targetIdx !== -1) {
                states[i] = "present";
                targetArr[targetIdx] = null;
            }
        }

        rowTiles.forEach((tile, i) => {
            setTimeout(() => {
                tile.classList.add('flip');
                setTimeout(() => {
                    tile.classList.add(states[i]);
                    updateKeyColor(guessArr[i], states[i]);
                }, 200);
            }, i * 200);
        });
    }

    function updateKeyColor(letter, state) {
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        if (!key) return;

        if (state === "correct") {
            key.classList.remove('present', 'absent');
            key.classList.add('correct');
        } else if (state === "present" && !key.classList.contains('correct')) {
            key.classList.remove('absent');
            key.classList.add('present');
        } else if (state === "absent" && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.classList.add('absent');
        }
    }

    function handleWordSolved() {
        gameOver = true;
        const delay = wordLength * 200 + 1000;

        setTimeout(() => {
            if (currentRound < words.length - 1) {
                currentRound++;
                initRound();
            } else {
                endGame(true);
            }
        }, delay);
    }

    function endGame(win) {
        gameOver = true;

        if (win) {
            if (window.showUnlockModal) {
                window.showUnlockModal({
                    itemId: discoveryTokenId,
                    title: "Legendary Victory!",
                    itemName: "Puzzle Master Token",
                    description: `You've successfully solved all ${words.length} words! Your linguistic mastery is unrivaled.`
                });
            }
        } else {
            // Show custom game over modal
            setTimeout(() => {
                gameOverModal.style.display = 'flex';
            }, 1500);
        }
    }

    function restartGame() {
        currentRound = 0;
        initRound();
    }

    // Event Listeners
    restartBtn.addEventListener('click', restartGame);

    window.addEventListener('keydown', (e) => {
        handleKeyInput(e.key.toUpperCase());
    });

    keyboard.addEventListener('click', (e) => {
        const keyEl = e.target.closest('.key');
        if (keyEl) {
            handleKeyInput(keyEl.getAttribute('data-key'));
        }
    });

    initRound();
});
