/* Modelación y Análisis Numérico
* Este archivo hace parte de un proyecto para el aprendizaje interactivo de metodos numéricos.
* En este archivo se encuentra el nucleo de calculo de los metodos de runge kutta
* 
*
* Este archivo requiere la libreria math.js
*
*
*
* David Arturo Rodriguez Herrera - da.rodriguezh@uniandes.edu.co
*/


var actual = undefined

var mathFieldSpan = document.getElementById('math-field');
var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function() {
            try{
            	triggerBotones(false)
            	actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
            }
            catch(e) {
            	console.log(e)
            }
        }
    }
});


function resolver() {
	triggerBotones(true)
	actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
}
function actualizarTabla() {
	actual.actualizar()
}

function actualizarFuncion(str) {
	let fx = parseFuncion(str)
	let xi = parseFloat(document.getElementById('xi').value)
	let yi = parseFloat(document.getElementById('yi').value)
	let h = parseFloat(document.getElementById('h').value)
	actual = new RungeKutta(fx,xi,yi,h)

}
function parseFuncion(str){
	try {
		let fx = (x, y) => {return math.evaluate(str, {x: x, y: y})}
		return fx
	} catch(e) {
		console.log(e)
	}
}

function masPuntos() {
	actual.iteracionSiguiente()
}
function menosPuntos() {
	actual.iteracionAnterior()
}

