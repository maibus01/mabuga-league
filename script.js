// Initialize teams data
let teamsData = JSON.parse(localStorage.getItem('mabugaLeagueData')) || [
    { id: 0, name: "Barcelona", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 1, name: "Manchester United", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 2, name: "Portugal", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 3, name: "Celtic", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 4, name: "Arsenal", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 5, name: "Chelsea", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 6, name: "Bayern Munich", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 7, name: "PSG", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 8, name: "Real Madrid", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { id: 9, name: "AJAX", played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0 }
];

// DOM elements
const tableBody = document.getElementById('league-body');
const updateTime = document.getElementById('update-time');
const addResultBtn = document.getElementById('add-result');
const resetLeagueBtn = document.getElementById('reset-league');

// Initialize
updateTime.textContent = new Date().toLocaleString();
updateTable();

// Event listeners
addResultBtn.addEventListener('click', addResult);
resetLeagueBtn.addEventListener('click', resetLeague);

function updateTable() {
    // Sort teams
    const sortedTeams = [...teamsData].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });

    // Update HTML
    tableBody.innerHTML = sortedTeams.map((team, index) => `
        <tr>
            <td class="position">${index + 1}</td>
            <td class="team-cell">${team.name}</td>
            <td class="stats-cell">${team.played}</td>
            <td class="stats-cell">${team.wins}</td>
            <td class="stats-cell">${team.draws}</td>
            <td class="stats-cell">${team.losses}</td>
            <td class="stats-cell">${team.gf}</td>
            <td class="stats-cell">${team.ga}</td>
            <td class="stats-cell highlight">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
            <td class="stats-cell highlight">${team.pts}</td>
        </tr>
    `).join('');

    // Save to localStorage
    localStorage.setItem('mabugaLeagueData', JSON.stringify(teamsData));
    updateTime.textContent = new Date().toLocaleString();
}

function addResult() {
    const homeIdx = parseInt(document.getElementById('homeTeam').value);
    const awayIdx = parseInt(document.getElementById('awayTeam').value);
    const homeScore = parseInt(document.getElementById('homeScore').value);
    const awayScore = parseInt(document.getElementById('awayScore').value);

    if (homeIdx === awayIdx) {
        alert("A team cannot play against itself!");
        return;
    }
    if (isNaN(homeScore) || isNaN(awayScore)) {
        alert("Please enter valid scores!");
        return;
    }

    const homeTeam = teamsData[homeIdx];
    const awayTeam = teamsData[awayIdx];

    // Update stats
    homeTeam.played++;
    awayTeam.played++;
    
    homeTeam.gf += homeScore;
    homeTeam.ga += awayScore;
    homeTeam.gd = homeTeam.gf - homeTeam.ga;
    
    awayTeam.gf += awayScore;
    awayTeam.ga += homeScore;
    awayTeam.gd = awayTeam.gf - awayTeam.ga;

    if (homeScore > awayScore) {
        homeTeam.wins++;
        homeTeam.pts += 3;
        awayTeam.losses++;
    } else if (homeScore < awayScore) {
        awayTeam.wins++;
        awayTeam.pts += 3;
        homeTeam.losses++;
    } else {
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.pts += 1;
        awayTeam.pts += 1;
    }

    // Clear inputs
    document.getElementById('homeScore').value = '';
    document.getElementById('awayScore').value = '';
    
    updateTable();
}

function resetLeague() {
    if (confirm("Are you sure you want to reset ALL league data?")) {
        localStorage.removeItem('mabugaLeagueData');
        teamsData = teamsData.map(team => ({
            ...team,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            pts: 0
        }));
        updateTable();
    }
}