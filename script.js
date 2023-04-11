var sessionTimes = [];
var gamesFromReset = 0;
var resetButton;
var pomtenths;
var pomsecs;
var statList;
var timer;


window.onload = function () {
    var secs = 0;
    var tenthts = 0;
    var interval;
    var timerRunning = false;

    pomtenths = document.getElementById("tenths");
    pomsecs = document.getElementById("secs");
    resetButton = document.getElementById("fiveReset");
    statList = document.getElementById("sessionTimes");
    timer = document.getElementById("timer");
    rightHand = document.getElementById("rightHand");
    leftHand = document.getElementById("leftHand");
    

    document.onkeydown = (event) => {
        if (event.key == " ") {
            if(event.target = statList){
                event.preventDefault();
            }
            if(!timerRunning){
                timer.style.color = "red";
                rightHand.style.backgroundColor = "red";
                leftHand.style.backgroundColor = "red";
    
            }
            clearInterval(interval);
            document.onkeyup = function () {
                if(!timerRunning){
                    timer.style.color = "green";
                    rightHand.style.backgroundColor = "green";
                    leftHand.style.backgroundColor = "green";
                    setTimeout(() => {
                        timer.style.color = "black";
                        rightHand.style.backgroundColor = "yellow";
                        leftHand.style.backgroundColor = "yellow";

                    }, 100);
                }
                document.onkeyup = null;
                if (!timerRunning) {
                    timerRunning = true;
                    interval = setInterval(startTimer, 10);
                } else {
                    timerRunning = false;
                    if (secs > 0 || tenthts > 0) {
                        clearInterval(interval);
                        addElementToList(secs, tenthts);
                        updateSessionAverage(secs, tenthts);
                        updateLastFiveAverage();
                        updateMedian();
                        pomsecs.innerHTML = "00";
                        pomtenths.innerHTML = "00";
                        secs = 0;
                        tenthts = 0;
                    }
                }
            }
        }
    }

    function startTimer() {
        tenthts++;
        if (tenthts <= 9) {
            pomtenths.innerHTML = "0" + tenthts;
        }
        else if (tenthts > 9) {
            pomtenths.innerHTML = tenthts;
        }
        if (tenthts > 99) {
            secs++;
            tenthts = 0;
            pomtenths.innerHTML = "00";
            if (secs <= 9) {
                pomsecs.innerHTML = "0" + secs;
            }
            else {
                pomsecs.innerHTML = secs;
            }
        }
    }

    resetButton.onclick = (event) => {
        if (event.pointerType == "mouse") {
            gamesFromReset = 0;
            document.getElementById("lastFiveAverage").innerHTML = "00:00";
        }
    }
}


function addElementToList(sec, tenth) {
    var entry = document.createElement("li");
    entry.appendChild(document.createTextNode(parseTime(sec, tenth) + " D' U2 R2 D U2 F2 L B R F D L D2 R D2 B2 F2 R D2 F"));
    statList.insertBefore(entry, statList.firstChild);
}

function updateSessionAverage(secs, tenths) {
    var average = document.getElementById("sessionAverage");
    sessionTimes.push(secs * 100 + tenths);
    let sessionAverage = 0;
    for (var i = 0; i < sessionTimes.length; i++) {
        sessionAverage += sessionTimes[i];
    }
    sessionAverage = sessionAverage / sessionTimes.length;
    average.innerHTML = parseTime(parseInt(sessionAverage / 100), parseInt(sessionAverage % 100)); 
}

function updateLastFiveAverage() {
    var average = document.getElementById("lastFiveAverage");
    var fiveAverage = 0;
    gamesFromReset++;
    if (sessionTimes.length > 4 && gamesFromReset > 4) {
        for (var i = sessionTimes.length - 5; i < sessionTimes.length; i++) {
            fiveAverage += sessionTimes[i];
        }
        fiveAverage = fiveAverage / 5;
        average.innerHTML = parseTime(parseInt(fiveAverage /  100), parseInt(fiveAverage % 100));
    }
}

function updateMedian(){
    var median = document.getElementById("median");
    median.innerHTML = parseTime(parseInt(sessionTimes[parseInt(sessionTimes.length / 2)] / 100), parseInt(sessionTimes[parseInt(sessionTimes.length / 2)] % 100))
}

function parseTime(secs, tenths) {
    if (secs < 10) {
        secs = "0" + secs;
    }
    if (tenths < 10) {
        tenths = "0" + tenths;
    }

    return secs + ":" + tenths;
}