class RungeKutta{
	constructor(fx, xi, yi, h) {
		this.fx = fx
		this.xi = xi
		this.yi = yi
		this.h = h
		this.x = [[xi,xi,xi,xi,xi,xi]]
		this.y = [[yi,yi,yi,yi,yi,yi]]
		this.iteracionSiguiente()
	}
	iteracionSiguiente() {
		let x = this.x[this.x.length-1]
		let y = this.y[this.x.length-1]
		let h = this.h
		let xlinea = []
		let ylinea = []
		//Euler
		xlinea.push(x[0] + h)
		ylinea.push(y[0] + h*this.fx(x[0],y[0]))

		//Heun
		xlinea.push(x[1] + h)
		let k1 = this.fx(x[1],y[1])
		let k2 = this.fx(x[1] + h,y[1] + k1 * h)
		ylinea.push(y[1] + h*(1/2 *k1 + 1/2 * k2 ))

		//PuntoMedio
		xlinea.push(x[2] + h)
		let fmedios = this.fx(x[2] + h/2, y[2] + h/2*this.fx(x[2],y[2]))
		ylinea.push(y[2] + fmedios*h)

		//Ralston
		xlinea.push(x[3] + h)
		let fralston = 1/3*this.fx(x[3],y[3]) + 2/3*this.fx(x[3] + 3/4*h, y[3] + 3/4 * this.fx(x[3], y[3]) * h)
		ylinea.push(y[3] + fralston*h)

		//3Orden
		xlinea.push(x[4] + h)
		k1 = this.fx(x[4],y[4])
		k2 = this.fx(x[4] + 1/2*h, y[4] + 1/2*k1*h)
		let k3 = this.fx(x[4] + h, y[4] - k1*h + 2*k2*h)
		let f3ord = 1/6*(k1 + 4*k2 + k3)
		ylinea.push(y[4] + f3ord * h)

		//4Orden
		xlinea.push(x[5] + h)
		k1 = this.fx(x[5],y[5]) 
		k2 = this.fx(x[5] + 1/2 * h, y[5] + 1/2 * k1 * h)
		k3 = this.fx(x[5] + 1/2 * h, y[5] + 1/2 * k2 * h)
		let k4 = this.fx(x[5] + h, y[5] + k3 * h)
		let f4ord = 1/6*(k1 + 2*k2 + 2*k3 + k4)
		ylinea.push(y[5] + f4ord * h)

		this.x.push(xlinea)
		this.y.push(ylinea)
		this.actualizar()
	}
	iteracionAnterior() {
		if (this.x.length > 2) {
			this.x.pop()
			this.y.pop()
			this.actualizar()
		}
	}
	actualizar() {
		this.actualizarGrafica()
		this.actualizarTabla()
	}
	actualizarTabla() {
		let metodo = document.getElementById('metodo').value
		let str = ''
		if (metodo == 'Euler') {
			str += `<thead>
				<tr style="text-align: center;">
					<th><span>\\(x\\)</span></th>
					<th><span>\\(y\\)</span></th>
					<th><span>\\(f(x,y)\\)</span></th>
				</tr>
			</thead>
			<tbody >`
			for (var i = 0; i < this.x.length; i++) {
				let fila = '<tr><td>'
				fila += math.round(this.x[i][0],3)
				fila += '</td><td>'
				fila += math.round(this.y[i][0],3)
				fila += '</td><td>'
				fila += math.round(this.fx(this.x[i][0],this.y[i][0]),3)
				str += fila
			}
			str+='</tbody>'
		} else if (metodo == 'Heun') {
			str += `<thead>
				<tr style="text-align: center;">
					<th><span>\\(x\\)</span></th>
					<th><span>\\(y\\)</span></th>
					<th><span>\\(f(x,y)\\)</span></th>
					<th><span>\\(x_{i+1}\\)</span></th>
					<th><span>\\(y_{i+1}\\)</span></th>
					<th><span>\\(f(x_{i+1},y_{i+1})\\)</span></th>
					<th><span>\\(\\phi\\)</span></th>
				</tr>
			</thead>
			<tbody >`
			for (var i = 0; i < this.x.length; i++) {
				let fila = '<tr><td>'
				fila += math.round(this.x[i][1],3)
				fila += '</td><td>'
				fila += math.round(this.y[i][1],3)
				fila += '</td><td>'
				let k1 = this.fx(this.x[i][1],this.y[i][1])
				fila += math.round(k1,3)
				fila += '</td><td>'
				let xi1 = this.x[i][1] + this.h
				fila += math.round(xi1,3)
				fila += '</td><td>'
				let yi1 = this.y[i][1] + k1*this.h
				fila += math.round(yi1,3)
				fila += '</td><td>'
				let k2 = this.fx(xi1,yi1)
				fila += math.round(k2,3)
				fila += '</td><td>'
				fila += math.round(1/2*k1+1/2*k2,3)
				str += fila
			}
			str+='</tbody>'
		} else if (metodo == 'Punto Medio') {
			str += `<thead>
				<tr style="text-align: center;">
					<th><span>\\(x\\)</span></th>
					<th><span>\\(y\\)</span></th>
					<th><span>\\(f(x,y)\\)</span></th>
					<th><span>\\(x_{i+1/2}\\)</span></th>
					<th><span>\\(y_{i+1/2}\\)</span></th>
					<th><span>\\(f(x_{i+1/2},y_{i+1/2})\\)</span></th>
				</tr>
			</thead>
			<tbody >`
			for (var i = 0; i < this.x.length; i++) {
				let fila = '<tr><td>'
				fila += math.round(this.x[i][2],3)
				fila += '</td><td>'
				fila += math.round(this.y[i][2],3)
				fila += '</td><td>'
				let k1 = this.fx(this.x[i][2],this.y[i][2])
				fila += math.round(k1,3)
				fila += '</td><td>'
				let xi1 = this.x[i][2] + this.h/2
				fila += math.round(xi1,3)
				fila += '</td><td>'
				let yi1 = this.y[i][2] + k1*this.h/2
				fila += math.round(yi1,3)
				fila += '</td><td>'
				let k2 = this.fx(xi1,yi1)
				fila += math.round(k2,3)
				str += fila
			}
			str+='</tbody>'
		} else if (metodo == 'Ralston') {
			str += `<thead>
				<tr style="text-align: center;">
					<th><span>\\(x\\)</span></th>
					<th><span>\\(y\\)</span></th>
					<th><span>\\(k_1\\)</span></th>
					<th><span>\\(k_2\\)</span></th>
					<th><span>\\(\\phi\\)</span></th>
				</tr>
			</thead>
			<tbody >`
			for (var i = 0; i < this.x.length; i++) {
				let fila = '<tr><td>'
				fila += math.round(this.x[i][3],3)
				fila += '</td><td>'
				fila += math.round(this.y[i][3],3)
				fila += '</td><td>'
				let k1 = this.fx(this.x[i][3],this.y[i][3])
				fila += math.round(k1,3)
				fila += '</td><td>'
				let k2 = this.fx(this.x[i][3]+3/4*this.h,this.y[i][3]+3/4*k1*this.h)
				fila += math.round(k2,3)
				fila += '</td><td>'
				let phi = 1/3*k1+2/3*k2
				fila += math.round(phi,3)
				str+=fila
			}
			str+='</tbody>'
		} else if (metodo == '3er Orden') {
			str += `<thead>
				<tr style="text-align: center;">
					<th><span>\\(x\\)</span></th>
					<th><span>\\(y\\)</span></th>
					<th><span>\\(k_1\\)</span></th>
					<th><span>\\(k_2\\)</span></th>
					<th><span>\\(k_3\\)</span></th>
					<th><span>\\(\\phi\\)</span></th>
				</tr>
			</thead>
			<tbody >`
			for (var i = 0; i < this.x.length; i++) {
				let fila = '<tr><td>'
				fila += math.round(this.x[i][4],3)
				fila += '</td><td>'
				fila += math.round(this.y[i][4],3)
				fila += '</td><td>'
				let k1 = this.fx(this.x[i][4],this.y[i][4])
				fila += math.round(k1,3)
				fila += '</td><td>'
				let k2 = this.fx(this.x[i][4]+1/2*this.h,this.y[i][4]+1/2*k1*this.h)
				fila += math.round(k2,3)
				fila += '</td><td>'
				let k3 = this.fx(this.x[i][4]+this.h,this.y[i][4]-k1*this.h+2*k2*this.h)
				fila += math.round(k3,3)
				fila += '</td><td>'
				let phi = 1/6*(k1+4*k2+k3)
				fila += math.round(phi,3)
				str+=fila
			}
			str+='</tbody>'
		} else if (metodo == '4to Orden') {
			str += `<thead>
				<tr style="text-align: center;">
					<th><span>\\(x\\)</span></th>
					<th><span>\\(y\\)</span></th>
					<th><span>\\(k_1\\)</span></th>
					<th><span>\\(k_2\\)</span></th>
					<th><span>\\(k_3\\)</span></th>
					<th><span>\\(k_4\\)</span></th>
					<th><span>\\(\\phi\\)</span></th>
				</tr>
			</thead>
			<tbody >`
			for (var i = 0; i < this.x.length; i++) {
				let fila = '<tr><td>'
				fila += math.round(this.x[i][5],3)
				fila += '</td><td>'
				fila += math.round(this.y[i][5],3)
				fila += '</td><td>'
				let k1 = this.fx(this.x[i][5],this.y[i][5])
				fila += math.round(k1,3)
				fila += '</td><td>'
				let k2 = this.fx(this.x[i][5]+1/2*this.h,this.y[i][5]+1/2*k1*this.h)
				fila += math.round(k2,3)
				fila += '</td><td>'
				let k3 = this.fx(this.x[i][5]+1/2*this.h,this.y[i][5]+1/2*k2*this.h)
				fila += math.round(k3,3)
				fila += '</td><td>'
				let k4 = this.fx(this.x[i][5]+this.h,this.y[i][5]+k3*this.h)
				fila += math.round(k4,3)
				fila += '</td><td>'
				let phi = 1/6*(k1+2*k2+2*k3+k4)
				fila += math.round(phi,3)
				str+=fila
			}
			str+='</tbody>'
		}
		document.getElementById('tabla').innerHTML = str
	    MathJax.typeset()
	}
	actualizarGrafica() {
		let nombres = ['Euler','Heun','Punto Medio','Ralston','3 Orden','4 Orden']
		let traces = []
		for (var i = 0; i < nombres.length; i++) {
			let x = []
			let fxs = []
			for (let j = 0; j < this.x.length; j++) {
				x.push(this.x[j][i])
				fxs.push(this.y[j][i])
			}
			let trace = {
				x: x,
				y: fxs,
				mode: 'lines',
				name: nombres[i]
			}
			traces.push(trace)
		}

		let layout = {
			plot_bgcolor:"rgba(0,0,0,0)",
	        paper_bgcolor:"rgba(0,0,0,0)",
			title:'Métodos de Runge Kutta',
			xaxis: {
				title:'x',
				tickformat: '.3f',
				gridcolor: 'rgb(198,194,191)'
			},
			yaxis: {
			  	title:'y',
		        tickformat: '.3f',
		        gridcolor: 'rgb(198,194,191)'
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
document.body.onload = function(){
	resolver()
	triggerBotones(false)
	var queryString = window.location.search;
	if (queryString != '') {
		queryString = queryString.split('?')[1]
		let parametros = new URLSearchParams(queryString);
		funcion_param = parametros.get('fx')
		console.log(funcion_param)
		try {
			document.getElementById('xi').value = parseFloat(parametros.get('xi'))
			document.getElementById('yi').value = parseFloat(parametros.get('yi'))
			document.getElementById('h').value = parseFloat(parametros.get('h'))
			mathField.focus();
			mathField.keystroke('End Shift-Home Del');
			// input(funcion_param)
			mathField.write(funcion_param)
			mathField.focus()
			triggerBotones(true)

		} catch (e) {
			console.log(queryString,e)
		}
	}
}
function triggerBotones(param) {
	document.querySelectorAll('#iteraciones').forEach(x => x.disabled = !param)
}