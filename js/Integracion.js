/* Modelación y Análisis Numérico
* Este archivo hace parte de un proyecto para el aprendizaje interactivo de metodos numéricos.
* En este archivo se encuentra el nucleo de calculo de los metodos
* 
*
* Este archivo requiere la libreria math.js
*
*
*
* David Arturo Rodriguez Herrera - da.rodriguezh@uniandes.edu.co
*/

//gaussLegendre = (fn, a, b, n, l=100)


var PUNTOS_GAUSS = 3
var a = parseFloat(document.getElementById('sliderx0').value)
var b = parseFloat(document.getElementById('sliderxf').value)

var actual = undefined


function actualizarIntervalo() {
	a = parseFloat(document.getElementById('sliderx0').value)
	b = parseFloat(document.getElementById('sliderxf').value)
	actual.calcularIntegral({a:a,b:b,n:PUNTOS_GAUSS})
	actual.actualizarGrafica()
	actualizarLatex()
}
function parseFuncion(str){
	try {
		let fx = (x) => {return math.evaluate(str,{x: x})}
		return fx
	} catch(e) {
		console.log(e)
		//Mensaje De Error no alert
	}
}
function actualizarFuncion(str) {
	fx = parseFuncion(str)
	actual = new GaussLegendre(fx)
	actualizarIntervalo()
}

function actualizarLatex() {

	str = document.getElementById('funcion').value
	const elem = document.getElementById('pretty')
	if (actual.valor) {
	    elem.innerHTML = '$$\\textcolor{green}{\\int_{'+actual.a+'}^{'+actual.b+'}=' + math.parse(str).toTex()+'='+math.round(actual.valor,5)+'}$$'
	} else {
	    elem.innerHTML = '$$\\textcolor{red}{\\int_{'+actual.a+'}^{'+actual.b+'}=' + math.parse(str).toTex()+'='+math.round(actual.valor,5)+'}$$'
	}
    MathJax.typeset()
}

function resolver() {
	fx = parseFuncion(document.getElementById('funcion').value)
	actual = new GaussLegendre(fx)
	actualizarIntervalo()
}

function menosPuntos() {
	PUNTOS_GAUSS -= 1*(PUNTOS_GAUSS>1)
	actualizarIntervalo()
}
function masPuntos() {
	PUNTOS_GAUSS += 1
	actualizarIntervalo()
}

class GaussLegendre{
	constructor(fx) {
		this.fx = fx
	}
	calcularIntegral(params) {
		this.a = params.a
		this.b = params.b
		let arreglo = gaussLegendre(this.fx, this.a, this.b, PUNTOS_GAUSS)
		this.valor= arreglo[0]
		this.xs = arreglo[1]
		this.ws = arreglo[2]
	}
	actualizarGrafica(n=100) {
		let xs = this.xs.map(x => (this.b-this.a)/2*x+(this.a+this.b)/2)
		let fxss = xs.map(x => this.fx(x))
		let ws = this.ws
		let traces = []
		let shapes = []
		let x = []

		let labels = []

		for(let i = 0, length1 = xs.length; i < length1; i++){
			labels.push('W='+math.round(ws[i],3))
		}
		let trace = {
			x: xs,
			y: new Array(xs.length).fill(0),
			text: labels,
			mode: 'markers',
			type: 'scatter',
			marker: {size: 12},
			name: 'Puntos de evaluación'
		}
		traces.push(trace)


		let h = (b-a)/n
		let fxs = []
		for(let i = -n/10; i <= n+n/10; i++){
			x.push(a+i*h)
			fxs.push(this.fx(a+i*h))
		}

		trace = {
			x: x,
			y: fxs,
			mode: 'lines',
			name: 'f(x)'
		}
		traces.push(trace)

		let maximoy = math.abs(math.max(fxs))-math.abs(math.min(fxs))
		let maximox = math.abs(b-a)
		for(let i = 0, length1 = xs.length; i < length1; i++){
			let radioy = ws[i]*1/5*maximoy //TODO cambiar
			let radiox = ws[i]*1/20*maximox
			let shape = {
		      type: 'circle',
		      xref: 'x',
		      yref: 'y',
		      fillcolor: 'rgba(50, 171, 96, 0.7)',
		      x0: xs[i]-radiox,
		      y0: -radioy,
		      x1: xs[i]+radiox,
		      y1: radioy,
		      line: {
		        color: 'rgba(50, 171, 96, 1)'
		      }
		    }
		    shapes.push(shape)
		}

		x = []
		fxs = []
		for(let i = 0; i <= n; i++){
			x.push(a+i*h)
			fxs.push(this.fx(a+i*h))
		}
		trace = {
			x: x,
			y: fxs,
			fill: 'tozeroy',
			fillcolor: 'rgba(34, 135, 224, 0.3)',
			opacity: 0.5,
			name: 'Area Integral'
		}
		traces.push(trace)

		let layout = {
		  title:'Integración por Gauss-Legendre',
		  shapes:shapes,
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}


		var config = {responsive: true}
		Plotly.newPlot('grafica', traces,layout,config)
	}
}
