var traces = [{
  x: [1, 2],
  y: [10, 15],
  mode: 'markers',
  type: 'scatter',
  name: 'Puntos a Interpolar'
}];
traces.push({
  x: [1, 2],
  y: [10, 15],
  name: 'Funcion Interpolada'
})
var FUNCION = undefined
var myPlot = document.getElementById('myPlot')
let layout = {
		  title:'Iterpolación polinomial',
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
Plotly.newPlot('myPlot', traces,layout ,{responsive: true});

Number.prototype.between = function(min, max) {
  return this >= min && this <= max;
}


Plotly.d3.select(".plotly").on('click', function(d, i) {
	var e = Plotly.d3.event;
	var bg = document.getElementsByClassName('nsewdrag drag')[0];
	var x = ((e.layerX - bg.attributes['x'].value) / (bg.attributes['width'].value)) * (myPlot.layout.xaxis.range[1] - myPlot.layout.xaxis.range[0]) + myPlot.layout.xaxis.range[0];
	var y = ((e.layerY - bg.attributes['y'].value) / (bg.attributes['height'].value)) * (myPlot.layout.yaxis.range[0] - myPlot.layout.yaxis.range[1]) + myPlot.layout.yaxis.range[1]
	if (x.between(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1]) &&
	y.between(myPlot.layout.yaxis.range[0], myPlot.layout.yaxis.range[1])) {
	Plotly.extendTraces(myPlot, {x: [[x]],y: [[y]]},[0]);}
	let objetos = []
	let ex = myPlot.data[0].x
	let ey = myPlot.data[0].y
	for(let i = 0, length1 = ex.length; i < length1; i++){
		objetos.push({
			x:ex[i],
			y:ey[i]
		})
	}
	objetos.sort(function (a, b) {
	  return a.x - b.x;
	});
	let EQUIS = objetos.map(x=>x.x)
	let YE = objetos.map(x=>x.y)
	FUNCION = interpolar(EQUIS,YE)

	graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION)
});
	
	function interpolar (x,y) {
		let matriz = []
		let vector = []
		for(let i = 0, length1 = x.length; i < length1; i++){
			let fila = []
			for(let j = 0; j < x.length; j++){
				fila.push(x[i]**((x.length-1)-j))
			}
			matriz.push(fila)
			vector.push([y[i]])
		}
		let M = math.matrix(matriz)
		let F = math.matrix(vector)
		let U = math.multiply(math.inv(M),F)._data
		let lambdita = x => {
			let sum = 0
			for(let j = 0, length2 = U.length; j < length2; j++){
				sum+=x**((U.length-1)-j)*U[j]
			}
			return sum
		}
		return lambdita
	}

	function graficar(a,b,funcion,n=100) {
		let h = (b-a)/n
		let x = []
		let y = []
		for(let i = 0; i < n; i++){
			x.push(a + h*i)
			y.push(funcion(a + h*i))
		}
		var data_update = {
			x: x,
			y: y,
			name: 'Funcion Interpolada'
		};
		Plotly.deleteTraces('myPlot', 1)
		Plotly.plot('myPlot', [data_update])
	}