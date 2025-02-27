document.addEventListener("DOMContentLoaded", () => {
    // Game setup variables
    let turns = 1;
    const chambers = 6;
    let bulletPosition = Math.floor(Math.random() * chambers) + 1; // Now mutable
    let killCounter = 0;
    let playerOffensiveShotUsed = false;
    let enemyOffensiveShotUsed = false;
    let gameStatus = document.getElementById("gameStatus");
    const btnShootSelf = document.getElementById("btnShootSelf");
    const btnShootEnemy = document.getElementById("btnShootEnemy");
    const timerDisplay = document.getElementById("timerDisplay"); // Element for timer display
    const leaderboardDisplay = document.getElementById("leaderboardDisplay"); // Element for leaderboard display

    // Start a 60-second countdown timer
    const gameDuration = 120000; // Milliseconds
    const startTime = Date.now();
    let gameTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = gameDuration - elapsed;
        if (remaining <= 0) {
            clearInterval(gameTimer);
            timerDisplay.textContent = "Time's up!";
            endGame();
        } else {
            timerDisplay.textContent = `Time left: ${Math.ceil(remaining / 1000)} seconds`;
        }
    }, 1000);

    console.log("Bullet is at chamber:", bulletPosition);
    loadTurn();

    btnShootSelf.addEventListener("click", () => {
        playerShootsSelf();
    });

    btnShootEnemy.addEventListener("click", () => {
        playerShootsEnemy();
    });

    // Game turn logic
    function loadTurn() {
        if (turns % 2 === 0) {
            gameStatus.textContent = "Enemy turn!";
            updateGameImage("/images/enemyIsPreparing.png");
            disableButtons();
            setTimeout(() => {
                if (turns > 5) {
                    enemyShootsPlayer();
                } else if (turns === 4) {
                    Math.random() > 0.5 ? enemyShootsPlayer() : enemyShootsSelf();
                } else {
                    enemyShootsSelf();
                }
            }, 3000);
        } else {
            console.log("Offensive shot status: ", playerOffensiveShotUsed);
            if(playerOffensiveShotUsed) {
                btnShootEnemy.style.display = "none";
            }
            gameStatus.textContent = "Your turn!";
            updateGameImage("/images/default.png");
            btnShootEnemy.style.backgroundColor = "blue";
            btnShootSelf.style.backgroundColor = "blue";
            btnShootEnemy.disabled = false;
            btnShootSelf.disabled = false;
        }
    }

    // Player shoots himself
    function playerShootsSelf() {
        updateGameImage("/images/playerShootsSelf.png")
        console.log("Player is trying to shoot himself at turn:", turns);
        setTimeout(() => {
            if (turns === bulletPosition) {
                gameStatus.textContent = "You shot yourself! finalizing score...";
                setTimeout(() => {
                    endGame();
                }, 2000);
                setTimeout(() => location.reload(), 10000);
            } else {
                gameStatus.textContent = "No shot fired. Enemy is preparing...";
                updateGameImage("/images/enemyIsPreparing.png");
                disableButtons();
                turns++;
                setTimeout(loadTurn, 5000);
            }
        }, 2000);
    }

    // Player shoots enemy
    function playerShootsEnemy() {
        updateGameImage("/images/playerShootsEnemy.png");
        disableButtons();
        playerOffensiveShotUsed = true;
        console.log("Player is shooting at turn:", turns);
        setTimeout(() => {
            if (turns === bulletPosition) {
                killCounter++; 
                gameStatus.textContent = "You shot and killed the enemy!";                setTimeout(resetRound, 5000);
            } else {
                gameStatus.textContent = "No shot fired. Enemy is preparing...";
                turns++;
                setTimeout(loadTurn, 5000);
            }
        }, 3000);
        
    }

    // Enemy shoots player
    function enemyShootsPlayer() {
        console.log("Enemy is shooting at turn:", turns);
        updateGameImage("/images/enemyShootsPlayer.png");
        enemyOffensiveShotUsed = true;
        if (turns === bulletPosition) {
            gameStatus.textContent = "Enemy shot and killed you! Game will restart shortly.";
            disableButtons();
            setTimeout(() => {
                endGame();
            }, 3000);
            setTimeout(() => location.reload(), 10000);
        } else {
            gameStatus.textContent = "Enemy tried to shoot you but no shot was fired. Your turn!";
            disableButtons();
            turns++;
            setTimeout(loadTurn, 5000);
        }
    }

    // Enemy shoots himself
    function enemyShootsSelf() {
        updateGameImage("/images/enemyShootsSelf.png")
        console.log("Enemy is shooting himself at turn:", turns);
        setTimeout(() => {
            if (turns === bulletPosition) {
                killCounter++; 
                gameStatus.textContent = "Enemy shot himself. You win this round!";
                disableButtons();
                setTimeout(resetRound, 5000);
            } else {
                gameStatus.textContent = "Enemy tried to shoot himself but no shot was fired. Your turn!";
                disableButtons();
                turns++;
                setTimeout(loadTurn, 5000);
            }
        }, 3000);
        
    }

    // Helper to disable buttons during transitions
    function disableButtons() {
        btnShootEnemy.disabled = true;
        btnShootSelf.disabled = true;
        btnShootEnemy.style.backgroundColor = "grey";
        btnShootSelf.style.backgroundColor = "grey";
    }

    // Resets the round (new enemy) with new bullet placement and turn reset
    function resetRound() {
        playerOffensiveShotUsed = false;
        enemyOffensiveShotUsed = false;
        turns = 1;
        bulletPosition = Math.floor(Math.random() * chambers) + 1; // New bullet position
        console.log("New enemy bullet position:", bulletPosition);
        gameStatus.textContent = "New enemy approaches! Your turn!";
        setTimeout(() => {
            loadTurn();
        }, 2000);
    }

    // Called when time is up
    function endGame() {
        playerOffensiveShotUsed = false;
        enemyOffensiveShotUsed = false;
        btnShootEnemy.disabled = true;
        btnShootSelf.disabled = true;
        gameStatus.textContent = "Finalizing scores...";
        setTimeout(() => {
            saveScore(killCounter);
            displayLeaderboard();
        }, 3000);
    }

    // Save score in localStorage (for a simple leaderboard)
    function saveScore(score) {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push({ score: score, timestamp: new Date().toISOString() });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }

    // Display the leaderboard
    function displayLeaderboard() {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        let html = "<h2>Leaderboard</h2>";
        leaderboard.forEach((entry, index) => {
            html += `<p>${index + 1}. Kills: ${entry.score} - ${new Date(entry.timestamp).toLocaleString()}</p>`;
        });
        leaderboardDisplay.innerHTML = html;
    }

// Change image
    function updateGameImage(newImageFileName) {
        console.log(newImageFileName)
        const imageElement = document.getElementById("gameImage");
        imageElement.src = newImageFileName;
    } 

});
