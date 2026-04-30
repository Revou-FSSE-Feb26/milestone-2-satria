//local storage & leader board
// save score to localStorage using specific key per game
function saveScore(name, newScore, storageKey){
    const leaderboard = getLeaderboard(storageKey);

    //sanitize the name before storing to prevent XSS
    const safeName = sanitizeName(name);

    const existingIndex = leaderboard.findIndex(entry => entry.name === safeName);

    if(existingIndex !== -1){
        //update only if new score is higher
        if(newScore > leaderboard[existingIndex].score){
            leaderboard[existingIndex].score = newScore;
        }
    }else{
        //add new player entry
        leaderboard.push({name: safeName, score: newScore});
    }

    //Sort descending and keep top 5
    leaderboard.sort((a,b)=> b.score - a.score);
    const top5 = leaderboard.slice(0,5);

    localStorage.setItem(storageKey, JSON.stringify(top5))
}

//get leaderboard array from localStorage by key
function getLeaderboard(storageKey){
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
}

//render leaderboard to a given list element
function renderLeaderboard(storageKey, listElement){
    const leaderboard = getLeaderboard(storageKey);
    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

    if(leaderboard.length === 0){
        leaderboardList.innerHTML = `<li class="text-gray-600 text-xs text-center">No scores yet. Be the First!</li>`;
        return
    }

    //map each entry to a leaderboard list item
    listElement.innerHTML = leaderboard.map((entry,index) => `
        <li class="flex items-center justify-between bg-[#1E1E1E] px-3 py-1.4 rounded-lg">
            <span class="text-gray-300">${medals[index]} ${entry.name}</span>
            <span class="font-[orbitron] text-(--yellow-brand) text-sm font-bold">${entry.score} pts</span>
        </li>
    `).join("");
}

//sanitize the user input to prevent XSS
function sanitizeName(name){
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(name));
    return div.innerHTML
}