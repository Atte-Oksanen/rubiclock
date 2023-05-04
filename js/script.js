import { scrambleCube } from "./cubeScramble.js";
import { playSound } from "./sound.js";

const sessionTimes = [];
const scrambleStrings = [];
const hands = document.getElementsByClassName("hands");
const timer = document.getElementById("timer");
const params = new URLSearchParams(window.location.search);
const pomtenths = document.getElementById("tenths");
const pomsecs = document.getElementById("secs");
const inspSecs = document.getElementById("inspSecs");
let inspTime;
let gamesFromReset = 0;
let timerRunning = false;
let tenths = 0;
let secs = 0;
let timerInterval;
let inspInterval;
let handsYellow = "var(--handsYellow)";
let handsRed = "var(--handsRed)";
let handsGreen = "var(--handsGreen)";
let timerColor = "black";

window.onload = () => {
    document.onclick = (event) => clickEventDelegator(event);
    hands[0].onmousedown = (event) => primeStopwatch(event);
    hands[1].onmousedown = (event) => primeStopwatch(event);
    document.onkeydown = (event) => primeStopwatch(event);
    createCube();
    scramble();

    inspTime = params.get("inspt");
    if (inspTime == null) {
        inspTime = 15;
    }
    inspSecs.innerHTML = parseInt(inspTime);
    inspTime = inspTime * 100
}

function clickEventDelegator(event){
    switch (event.target.id) {
        case "settingsIcon":
            toggleSettings();
            break;
        case "fiveReset":
            resetFive(event);
            break;
        case "download":
            downloadTimes();
            break;
        case "closeHelp":
            closeHelp();
            break;
        case "shareButton":
            toggleShare();
            break;
        case "closeSettings":
            toggleSettings();
            break;
        case "closeShare":
            toggleShare();
            break;
        case "cancelShare":
            toggleShare();
            break;
        case "timePenalty":
            togglePenalty();
            break;
    }
}

function createCube() {
    let cube = document.getElementById("cube");
    cube.appendChild(createLayer("uplayer"));
    cube.appendChild(createLayer("leftlayer"));
    cube.appendChild(createLayer("frontlayer"));
    cube.appendChild(createLayer("rightlayer"));
    cube.appendChild(createLayer("backlayer"));
    cube.appendChild(createLayer("downlayer"));
}

function createLayer(className) {
    let layer = document.createElement("div");
    layer.id = className;
    layer.className = "grid-container";
    for (let n = 0; n < 9; n++) {
        let square = document.createElement("div");
        square.className = "grid-item";
        layer.appendChild(square);
    }
    return layer;
}
function scramble() {
    const scrambleArray = [];
    for (let index = 0; index < 20; index++) {
        let newMove = numberToScramble();
        while (scrambleArray.length > 0 && newMove[0] == scrambleArray[index - 1][0]) {
            newMove = numberToScramble();
        }
        scrambleArray.push(newMove);
    }
    scrambleStrings.push(scrambleArray);
    let scrambleString = scrambleArray[0];
    for (let index = 1; index < scrambleArray.length; index++) {
        scrambleString += " " + scrambleArray[index];
    }
    document.getElementById("scrambleSet").innerHTML = scrambleString;
    paint(scrambleCube(scrambleArray));
}

function numberToScramble() {
    let toReturn;
    switch (parseInt(Math.random() * new Date().getMilliseconds() % 6)) {
        case 1:
            toReturn = "F";
            break;
        case 2:
            toReturn = "R";
            break;
        case 3:
            toReturn = "U";
            break;
        case 4:
            toReturn = "B";
            break;
        case 5:
            toReturn = "L";
            break;
        default:
            toReturn = "D"
            break;
    }

    let num = Math.random() * new Date().getMilliseconds() % 1;
    if (num < 0.33) {
        toReturn += "2";
    } else if (num < 0.66) {
        toReturn += "'"
    }
    return toReturn;
}

function downloadTimes() {
    let temp = sessionTimes;
    temp.reverse();
    const link = document.createElement("a");
    let content = "Session times:";
    for (let index = 0; index < temp.length; index++) {
        content += "\n" + parseTime(temp[index]) + " | " + scrambleStrings[index];
    }
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "RubiClock_" + new Date().toISOString() + ".txt";
    link.click();
    URL.revokeObjectURL(link.href);
}


function resetFive(event) {
    if (event.pointerType == "mouse") {
        gamesFromReset = 0;
        document.getElementById("lastFiveAverage").innerHTML = "00.00";
    }
}

