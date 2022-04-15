function dist(i, j) //расстояние между двумя точками по теореме Пифагора
{
	return Math.sqrt((posX[i]-posX[j])*(posX[i]-posX[j]) + (posY[i]-posY[j])*(posY[i]-posY[j]));
}

function calcDist() //заполняет матрицу смежности
{
	for (let i = 0; i < count; i++) {
    		MAS[i] = [];
    		for (let j = 0; j < count; j++)
        		MAS[i][j] = dist(i, j);
	}
}

function distPath(path) //для определенного гена возвращает размер пути
{
	var s = MAS[0][path[0]] + MAS[0][path[count - 2]]; //соединяем "нулевую" вершину
	for (let i = 1; i < count - 1; i++) 
	{
		s+=MAS[path[i]][path[i-1]];
	}
	return s;
}

function calcFitness()
{
	var start = population.length / 2; //если фитнессы ещё не проставлены, то начинаем с середины
 	if (population[0][count - 1] == -1) start = 0; //если фитнессы ещё не проставлены, то начинаем с нулевого
	for (let i = start; i<population.length; ++i)
	{
		population[i][count - 1] = distPath(population[i]);
	}
}

function shuffle(array, delta) //дельта - для того, чтобы не трогать последние delta элементов.
//например, если дельта=0, последний элемент массив тоже будет перемешан, а если дельта=2,
//то перемешивание не должно затронуть последние два элемента
{
	for (let i = array.length - 1 - delta; i > 0; i--) 
	{
    	let j = Math.floor(Math.random() * (i + 1));
    	[array[i], array[j]] = [array[j], array[i]];
 	}
}

function mutate(array, P) //мутация, P - вероятность
{
	let cnt = 0; //кол-во мутаций
	while (Math.random() < P && 2*cnt<count) //ограничиваем кол-во мутаций
	//важно, что перемешивается весь массив, поэтому эту функцию нужно применять ещё до просчета фитнесс,
	//иначе получится [1,2,5,3,912.2] -> [5,912.2,1,3]
	{
		let i = Math.floor(Math.random()*array.length);
		let j = Math.floor(Math.random()*array.length);
		[array[i], array[j]] = [array[j], array[i]];
		cnt++;
	}
}

function crossover(par1, par2) //скрещивание
{
	let L = count - 1; //длина гена, полученного скрещиванием
	let bound = Math.floor(Math.random()*(L-1)); //граница генов родителей в будущем гене
	child = [];
	for (let i=0; i<=bound; ++i) child.push(par1[i]); //гены первого родителя - в начала
	for (let i=bound+1; i<L; ++i)
	{
		if (!child.includes(par2[i])) child.push(par2[i]); //гены второго - в конец
	}
	let need = L - child.length; //сколько генов не хватает?

	if (bound<=L/2) //для быстродействия рассматриваем разные размеры bound и дополняем гены
	{
		for (let i=0; i<=bound && need>0; ++i)    if (!child.includes(par2[i]))
		{
			 child.push(par2[i]);
			 need--;
		}
	}
	else
	{
		for (let i=bound+1; i<L && need>0; ++i)    if (!child.includes(par1[i]))
		{
			 child.push(par1[i]);
			 need--;
		}

	}
	mutate(child, prob); //в конце происходит мутация
	return child;
}

function next()
{
	shuffle(population);
	var first = population[0].slice();
	var last = population[POP_SIZE - 1].slice();
	for (let i = 0; i<POP_SIZE - 1; ++i)
	{
		population.push(crossover(population[i], population[i+1]));		
	}
	population.push(crossover(first, last));
}

function sortFunction(a, b) //компаратор для сортировки, чтобы потом убрать худших 
{
    if (a[count - 1] === b[count - 1]) return 0;
    else return (a[count - 1] < b[count - 1]) ? -1 : 1;
}

function selection()
{
	population.sort(sortFunction); //сортировка по компаратору
	population.splice(POP_SIZE); //удаление половины
}

//инициализация начальной популяции
function init()
{
	prob = 1; //вероятность мутации изначально = 1
	POP_SIZE = 2 * count * (count + 1); //подбираем размер популяции, чтобы он был четным
	calcDist(); //заполняем матрицу смежности
	for (let i = 0; i<count-1; ++i) etalon.push(i+1); //заполняем эталон
	for (let i = 0; i < POP_SIZE; i++) 
	{
		population[i] = etalon.slice(); //слайс для копирования,иначе будут ссылаться на один и тот же элемент
		population[i].push(-1); //"ген" - длина пути - не просчитан
		shuffle(population[i], 1); //перемешиваем каждого, дельта = 1 (длину пути не смешиваем с генами)
	}
}

function P(i)
{
	if (i >= ITER*0.8) prob = 0.02; //если прошло много итераций, вероятность мутации 2%
	else prob -= 1.225/ITER; //вероятность мутации постепенно снижается
}


function genalgo()
{
	if (count<2)
	{
		alert('Отметьте минимум две вершины');
		return;
	}
	reset();
	ITER = 4*count*count;
	canDraw = false;
	init(); //инициализация
	var genb = population[0].slice(); //получение
	var ik = 0;
	function iteration()
	{
		if (ik>=ITER-1)
		{
			clearInterval(outer);
			canDraw = true;
		}
		else {
		next(); //след. поколение
		P(ik); //меняем вероятность
		calcFitness(); //подсчет длин путей
		selection(); //селекция
		genb = population[0].slice(); //получение
		var last = genb.pop(); //длины пути лучшего
		ik++;
		if (last<bestP) 
		{
			var outer = setInterval(iteration, 0);
			redraw();
			lines(genb);
			bestP = last;
		}
		}
	}
	iteration();
}

function reset() //обнуление
{
	MAS = []; //матрица смежностей
	prob = 1; //вероятность мутации [0; 1]
	population = []; //сама популяция
	etalon = []; //очистка обычного маршрута
	bestP = Infinity; //длина маршрута
}


