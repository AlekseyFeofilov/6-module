function isRed(color){
    return color[0] === 255 && color[1] === 40 && color[2] === 40;
}

function isGreen(color){
    return color[0] === 40 && color[1] === 255 && color[2] === 40;
}

function isGrey(color){
    return color[0] === 128 && color[1] === 128 && color[2] === 128;
}

export {isGreen, isRed, isGrey};