function primeStopwatch(event) {
    if (event.code == 'Space' || event.type == 'mousedown') {
        closeHelp();
        if (event.target == document.getElementById("nickName")) {
            return;
        }
        event.preventDefault();
        if (timerRunning) {
            clearInterval(inspInterval);
            operateTimer();
        }
        if (!timerRunning) {
            timer.style.color = handsRed;
            hands[0].style.backgroundColor = handsRed;
            hands[1].style.backgroundColor = handsRed;
        }
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onkeyup = null;
            operateInspTimer();
        }
        document.onkeyup = () => {
            document.onkeyup = null;
            document.onmouseup = null;
            operateInspTimer();
        }
    }
}

function operateTimer() {
    clearInterval(timerInterval);
    if (!timerRunning) {
        timer.style.color = handsGreen;
        hands[0].style.backgroundColor = handsGreen;
        hands[1].style.backgroundColor = handsGreen;
        setTimeout(() => {
            timer.style.color = timerColor;
            hands[0].style.backgroundColor = handsYellow;
            hands[1].style.backgroundColor = handsYellow;
        }, 400);
    }
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(runTimer, 10);
    } else {
        if (secs > 0 || tenths > 0) {
            clearInterval(timerInterval);
            addElementToTable(secs, tenths);
            updateSessionAverage(secs, tenths);
            updateLastFiveAverage();
            updateMedian();
            scramble();
            document.getElementById("tenths").innerHTML = "00";
            document.getElementById("secs").innerHTML = "00";
            secs = 0;
            tenths = 0;
        }
    }
}

function runTimer() {
    tenths++;
    if (tenths <= 9) {
        pomtenths.innerHTML = "0" + tenths;
    }
    else if (tenths > 9) {
        pomtenths.innerHTML = tenths;
    }
    if (tenths > 99) {
        secs++;
        tenths = 0;
        pomtenths.innerHTML = "00";
        if (secs <= 9) {
            pomsecs.innerHTML = "0" + secs;
        }
        else {
            pomsecs.innerHTML = secs;
        }
    }
}

function operateInspTimer() {
    clearInterval(inspInterval);
    if (!timerRunning && inspTime > 0) {
        inspInterval = setInterval(runInspTimer, 10);
    } else if (!timerRunning) {
        operateTimer();
    } else {
        timerRunning = false;
        inspTime = params.get("inspt");
        if (inspTime == null) {
            inspTime = 15;
        }
        inspSecs.innerHTML = parseInt(inspTime);
        inspTime = inspTime * 100
    }
}

function runInspTimer() {
    document.onkeydown = (event) => {
        if (event.code == "Space") {
            timer.style.color = handsGreen;
            hands[0].style.backgroundColor = handsGreen;
            hands[1].style.backgroundColor = handsGreen;
            event.preventDefault();
            document.onkeyup = () => {
                inspTime = 1;
            }
        }
    }
    hands[0].onmousedown = () => {
        inspTime = 1;
    }
    hands[1].onmousedown = () => {
        inspTime = 1;
    }
    inspTime--;
    inspSecs.innerHTML = parseInt(inspTime / 100 + 0.5);
    if ((inspTime == 300 || inspTime == 600) && params.has("timerSound")) {
        playSound();
    }
    if (inspTime === 0) {
        document.onkeydown = (event) => primeStopwatch(event);
        hands[0].onmousedown = (event) => primeStopwatch(event);
        hands[1].onmousedown = (event) => primeStopwatch(event);
        clearInterval(inspInterval);
        operateTimer();
    }
}


function addElementToTable(sec, tenth) {
    let statList = document.getElementById("sessionTimes");
    let entryContainer = document.createElement("tr");
    if (statList.innerText.includes("No times set")) {
        statList.innerHTML = "";
    }
    if (document.getElementById("shareButton") != null) {
        document.getElementById("shareButton").remove();
    }
    let scramble = document.createElement("td");
    let time = document.createElement("td");
    let shareButton = document.createElement("button");
    shareButton.id = "shareButton";
    shareButton.title = "Share your latest time";
    shareButton.innerHTML = "Share";
    let shareIcon = document.createElement("img");
    shareIcon.src = "../resources/share.png";
    shareIcon.id = "shareButton";
    shareButton.appendChild(shareIcon);
    let scrambleString = scrambleStrings[scrambleStrings.length - 1][0];
    for (let n = 1; n < scrambleStrings[scrambleStrings.length - 1].length; n++) {
        scrambleString += " " + scrambleStrings[scrambleStrings.length - 1][n];
    }
    scramble.appendChild(document.createTextNode(scrambleString));
    scramble.appendChild(shareButton);
    time.appendChild(document.createTextNode(parseTime(sec * 100 + tenth)));
    entryContainer.appendChild(time);
    entryContainer.appendChild(scramble);
    statList.insertBefore(entryContainer, statList.firstChild);
}

