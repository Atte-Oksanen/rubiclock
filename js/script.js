const sessionTimes = [];
const scrambleStrings = [];
const hands = document.getElementsByClassName("hands");
const timer = document.getElementById("timer");
const params = new URLSearchParams(window.location.search);
const pomtenths = document.getElementById("tenths");
const pomsecs = document.getElementById("secs");
const inspSecs = document.getElementById("inspSecs");
let inspTime = params.get("inspt");
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
    document.getElementById("settingsIcon").onclick = () => toggleSettings();
    document.getElementById("shareButton").onclick = () => toggleShare();
    document.getElementById("fiveReset").onclick = (event) => resetFive(event);
    document.getElementById("download").onclick = () => downloadTimes();
    document.getElementById("closeHelp").onclick = () => closeHelp();
    hands[0].onmousedown = (event) => primeStopwatch(event);
    hands[1].onmousedown = (event) => primeStopwatch(event);
    scramble();

    if (params.get("timerSound") == "on") {
        document.getElementById("timerSound").checked = true;
    } else {
        document.getElementById("timerSound").checked = false;
    }
    if (params.get("theme") == "dark") {
        changeTheme();
    }
    if (inspTime == null) {
        inspTime = 15;
    }
    document.getElementById("inspectionTime").value = inspTime;
    inspSecs.innerHTML = inspTime;
    document.onkeydown = (event) => primeStopwatch(event);
}

function changeTheme() {
    document.querySelector("body").classList.add("dark");
    document.getElementById("darkTheme").selected = "selected";
    timerColor = "white";
    let links = document.getElementsByTagName("a");
    for(let n = 0; n < links.length; n++){
        links[n].href = links[n].href + "?theme=dark";
    }
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
    let scrambleString = scrambleArray[0];
    for (let index = 1; index < scrambleArray.length; index++) {
        scrambleString += " " + scrambleArray[index];
    }
    scrambleStrings.push(scrambleString);
    document.getElementById("scrambleSet").innerHTML = scrambleString;
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
            addElementToList(secs, tenths);
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
        inspInterval = setInterval(runInspTimer, 1000);
    } else if (!timerRunning) {
        operateTimer();
    } else {
        timerRunning = false;
        inspTime = params.get("inspt");
        if (inspTime == null) {
            inspTime = 15;
        }
        inspSecs.innerHTML = inspTime;
    }
}

function runInspTimer() {
    document.onkeydown = () => {
        inspTime = 1;
    }
    hands[0].onmousedown = () => {
        inspTime = 1;
    }
    hands[1].onmousedown = () => {
        inspTime = 1;
    }
    inspTime--;
    inspSecs.innerHTML = inspTime;
    if ((inspTime == 3 || inspTime == 6) && params.has("timerSound")) {
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


function addElementToList(sec, tenth) {
    let statList = document.getElementById("sessionTimes");
    if (statList.innerText.includes("No times set")) {
        statList.innerHTML = "";
    }
    let entry = document.createElement("li");
    entry.appendChild(document.createTextNode(parseTime(sec * 100 + tenth) + " | " + scrambleStrings[scrambleStrings.length - 1]));
    statList.insertBefore(entry, statList.firstChild);
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
    var median = document.getElementById("median");
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
    let background = document.getElementById("settingsBackground");
    let settings = document.getElementById("settings");
    background.classList.toggle("hidden");
    background.classList.add("fadeInBackground");
    settings.classList.toggle("hidden");
    settings.classList.add("fadeInAnimation");
    background.addEventListener("click", toggleSettings);
    document.getElementById("closeSettings").addEventListener("click", toggleSettings);
    document.getElementById("cancelSettings").addEventListener("click", toggleSettings);
}

function toggleShare() {
    let shareButton = document.getElementById("submitShare");
    shareButton.disabled = false;
    let background = document.getElementById("shareBackground");
    let share = document.getElementById("share");
    if (share.classList.contains("hidden")) {
        if (sessionTimes.length === 0) {
            shareButton.disabled = true;
        }
        else {
            document.getElementById("timeToShare").value = parseTime(sessionTimes[sessionTimes.length - 1]);
            document.getElementById("formScramble").value = scrambleStrings[sessionTimes.length - 1];
        }
    }
    background.classList.toggle("hidden");
    background.classList.add("fadeInBackground");
    share.classList.toggle("hidden");
    share.classList.add("fadeInAnimation");
    background.addEventListener("click", toggleShare);
    document.getElementById("closeShare").addEventListener("click", toggleShare);
    document.getElementById("cancelShare").addEventListener("click", toggleShare);
}

function closeHelp() {
    document.getElementById("closeHelp").onclick = null;
    document.getElementById("helpBox").classList.add("fadeOutAnimation");
    setTimeout(() => {
        document.getElementById("helpBox").classList.add("hidden");
    }, 1000);
}

function playSound() {
    let sound = new Audio("data:audio/mpeg;base64,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");
    sound.play();
}