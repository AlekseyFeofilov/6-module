function setCanvas()
{
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
}

function circle(e)
{
  if (!canDraw) return;
  if (count==50)
  {
    alert('Не поддерживается более 50 вершин');
    return;
  }
  if (isLines)
  {
    redraw();
    isLines = false;
  }
  count++;
  var X = e.clientX;
  var Y = e.clientY;
  var rect = canvas.getBoundingClientRect();
  drawCircle(X-rect.left, Y-rect.top, count);
  posX.push(X-rect.left);
  posY.push(Y-rect.top);
  
};

function drawCircle(X, Y, num)
{
  ctx.beginPath();
  ctx.arc(X, Y, 10, 0, 2*Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.fillStyle = 'white';
  if (num < 10) ctx.font = "14px Verdana";
  else ctx.font = "10px Verdana";
  ctx.fillText(num, X - 5 - (num >= 10), Y + 5 - (num >= 10));
  ctx.stroke();
}

function clearCanvas()
{
  if (!canDraw) return;
  posX.length = 0;
  posY.length = 0;
  count = 0;
  ctx.clearRect(0,0,canvas.width,canvas.height);
};


function redraw()
{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (var i =0; i<posX.length; ++i)
  {
    drawCircle(posX[i], posY[i], i + 1)
  }

};
function lines(gen)
{
  for (var i=0; i<gen.length; ++i)
  {
    let cur = gen[i];
    let curN = gen[i+1];
    ctx.beginPath();
    ctx.moveTo(posX[cur], posY[cur]);
    ctx.lineTo(posX[curN], posY[curN]);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(posX[0], posY[0]);
  ctx.lineTo(posX[gen[0]], posY[gen[0]]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(posX[0], posY[0]);
  ctx.lineTo(posX[gen[gen.length-1]], posY[gen[gen.length-1]]);
  ctx.stroke();
  isLines = true;
}
