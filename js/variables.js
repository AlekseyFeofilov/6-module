var colors = ["red", "green", "yellow", "purple", "blue", "skyblue", "pink", "brown", "orange", "white", "silver", "olive", "teal", "cyan", "darkred"]
var colors_2 = ["#800000", "#7FFF00", "#DAA520", "#B200FF", "#00008B", "#4682B4", "#FF1493", "#282117", "#FF4500", "#4B4B4B", "#9ACD32", "#20B2AA", "#B22222"]
var objects = [];
var centroids = [];
var canDraw = true; //можно ли рисовать в данный момент?
var canvas; //переменная для канваса
var ctx; //контекст канваса
var clusterCount; //кол-во центроидов

//для k-means
var sumX = [], sumY = [], objectInMean = [], last = [];

//для mst
var edges = [];

//для иерархической
var clusters = [];

