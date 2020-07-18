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


var PUNTOS_GAUSS = 3
var a = parseFloat(document.getElementById('sliderx0').value)
var b = parseFloat(document.getElementById('sliderxf').value)

var problema = 'GL'
var actual = undefined
function actualizarInterfazSegmentos() {
	document.getElementById('numeroSegmentos').value = PUNTOS_GAUSS
}
function actualizarSegmentos(numero) {
	PUNTOS_GAUSS = numero
	actualizarIntervalo()
}
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
	resolver(problema)
}

function actualizarLatex() {

	str = document.getElementById('funcion').value
	const elem = document.getElementById('pretty')
	let color = '$$\\textcolor{green}'
	let valor = math.round(actual.valor,5)
	if (!actual.valor) {
		color = '$$\\textcolor{red}'
		valor = '}$$Error al evaluar la integral, revise la función y/o los limites de integración$${'
		try {
			if (actual.valor==0){
				color = '$$\\textcolor{green}'
				valor = math.round(actual.valor,5)
			}
		} catch(e) {
			console.log(e)
		}
	}
	elem.innerHTML = color+'{\\int_{'+actual.a+'}^{'+actual.b+'}' + math.parse(str).toTex()+'{dx}='+valor+'}$$'
    MathJax.typeset()
}

function resolver(tipo = 'GL') {
	problema = tipo
	fx = parseFuncion(document.getElementById('funcion').value)
	if (tipo=='GL') {
		actual = new GaussLegendre(fx)
	} else if (tipo=='TP') {
		actual = new Trapecio(fx)
	} else {
		alert('Mensaje para Arturo: Arregla los errores pendejo')
	}
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

class Trapecio{
	constructor(fx) {
		this.fx = fx
	}
	calcularIntegral(params) {
		this.a = params.a
		this.b = params.b
		this.integrar(PUNTOS_GAUSS)
	}
	integrar(n) {
		let h = (this.b-this.a)/(n)
		let sum = 0
		for(let i = 1; i < n; i++){
			sum += this.fx(this.a+i*h)
		}
		this.valor = h/2*(this.fx(this.a)+2*sum+this.fx(this.b))
	}
	actualizarGrafica(n=100) {
		let a = this.a
		let b = this.b
		let fxs = []
		let traces = []
		let shapes = []
		let x = []

		let labels = []
		let trace = {}

		let h = (b-a)/n
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

		x = []
		fxs = []
		h = (b-a)/PUNTOS_GAUSS
		for(let i = 0; i <= PUNTOS_GAUSS; i++){
			x.push(a+i*h)
			fxs.push(this.fx(a+i*h))
		}
		trace = {
			x: x,
			y: fxs,
			fill: 'tozeroy',
			fillcolor: 'rgba(34, 135, 224, 0.3)',
			opacity: 0.5,
			mode: 'markers+lines',
			type: 'scatter',
			name: 'Area Integral'
		}
		traces.push(trace)

		let layout = {
		  title:'Integración por Trapecio',
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
