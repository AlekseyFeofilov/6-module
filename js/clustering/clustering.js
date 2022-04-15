function reset()
{
	sumX = [], sumY = [], objectInMean = [], last = [];
	for (let i=0; i<clusterCount; ++i)
	{
		sumX.push(0);
		sumY.push(0);
		objectInMean.push(0);
	}
}

function dist(objectA, objectB)
{
	let x_dist = objectA[0] - objectB[0]; 
	let y_dist = objectA[1] - objectB[1];
	return Math.sqrt(x_dist*x_dist + y_dist*y_dist);
}

function distSquare(objectA, objectB)
{
	let x_dist = objectA[0] - objectB[0]; 
	let y_dist = objectA[1] - objectB[1];
	return (x_dist*x_dist + y_dist*y_dist);
}

function Kmeans_plus_plus()
{
	let I = Math.floor(Math.random() * objects.length);
	centroids.push([objects[I][0], objects[I][1]]);
	for (let k = 1; k<clusterCount; ++k)
	{
		let dx = [];
		let summ = 0;
		for (let j=0; j<objects.length; ++j) dx.push(0);

		for (let i=0; i<objects.length; ++i)
		{
			let bestDist = Infinity;
			for (let j=0; j<centroids.length; ++j)
			{
				let distance = distSquare(objects[i], centroids[j]);
				if (distance < bestDist)
				{
					bestDist = distance;
					dx[i] = distance;
				}
			}
			summ+=dx[i];
		}
		let RND = summ*Math.random(), index;
		summ=0;
		for (index=0; index<dx.length; ++index)
		{
			summ+=dx[index];
			if (summ>RND) break;
		}
		centroids.push([objects[index][0], objects[index][1]])
	}	
}

function calibration()
{
	for (let j=0; j<clusterCount; ++j)
	{
		centroids[j][0] = sumX[j] / objectInMean[j];
		centroids[j][1] = sumY[j] / objectInMean[j];
	}
}

function assignment()
{
	reset();
	for (let i=0; i<objects.length; ++i)
	{
		last.push(objects[i][2]);
	}

	for (let i=0; i<objects.length; ++i)
	{
		let bestDist = Infinity;
		for (let j=0; j<clusterCount; ++j)
		{
			let distance = dist(objects[i], centroids[j]);
			if (distance < bestDist)
			{
				bestDist = distance;
				objects[i][2] = j;
			}
		}
		let current = objects[i][2];
		objectInMean[current]++;
		sumX[current] += objects[i][0];
		sumY[current] += objects[i][1];
	}

	for (let i=0; i<objects.length; ++i)
	{
		if (objects[i][2] != last[i]) return 1;
	}
	return 0;
}

function next()
{
	calibration();
	return assignment();
}

function rating()
{
	let sum = 0;
	for (let i=0; i<objects.length; ++i)
	{
		let bestDist = Infinity;
		for (let j=0; j<clusterCount; ++j)
		{
			let distance = distSquare(objects[i], centroids[j]);
			if (distance < bestDist)
			{
				bestDist = distance;
			}
		}
		sum += bestDist;
	}
	return sum;
}

function kmeans()
{
	let OBJECTS = [];
	let CENTROIDS = [];
	let RATING = Infinity;
	for (let k = 0; k<80; ++k)
	{
		centroids = [];
		reset();
		Kmeans_plus_plus();
		assignment();
		for (; next(); );
		let RATE = rating();
		if (RATE < RATING)
		{
			RATING = RATE;
			OBJECTS = [];
			CENTROIDS = [];
			for (let i = 0; i<objects.length; ++i)
			{
				OBJECTS.push([objects[i][0], objects[i][1], objects[i][2]])
			}
			for (let i = 0; i<centroids.length; ++i)
			{
				CENTROIDS.push([centroids[i][0], centroids[i][1]])
			}
		}
	}
	objects = OBJECTS.slice(0);
	centroids = CENTROIDS.slice(0);
	coloring(); 
}

function getEdges()
{
	for (let i=0; i<objects.length; ++i)
	{
		for (let j=0; j<objects.length; ++j)
		{
			if (i!=j) edges.push([i, j, dist(objects[i], objects[j])]);
		}
	}
}

function sortFunction(a, b)
{
    if (a[2] === b[2]) return 0;
    else return (a[2] < b[2]) ? -1 : 1;
}


function kruskal()
{
	let cost_answ = 0, n = objects.length;
	let h;
	for (h=1; h<=Math.floor(edges.length/9); h=3*h + 1);
	while (h>=1) 
	{
		for (let i=h; i<edges.length; i++)
		{
			for (let j=i-h; j>=0 && (edges[j][2] > edges[j+h][2]); j-=h) 
			{
				[edges[j], edges[j+h]] = [edges[j+h], edges[j]];
			}
		}
		h=(h-1)/3;
	}
	let tree = [], answer = [];
	for (let i=0; i<n; i++) 
	{
		tree.push(i);
	}
	for (let i=0; i<edges.length; i++) 
	{
		let a = edges[i][0], b = edges[i][1], c = edges[i][2];
		if (tree[a] != tree[b]) {
			cost_answ += c;
			answer.push([a, b, c]);
			let old_id = tree[b],  new_id = tree[a];
			for (let j=0; j<n; j++)
				if (tree[j] == old_id)
					tree[j] = new_id;
		}
	}

	edges = answer;
	edges.sort(sortFunction);
	for (let i=0; i<clusterCount - 1; ++i)
	{
		edges.pop();
	}
}

function MST()
{
	edges = [];
	clusterCount = document.getElementById("centroids").value;
	getEdges();
	kruskal();
	lines();
}

function initHierarchical()
{
	clusters = [];
	for (let i = 0; i<objects.length; ++i)
	{
		clusters.push([i]);
	}
}

function distSingleLinkage(clusterA, clusterB)
{
	let minDist = Infinity;
	for (let i =0; i<clusterA.length; ++i)
	{
		for (let j =0; j<clusterB.length; ++j)
		{
			let DIST = dist(objects[clusterA[i]], objects[clusterB[j]]);
			if (DIST < minDist) minDist = DIST;
		}
	}
	return minDist;
}

function Hierarchical()
{
	clusterCount = document.getElementById("centroids").value;
	initHierarchical();
	for (let k=0; k<objects.length - clusterCount; k++)
	{
		let bestA, bestB, best = Infinity;
		for (let i =0; i<clusters.length - 1; ++i)
		{
			for (let j = i+1; j<clusters.length; ++j)
			{
				if (!clusters[i].length || !clusters[j].length) continue;
				let DIST = distSingleLinkage(clusters[i], clusters[j]);
				if (DIST < best)
				{
					bestA = i, bestB = j, best = DIST;
				}
			}
		}
		for (let i = 0; i<clusters[bestB].length; ++i)
		{
			clusters[bestA].push(clusters[bestB][i]);
		}
		clusters[bestB] = [];
	}
	coloring_2();
}