function updateSessionAverage(secs, tenths) {
    let sessionAverage = 0;
    sessionTimes.push(secs * 100 + tenths);
    for (var i = 0; i < sessionTimes.length; i++) {
        sessionAverage += sessionTimes[i];
    }
    sessionAverage = sessionAverage / sessionTimes.length;
    document.getElementById("sessionAverage").innerHTML = parseTime(sessionAverage);
}

function updateLastFiveAverage() {
    let fiveAverage = 0;
    gamesFromReset++;
    if (sessionTimes.length > 4 && gamesFromReset > 4) {
        for (var i = sessionTimes.length - 5; i < sessionTimes.length; i++) {
            fiveAverage += sessionTimes[i];
        }
        fiveAverage = fiveAverage / 5;
        document.getElementById("lastFiveAverage").innerHTML = parseTime(fiveAverage);
    }
}

function updateMedian() {
    let median = document.getElementById("median");
    const temp = sessionTimes;
    temp.sort((a, b) => { a - b });
    median.innerHTML = parseTime(temp[parseInt(temp.length / 2)]);
}

function parseTime(time) {
    let secs = parseInt(time / 100);
    let tenths = parseInt(time % 100);
    if (secs < 10) {
        secs = "0" + secs;
    }
    if (tenths < 10) {
        tenths = "0" + tenths;
    }

    return secs + "." + tenths;
}

function toggleSettings() {
    let background = document.getElementById("popUpBackground");
    let settings = document.getElementById("settings");
    if (params.get("theme") == "dark") {
        document.getElementById("darkTheme").selected = "selected";
    }
    if (params.get("timerSound") == "on") {
        document.getElementById("timerSound").checked = true;
    } else {
        document.getElementById("timerSound").checked = false;
    }
    document.getElementById("inspectionTime").value = parseInt(inspTime / 100);
    background.classList.toggle("hidden");
    background.classList.add("fadeInBackground");
    settings.classList.toggle("hidden");
    settings.classList.add("fadeInAnimation");
    background.addEventListener("click", toggleSettings);
}

function toggleShare() {
    let background = document.getElementById("popUpBackground");
    let share = document.getElementById("share");
    if (share.classList.contains("hidden")) {
        document.getElementById("timeToShare").value = parseTime(sessionTimes[sessionTimes.length - 1]);
        document.getElementById("formScramble").value = scrambleStrings[sessionTimes.length - 1];
    }
    background.classList.toggle("hidden");
    background.classList.add("fadeInBackground");
    share.classList.toggle("hidden");
    share.classList.add("fadeInAnimation");
    background.addEventListener("click", toggleShare);
}

function closeHelp() {
    document.getElementById("helpBox").classList.add("fadeOutAnimation");
    setTimeout(() => {
        document.getElementById("helpBox").classList.add("hidden");
    }, 1000);
}

function togglePenalty() {
    if (sessionTimes.length > 0) {
        if (document.getElementById("timePenalty").checked == true) {
            document.getElementById("timeToShare").value = parseTime(sessionTimes[sessionTimes.length - 1] + 200);
        } else {
            document.getElementById("timeToShare").value = parseTime(sessionTimes[sessionTimes.length - 1]);
        }
    }
}



function paint(cube) {
    let DOMCube = document.getElementById("cube").getElementsByTagName("div");
    let index = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3;) {
                if (!(index % 10 == 0 || index == 0)) {
                    let color;
                    switch (cube[i][j][k]) {
                        case 0:
                            color = "white";
                            break;
                        case 1:
                            color = "orange";
                            break;
                        case 2:
                            color = "green";
                            break;
                        case 3:
                            color = "red";
                            break;
                        case 4:
                            color = "blue";
                            break;
                        case 5:
                            color = "yellow"
                        default:
                            break;
                    }
                    DOMCube[index].style.backgroundColor = "var(--" + color + ")";
                    k++;
                }
                index++;
            }
        }
    }
}