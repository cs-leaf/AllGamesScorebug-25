let logID = 1;
// TEAMS AND MATCH DATA
let teams = {
    team1: {
        // team info
        name: "Team1",
        slug: "TM1", // max 4 chars
        img: "https://placehold.co/400",
        pColor: "#FF0000",
        sColor: "#000000",
        // match info
        score: 0,
        timeouts: 2,
        players: [
            { name: "Player1" },
            { name: "Player2" },
            { name: "Player3" },
            { name: "Player4" },
            { name: "Player5" }
        ]
    },
    team2: {
        // team info
        name: "Team2",
        slug: "TM2", // max 4 chars
        img: "https://placehold.co/400",
        pColor: "#0000FF",
        sColor: "#FFFFFF",
        // match info
        score: 0,
        timeouts: 2,
        players: [
            { name: "Player1" },
            { name: "Player2" },
            { name: "Player3" },
            { name: "Player4" },
            { name: "Player5" }
        ]
    }
};

// FLIPPED
let flipped = false; // used to flip the teams on the scorebug

// GAMES
let gamesList = [`COD`, `OW2`, `R6`, `VAL`, `Other`];

// MAP POOLS
let bestOf = 3 // 1 = bo1, 3 = bo3 (defualt), 5 = bo5
let mapPool = { 
    COD: [`Map1`, `Map2`, `Map3`, `Map4`, `Map5`], // do specifics later...
    OW2: [`MapA`, `MapB`, `MapC`, `MapD`, `Dorado`],
    R6: [`Chalet`,`Kafe`,`MapX`, `MapY`, `MapZ`],
    VAL: [`Abyss`, `Ascent`, `Bind`, `Breeze`, `Corrode`, `Fracture`, `Haven`, `Icebox`, `Lotus`, `Pearl`, `Split`, `Sunset`],
};
let mapResults = {};
let currentMap = 1;

