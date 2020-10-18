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
var NMAX = 40
var NMIN = 1
var problema = 'GL'
var actual = undefined

var mathFieldSpan = document.getElementById('math-field');
var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function() {
            try{
            	triggerBotones(false)
            	actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString())
            }
            catch(e){}
        }
    }
});


function actualizarInterfazSegmentos() {
	document.getElementById('numeroSegmentos').value = PUNTOS_GAUSS
}
function parabolarDesdePuntos(x1,y1,x2,y2,x3,y3) {
	let M = math.matrix([[x1*x1,x1,1],[x2*x2,x2,1],[x3*x3,x3,1]])
	let F = math.matrix([[y1],[y2],[y3]])
	let U = math.multiply(math.inv(M),F)._data
	return x => U[0][0]*x*x+U[1][0]*x + U[2][0]
}

function cubicaDesdePuntos(x1,y1,x2,y2,x3,y3,x4,y4) {
	let M = math.matrix([[x1*x1*x1,x1*x1,x1,1],[x2*x2*x2,x2*x2,x2,1],[x3*x3*x3,x3*x3,x3,1],[x4*x4*x4,x4*x4,x4,1]])
	let F = math.matrix([[y1],[y2],[y3],[y4]])
	let U = math.multiply(math.inv(M),F)._data
	return x => U[0][0]*x*x*x+U[1][0]*x*x + U[2][0]*x+U[3][0]
}
function actualizarSegmentos(numero) {
	PUNTOS_GAUSS = numero
	if (numero<NMIN) {
		PUNTOS_GAUSS = NMIN
	} else if (numero>NMAX) {
		PUNTOS_GAUSS = NMAX
	}
	if (!numero) {
		PUNTOS_GAUSS = ''
	}
	actualizarIntervalo()
	actualizarInterfazSegmentos()
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
	try {
		str = document.getElementById('funcion').value
	} catch {
		str = MathExpression.fromLatex(mathField.latex()).toString()
	}
	const elem = document.getElementById('pretty')
	let color = '$$\\textcolor{green}'
	let valor = math.round(actual.valor,5)
	if (!actual.valor) {
		color = '$$\\textcolor{red}'
		valor = '}$$<p style="text-align:center;color:red">Error al evaluar la integral, revise la función y/o los limites de integración</p>$${'
		try {
			if (actual.valor==0){
				color = '$$\\textcolor{green}'
				valor = math.round(actual.valor,5)
			}

		} catch(e) {
			console.log(e)
		}
	}
	if (PUNTOS_GAUSS=='') {
		color = '$$\\textcolor{red}'
		valor = ''
	}
	elem.innerHTML = color+'{\\int_{'+actual.a+'}^{'+actual.b+'}' + math.parse(str).toTex()+'{dx}='+valor+'}$$'
    MathJax.typeset()
}

function resolver(tipo = 'GL') {
	if (tipo=='GL') {
		NMAX = 40
		NMIN = 1
	} else if (tipo == 'TP') {
		NMAX = 400000
		NMIN = 1
	} else {
		NMAX = 400000
		NMIN = 2
	}
	problema = tipo
	try {
		fx = parseFuncion(document.getElementById('funcion').value)
	} catch {
		fx = parseFuncion(MathExpression.fromLatex(mathField.latex()).toString())
	}
	if (tipo=='GL') {
		actual = new GaussLegendre(fx)
	} else if (tipo=='TP') {
		actual = new Trapecio(fx)
	} else if (tipo=='SP') {
		actual = new Simpson(fx)
	} else {
		alert('Mensaje para Arturo: Arregla los errores pendejo')
	}
	actualizarIntervalo()
}

function menosPuntos() {
	PUNTOS_GAUSS -= 1*(PUNTOS_GAUSS>1)
	if (PUNTOS_GAUSS<NMIN) {
		PUNTOS_GAUSS = NMIN
	} else if (PUNTOS_GAUSS>NMAX) {
		PUNTOS_GAUSS = NMAX
	}
	actualizarIntervalo()
}
function masPuntos() {
	PUNTOS_GAUSS += 1
	if (PUNTOS_GAUSS<NMIN) {
		PUNTOS_GAUSS = NMIN
	} else if (PUNTOS_GAUSS>NMAX) {
		PUNTOS_GAUSS = NMAX
	}
	actualizarIntervalo()
}

