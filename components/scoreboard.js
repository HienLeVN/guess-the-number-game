let currentSortCol = null;
let sortDirection = 1; //1 = ascending, -1 = descending

function loadScores() {
    const scores = JSON.parse(localStorage.getItem("scoreboard")) || [];
    renderTable(scores);
    updateGameStats();
}

function renderTable(scores) {
    const scoreboardBody = document.getElementById("scoreboardBody");
    scoreboardBody.innerHTML = ""; //clear previous rows

    scores.forEach(score => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${score.date}</td>
            <td>${score.difficulty}</td>
            <td>${score.attempts}</td>
            <td>${score.time || "None"}</td>
        `;
        scoreboardBody.appendChild(row);
    })
}


function clearScores() {
    if(confirm("Are you sure you want to clear the scoreboard?")) {
        localStorage.removeItem("scoreboard");
        location.reload();
    }
}

function sortTable(column) {
    let scores = JSON.parse(localStorage.getItem("scoreboard")) || [];

    if(currentSortCol === column) {
        sortDirection *= -1; //reverse sort order
    }else {
        sortDirection = 1; // default to ascending
        currentSortCol = column;
    }

    scores.sort((a, b) =>{
        let valA = a[column];
        let valB = b[column];

        //Convert to numbers of sorting time or attempts
        if(column === "attempts" || column === "difficulty"){
            return (valA - valB) * sortDirection;
        }

        if(column === "time") {
            valA = valA === "None" ? Infinity : parseInt(valA.replace("s", ""));
            valB = valB === "None" ? Infinity : parseInt(valB.replace("s", ""));
            return (valA - valB) * sortDirection;
        }

        //Default string compare (for date)
        return valA.localeCompare(valB) * sortDirection;
    });

    renderTable(scores);
    updateSortArrows();
}

function updateSortArrows() {
    const columns = ['date', 'attempts', 'difficulty', 'time'];

    columns.forEach(col => {
        const arrowE1 = document.getElementById(`arrow-${col}`);
        if(!arrowE1) return;

        if (col === currentSortCol) {
            arrowE1.textContent = sortDirection === 1 ? '↑' : '↓';
        }else {
            arrowE1.textContent = "";
        }
    })
}

function updateGameStats() {
    const scores = JSON.parse(localStorage.getItem("scoreboard")) || [];

    const totalGames = scores.length;
    const totalAttempts = scores.reduce((sum, s) => sum + s.attempts, 0);
    const avgAttempts = totalGames ? (totalAttempts / totalGames).toFixed(2) : 0;

    const validTimes = scores
        .filter(s => s.time && s.time !== "None")
        .map(s => parseInt(s.time.replace("s", "")));
    
    const fastestTime = validTimes.length > 0 ? `${Math.min(...validTimes)}s` : "N/A";

    document.getElementById("totalGames").textContent = totalGames;
    document.getElementById("avgAttempts").textContent = avgAttempts;
    document.getElementById("fastestTime").textContent = fastestTime;

}

window.onload = loadScores;