// FUNCTIONS
    // General Functions...
    // Control and Change Functions...
    function updateScore(teamID, scoreChange){ // updates the score of a team
        //keeps the score from going above or below 5
        const newScore = Math.max(0, teams[`team${teamID}`].score + scoreChange);
            if (newScore <= 5) {
                teams[`team${teamID}`].score = newScore;
                updateTextDOM(`score${teamID}`, newScore);
            }
    }
    function flipScorebug(){
        flipped = !flipped;
        newText = flipped ? "true" : "false";
        flipDivs();
        updateTextDOM("flipStatus", newText);
    }
    function updateSeries(bestOfID){
        bestOf = bestOfID;
        createMapSelect();
    }
    function updateCurrentMap(newValue){
        currentMap = newValue;
    }
    function updateMapResults(){
        for (let i = 0; i < bestOf; i++){
            const mapName = document.getElementById(`mapName${i+1}`).value;
            const mapResult = document.getElementById(`mapResult${i+1}`).value;
            const mapKey = `map${i+1}`;
            mapResults[mapKey] = [mapName, mapResult];
        }
        console.log(mapResults);
    }
    function updateTeamInfo(teamID, param, playerNum=null) { // updates the team info or player info
        if (playerNum !== null) { //if player number IS provided...
            const editValue = document.getElementById(`team${teamID}_p${playerNum}`).value
            teams[`team${teamID}`].players[playerNum - 1].name = editValue;
            console.log(`Updated Team ${teamID} ${param}:`, teams[`team${teamID}`][param]); // for monitoring, delete later
        } else{
            let editValue = document.getElementById(`inp_${param}${teamID}`).value
            teams[`team${teamID}`][param] = editValue;
            console.log(`Updated Team ${teamID} ${param}:`, editValue); // for monitoring, delete later
            if (param !== `pCol` && param !== `sCol` && param !== `img`){
                updateTextDOM(`${param}${teamID}`, editValue);
            }

        }
    }
    // HTML and DOM Functions...
    function updateTextDOM(elementID, newText) { //updates the text content on index.html
        document.getElementById(elementID).textContent = newText;
    }
    function createMapSelect(){
        const game = document.getElementById(`gameSel`).value;
        const target = document.getElementById(`mapControl`);
        target.innerHTML = ``; // clear the target.
        if (game != `Other`){
            for (let i = 0; i < bestOf; i++){
                const newDiv = document.createElement("div");
                const content = `<input type='radio' id='currentMap${i+1}' name='currentMapRadio' onclick='updateCurrentMap(${i+1})' style='margin: 5px'><select id='mapName${i+1}' onchange='updateMapResults()' style='margin: 5px'></select><select id='mapResult${i+1}' onchange='updateMapResults()' style='margin: 5px'></select>`
                newDiv.innerHTML = content;
                target.appendChild(newDiv)
                ///
                populateSelect(document.getElementById(`mapName${i+1}`), mapPool[game]); //populates the map name select
                ///
                const option0 = document.createElement("option"); //creates default option in mapResultX
                option0.value = 0;
                option0.textContent = '---';
                document.getElementById(`mapResult${i+1}`).appendChild(option0);
                const option1 = document.createElement("option"); //creates first option in mapResultX
                option1.value = 1;
                option1.textContent = teams.team1.slug;
                document.getElementById(`mapResult${i+1}`).appendChild(option1);
                const option2 = document.createElement("option"); //creates second option in mapResultX
                option2.value = 2;
                option2.textContent = teams.team2.slug;
                document.getElementById(`mapResult${i+1}`).appendChild(option2);
            }
            document.getElementById(`currentMap1`).setAttribute(`checked`, ``);
        }else{
            target.innerHTML = `<p>The game being played does not have map support. Sorry!</p>`
        }
    }
    function populateSelect(target, array){ //array refers to the list or array variable that will populate the list element, targetDOM refers to the DOM that will be populated.
        target.innerHTML = ""; //clear all older list data
        for (let i = 0; i < array.length; i++){
            const option = document.createElement("option");
            option.value = array[i];
            option.textContent = array[i];
            target.appendChild(option);
        }
    }
    function toggleDivs(className) { // toggles the visibility of divs with a specific class
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    });
    }
    function previewImg(event, imgId, teamID) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageSrc = e.target.result;
                document.getElementById(imgId).src = imageSrc;

                // Update the corresponding team's img property
                teams[`team${teamID}`].img = imageSrc;
                console.log(`Updated team${teamID} image:`);
            };
            reader.readAsDataURL(file);
        }
    }
    function flipDivs() {
        // flip the big one...
        const largeFlip = document.querySelector(`.controlField`);
        if (!largeFlip) return;
        const currentCtrlField = window.getComputedStyle(largeFlip).gridTemplateAreas; // Get current value set via CSS
        const normalLayoutCtrlField = `"field1 toggle field2" "other other other"`;
        const flippedLayoutCtrlField = `"field2 toggle field1" "other other other"`;
        largeFlip.style.gridTemplateAreas = currentCtrlField === normalLayoutCtrlField ? flippedLayoutCtrlField : normalLayoutCtrlField;
        // flip the smaller ones now...
        for (let i = 1; i <= 2 ; i++){
            const smallFlip = document.querySelector(`.field${i}`);
            const currentSmallField = window.getComputedStyle(smallFlip).gridTemplateAreas; // Get current value set via CSS
            const normalLayoutSmallField = `"inp${i} prev${i}" "roster${i} roster${i}"`;
            const flippedLayoutSmallField = `"prev${i} inp${i}" "roster${i} roster${i}"`;
            smallFlip.style.gridTemplateAreas = currentSmallField === normalLayoutSmallField ? flippedLayoutSmallField : normalLayoutSmallField;
        }
    }


// Starts the socket.io and connects to the server
const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
    console.log("WebSocket connection established.");
};
socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

populateSelect(document.getElementById('gameSel'), gamesList);
createMapSelect();
