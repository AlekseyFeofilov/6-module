function startDraw(event, context, mouse, offset) {
    mouse.x = event.pageX - offset.offsetLeft;
    mouse.y = event.pageY - offset.offsetTop;

    context.beginPath();
    context.moveTo(mouse.x, mouse.y);

    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 50;
}

function draw(event, context, mouse, offset) {
    mouse.x = event.pageX - offset.offsetLeft;
    mouse.y = event.pageY - offset.offsetTop;

    context.lineTo(mouse.x, mouse.y);
    context.stroke();
}

function stopDrawing(event, context) {
    context.closePath();
}

function clear(event, context, mouse, offset){
    mouse.x = event.pageX - offset.offsetLeft;
    mouse.y = event.pageY - offset.offsetTop;

    let a = 25;
    context.clearRect(mouse.x - a, mouse.y - a, a * 2, a * 2);
}

//DON'T PAY YOUR ATTENTION for that. It's the hidden function, I wasn't being worry about clear code because it's just a fast little test
function pixelDraw(event, context, mouse, offset){
    mouse.x = event.pageX - offset.offsetLeft;
    mouse.y = event.pageY - offset.offsetTop;


    let side = 15;
    let shift = {x: 0, y: 0};

    context.fillStyle = 'rgba(255, 255, 255, 1)'
    context.fillRect(mouse.x - side, mouse.y - side, side * 2, side * 2);

    context.fillStyle = 'rgba(255, 255, 255, 0.8)'
    side = 15;

    shift.x = side * 2;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    shift.x *= -1;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    [shift.x, shift.y] = [shift.y, shift.x];
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    shift.y *= -1;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    context.fillStyle = 'rgba(255, 255, 255, 0.2)'

    shift.x = shift.y = side * 2;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    shift.x *= -1;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    shift.y *= -1;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);

    shift.x *= -1;
    context.fillRect(mouse.x - side + shift.x, mouse.y - side + shift.y, side * 2, side * 2);
}

export {stopDrawing, draw, startDraw, clear, pixelDraw}