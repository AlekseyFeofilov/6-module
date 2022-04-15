export function formatTime(time){
    let timeString = '';

    let temp = Math.floor(time / (3600 * 1000));
    time %= 3600 * 1000;

    if(temp !== 0){
        timeString += `${temp}h `;
    }

    temp = Math.floor(time / (60 * 1000));
    time %= 60 * 1000;

    if(temp !== 0){
        timeString += `${temp}m `;
    }

    temp = Math.floor(time / 1000);

    if(temp !== 0){
        timeString += `${temp}s`;
    }

    return timeString;
}