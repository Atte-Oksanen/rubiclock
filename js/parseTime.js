export function parseTime(time) {
    let min = parseInt(time / 6000);
    let secs = parseInt(time / 100);
    let tenths = parseInt(time % 100);
    if(min < 10){
        min = "0" + min;
    }
    if(secs > 60){
        secs = secs - 60;
    }
    if (secs < 10) {
        secs = "0" + secs;
    }
    if (tenths < 10) {
        tenths = "0" + tenths;
    }

    return min + ":" + secs + "." + tenths;
}