class GaussLegendre{
	constructor(fx) {
		this.fx = fx
	}
	calcularIntegral(params) {
		this.a = params.a
		this.b = params.b
		let arreglo = gaussLegendre(this.fx, this.a, this.b, PUNTOS_GAUSS,PUNTOS_GAUSS*100)
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
		let sumaW = math.sum(ws)
		try {
			maximoy = myPlot.layout.yaxis.range[1]-myPlot.layout.yaxis.range[0]
			maximox = myPlot.layout.xaxis.range[1]-myPlot.layout.xaxis.range[0]
		} catch {}
		let ar = maximox/maximoy

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

class Simpson{
	constructor(fx) {
		this.fx = fx
	}
	calcularIntegral(params) {
		this.a = params.a
		this.b = params.b
		this.integrar(PUNTOS_GAUSS)
	}
	integrar(n,a=this.a,b=this.b) {
		if (n%2==0) {
			if (n == 0){
				this.valor = 0
			} else {
				//Simpson 1/3
				let h = (b-a)/(n)
				let sum1 = 0
				let sum2 = 0
				for(let i = 1; i < n; i+=2){
					sum1 += this.fx(a+(i)*h)
				}
				for(let i = 2; i < n-1; i+=2){
					sum2 += this.fx(a+(i)*h)
				}
				this.valor = h/3*(this.fx(a)+4*sum1+2*sum2+this.fx(a+(n)*h))
			}
		} else {
			let h3 = (this.b-this.a)/(n)
			this.integrar(n-3,this.a,this.a + (n-3)*h3)
			let a = this.a + (n-3)*h3
			let b = this.a + n*h3
			let f0 = this.fx(this.a + (n-3)*h3)
			let f1 = this.fx(this.a + (n-2)*h3)
			let f2 = this.fx(this.a + (n-1)*h3)
			let f3 = this.fx(this.a + (n)*h3)
			let valor = ((b-a)/8)*(f0+3*f1+3*f2+f3)
			this.valor += valor
		}
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
		h = (b-a)/PUNTOS_GAUSS

		let flag = 1 - (PUNTOS_GAUSS%2 == 0)
		PUNTOS_GAUSS = PUNTOS_GAUSS-3*flag
		let puntosGrafica = 8
		for(let i = 0; i < PUNTOS_GAUSS; i+=2){
			let x0 = this.a+i*h
			let x1 = this.a+(i+1)*h
			let x2 = this.a+(i+2)*h
			let y0 = this.fx(x0)
			let y1 = this.fx(x1)
			let y2 = this.fx(x2)
			let x = []
			let fxs = []
			
			let aGrafica = x0
			let bGrafica = x2

			let hGrafica = (bGrafica-aGrafica)/puntosGrafica
			let efedeequis = parabolarDesdePuntos(x0,y0,x1,y1,x2,y2)

			for(let j = 0; j < puntosGrafica+1; j++){
				x.push(aGrafica+j*hGrafica)
				fxs.push(efedeequis(aGrafica+j*hGrafica))
			}
			let trace = {
				x: x,
				y: fxs,
				fill: 'tozeroy',
				fillcolor: 'rgba(34, 135, 224, 0.3)',
				opacity: 0.5,
				name: 'Parábola ' + (i/2+1)
			}
			traces.push(trace)
		}
		if (flag) {
			let i = PUNTOS_GAUSS
			let x0 = this.a+i*h
			let x1 = this.a+(i+1)*h
			let x2 = this.a+(i+2)*h
			let x3 = this.a+(i+3)*h
			let y0 = this.fx(x0)
			let y1 = this.fx(x1)
			let y2 = this.fx(x2)
			let y3 = this.fx(x3)
			let x = []
			let fxs = []
			
			let aGrafica = x0
			let bGrafica = x3

			let hGrafica = (bGrafica-aGrafica)/puntosGrafica
			let efedeequis = cubicaDesdePuntos(x0,y0,x1,y1,x2,y2,x3,y3)

			for(let j = 0; j < puntosGrafica+1; j++){
				x.push(aGrafica+j*hGrafica)
				fxs.push(efedeequis(aGrafica+j*hGrafica))
			}
			let trace = {
				x: x,
				y: fxs,
				fill: 'tozeroy',
				fillcolor: 'rgba(228, 164, 12, 0.3)',
				opacity: 0.5,
				name: 'Cúbica ' + (i/2+1)
			}
			traces.push(trace)
		}
		PUNTOS_GAUSS = PUNTOS_GAUSS+3*flag
		let layout = {
		  title:'Integración por Simpson',
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
$('#cositasLindas').toolbar({
	content: '#toolbar-options',
	animation: 'grow'
	});
function input(str) {
	mathField.cmd(str)
	mathField.focus()
}