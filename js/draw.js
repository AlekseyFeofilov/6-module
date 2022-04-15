function setCanvas()
{
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
}

function circle(e)
{
  if (!canDraw) return;
  let X = e.clientX;
  let Y = e.clientY;
  let rect = canvas.getBoundingClientRect();
  drawCircle(X-rect.left-2, Y-rect.top-2, "ghostwhite");
  objects.push([X-rect.left-2, Y-rect.top-2, -1]);
};

function drawCircle(X, Y, color)
{
  ctx.beginPath();
  ctx.arc(X, Y, 6, 0, 2*Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPlus(X, Y, color)
{
  ctx.beginPath();
  ctx.rect(X-6, Y-2, 12, 4);
  ctx.rect(X-2, Y-6, 4, 12);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSquare(X, Y, color)
{
  ctx.beginPath();
  ctx.rect(X-8, Y-8, 16, 16);
  ctx.strokeWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function clearCanvas()
{
  if (!canDraw) return;
  objects = [];
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function coloring()
{
  for (let i=0; i<objects.length; ++i)
  {
    drawCircle(objects[i][0], objects[i][1], colors[objects[i][2] % colors.length]);
  }
  for (let i=0; i<centroids.length; ++i)
  {
    drawPlus(centroids[i][0], centroids[i][1], colors_2[i]);
  }
}

function lines()
{
  for (let i=0; i<objects.length; ++i)
  {
    ctx.beginPath();
    ctx.arc(objects[i][0], objects[i][1], 2, 0, 2*Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
  }
  for (let i=0; i<edges.length; ++i)
  {
    let cur = edges[i][0];
    let curN = edges[i][1];
    ctx.beginPath();
    ctx.moveTo(objects[cur][0], objects[cur][1]);
    ctx.lineTo(objects[curN][0], objects[curN][1]);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }
}

function coloring_2()
{
  let color = -1;
  for (let i=0; i<clusters.length; ++i)
  {
    if (clusters[i].length != 0) color++;
    for (let j=0; j<clusters[i].length; ++j)
    {
      let k = clusters[i][j];
      drawSquare(objects[k][0], objects[k][1], colors[color % colors.length]);
    }
  }
}

function show()
{
  clusterCount = document.getElementById("centroids").value;
  if (clusterCount > objects.length)
	{
		alert("Маленькое значение k");
		return;
	}
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let i=0; i<objects.length; ++i)
  {
    drawCircle(objects[i][0], objects[i][1], "ghostwhite");
  }
  let KMEANS = document.getElementById("kmeans").checked;
  let TREE = document.getElementById("mst").checked;
  let HIERARCHICAL = document.getElementById("hierarchical").checked;
  canDraw = false;
  if (KMEANS)
  {
    kmeans();
    coloring();
  }
  if (TREE)
  {
    MST();
    lines();
  } 
  if (HIERARCHICAL)
  {
    Hierarchical();
    coloring_2();
  }
  canDraw = true;
}