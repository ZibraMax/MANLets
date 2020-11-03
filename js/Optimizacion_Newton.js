var sliderx0 = document.getElementById('sliderx0')
var x0G = parseFloat(sliderx0.value)
var funcionActual = undefined
let iteraccionActual = 0
var resultadoActual = []
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
            catch(e){}
        }
    }
});
function siguienteIteracion() {
	iteraccionActual = iteraccionActual + 1*(iteraccionActual<resultadoActual.length-1)
	actualizarGrafica(iteraccionActual)
}
function anteriorIteracion() {
	iteraccionActual = iteraccionActual - 1*(iteraccionActual>0)
	actualizarGrafica(iteraccionActual)
}
function triggerBotones(param) {
	document.querySelectorAll('#iteraciones').forEach(x => x.disabled = !param)
}
function actualizarX0(x) {
	x0G = parseFloat(x)
	try {
    actualizarFuncion(document.getElementById('funcion').value)
  } catch {
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
  }
}
function actualizarFuncion(funcion) {
	funcionActual = new OptiNewton(funcion)
	funcionActual.newton(x0G,0.00000001)
	
	triggerBotones(false)
	actualizarGrafica(0)
	iteraccionActual = 0

	const elem = document.getElementById('pretty')
	const elem2 = document.getElementById('pretty2')
	const elem3 = document.getElementById('pretty3')

	let derivada = funcionActual.nodoDerivada.toTex()
	let derivada2 = funcionActual.nodoDerivada2.toTex()
    elem.innerHTML = '$$f(x)='+math.parse(funcion).toTex()+'$$'
    elem2.innerHTML = "$$f'(x)="+derivada+"$$"
    elem3.innerHTML = "$$f''(x)="+derivada2+'$$'

	MathJax.typeset()
}
function actualizarSoluciones(arreglo,objeto) {
	funcionActual = objeto
	resultadoActual = arreglo
	actualizarGrafica(0)
	iteraccionActual = 0
}
function actualizarGrafica(i) {
	funcionActual.graficar(i,50)
	actualizarTabla(i)
}
function resolver() {
	try {
    actualizarFuncion(document.getElementById('funcion').value)
  } catch {
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
  }
	actualizarX0(document.getElementById('sliderx0').value)
	triggerBotones(true)
}
function actualizarTabla(i) {

	if (i==-1) {
		document.getElementById('-1,xl').innerHTML = 0
		document.getElementById('-1,xu').innerHTML = 0
		document.getElementById('-1,fxl').innerHTML = 0
		document.getElementById('-1,fxu').innerHTML = 0
		document.getElementById('-1,xr').innerHTML = 0

		document.getElementById('1,xl').innerHTML = 0
		document.getElementById('1,xu').innerHTML = 0
		document.getElementById('1,fxl').innerHTML = 0
		document.getElementById('1,fxu').innerHTML = 0
		document.getElementById('1,xr').innerHTML = 0

		document.getElementById('+1,xl').innerHTML = 0
		document.getElementById('+1,xu').innerHTML = 0
		document.getElementById('+1,fxl').innerHTML = 0
		document.getElementById('+1,fxu').innerHTML = 0
		document.getElementById('+1,xr').innerHTML = 0
	} else {
		let xl = ''
		let xu = ''
		let fxl = ''
		let fxu = ''
		let xr = ''

		let xl1 = ''
		let xu1 = ''
		let fxl1 = ''
		let fxu1 = ''
		let xr1 = ''

		let xl11 = ''
		let xu11 = ''
		let fxl11 = ''
		let fxu11 = ''
		let xr11 = ''

		if (i>0) {
			xl1 = resultadoActual[i-1][0]
			xu1 = resultadoActual[i-1][1]
			fxl1 = resultadoActual[i-1][2]
			fxu1 = resultadoActual[i-1][3]
			xr1 =resultadoActual[i-1][4]
		}
		if (iteraccionActual<resultadoActual.length-1) {
			xl11 = resultadoActual[i+1][0]
			xu11 = resultadoActual[i+1][1]
			fxl11 = resultadoActual[i+1][2]
			fxu11 = resultadoActual[i+1][3]
			xr11 = resultadoActual[i+1][4]
		}
		xl = resultadoActual[i][0]
		xu = resultadoActual[i][1]
		fxl = resultadoActual[i][2]
		fxu = resultadoActual[i][3]
		xr = resultadoActual[i][4]

		document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
		document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
		document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
		document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)
		document.getElementById('-1,xr').innerHTML = math.round(xr1,3)

		document.getElementById('1,xl').innerHTML = math.round(xl,3)
		document.getElementById('1,xu').innerHTML = math.round(xu,3)
		document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
		document.getElementById('1,fxu').innerHTML = math.round(fxu,3)
		document.getElementById('1,xr').innerHTML = math.round(xr,3)

		document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
		document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
		document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
		document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
		document.getElementById('+1,xr').innerHTML = math.round(xr11,3)
	}
}

class OptiNewton {
	constructor(dFx) {
		this.nodoF = math.parse(dFx)
		this.nodoDerivada = math.derivative(this.nodoF,'x')
		this.nodoDerivada2 = math.derivative(this.nodoDerivada,'x')
		this.fx = (x) => this.nodoF.evaluate({x: x})
		this.dfdx = (x) => this.nodoDerivada.evaluate({x: x})
		this.df2dx2 = (x) => this.nodoDerivada2.evaluate({x: x})
	}
	newton(x0,tol=0.000001,maxIter=300) {
		let xr = x0
		let iteraciones = []
		let i = 0
		let xr1 = xr - (this.dfdx(xr))/(this.df2dx2(xr))
		let error = math.abs((xr-xr1)/(xr1))
		iteraciones.push([xr,this.dfdx(xr),this.df2dx2(xr),xr1,error])
		do {
			xr -= (this.dfdx(xr))/(this.df2dx2(xr))
			xr1 = xr- (this.dfdx(xr))/(this.df2dx2(xr))
			error = math.abs((xr-xr1)/(xr1))
			iteraciones.push([xr,this.dfdx(xr),this.df2dx2(xr),xr1,error])
			i++
		} while (error > tol && i < maxIter)
		console.log(iteraciones)
		actualizarSoluciones(iteraciones,this)
		return [xr,iteraciones]
	}
	graficar(i,n=50) {
		let x = []
		let y = []
		let min = 9*10**10
		let max = 9*10**-10
		let minx = 9*10**10
		let maxx = 9*10**-10
		let Xgeneral = []
		let Ygeneral = []
		for (var m = 0; m < resultadoActual.length; m++) {
			Xgeneral.push(resultadoActual[m][0])
			Ygeneral.push(this.fx(resultadoActual[m][0]))
		}
		min = math.min(Ygeneral)
		max = math.max(Ygeneral)
		minx = math.min(Xgeneral)
		maxx = math.max(Xgeneral)

		let dx = math.abs(maxx-minx)/n

		let xderivada = []
		let yderivada = []

		for (var k = -10; k < n+10; k++) {
			x.push(minx+k*dx)
			y.push(this.fx(minx+k*dx))
		}

		let t1x = []
		let t1y = []

		for (var k = 0; k <= i; k++) {
			t1x.push(resultadoActual[k][0])
			t1y.push(0)
			xderivada.push(resultadoActual[k][0])
			yderivada.push(this.fx(resultadoActual[k][0]))
		}

		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let deriveichon = (x,x0) => {
			return this.fx(x0)+this.dfdx(x0)*(x-x0)
		}
		let trace2 = {
		  x: [minx-10*dx,maxx+10*dx],
		  y: [deriveichon(minx-10*dx,resultadoActual[i][0]),deriveichon(maxx+10*dx,resultadoActual[i][0])],
		  mode: 'lines',
		  name: 'Pendiente',
		  line: {
		  	dash: 'dot'
		  }
		}
		let trace4 = {
	      x: [resultadoActual[i][0],resultadoActual[i][0]],
	      y: [0,this.fx(resultadoActual[i][0])],
	      mode: 'lines',
	      name: 'xi',
	      line: {
	      dash: 'dashdot',
	      }
	    }
	    let trace5= {
	      x: [resultadoActual[k][0],resultadoActual[k][0]],
	      y: [0,this.fx(resultadoActual[k][0])],
	      mode: 'lines',
	      name: 'xi+1',
	      line: {
	      dash: 'dashdot',
	      }
	    }
		let trace3 = {
		  x: xderivada,
		  y: yderivada,
		  mode: 'markers',
		  name: 'f(xi)'
		}
		let trace1 = {
		  x: t1x,
		  y: t1y,
		  mode: 'markers',
		  name: 'Xi',
		}

		let layout = {
		  title:'Iteraciones General ',
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica2', [trace,trace1,trace4,trace5,trace2,trace3],layout,config)
		this.graficar2(i,n)
	}
	graficar2(i,n=50) {
		let x = []
		let y = []
		let min = 9*10**10
		let max = 9*10**-10
		let minx = 9*10**10
		let maxx = 9*10**-10
		let Xgeneral = []
		let Ygeneral = []
		for (var m = 0; m < resultadoActual.length; m++) {
			Xgeneral.push(resultadoActual[m][0])
			Ygeneral.push(this.dfdx(resultadoActual[m][0]))
		}
		min = math.min(Ygeneral)
		max = math.max(Ygeneral)
		minx = math.min(Xgeneral)
		maxx = math.max(Xgeneral)

		let dx = math.abs(maxx-minx)/n

		let xderivada = []
		let yderivada = []

		for (var k = -10; k < n+10; k++) {
			x.push(minx+k*dx)
			y.push(this.dfdx(minx+k*dx))
		}

		let t1x = []
		let t1y = []

		for (var k = 0; k <= i; k++) {
			t1x.push(resultadoActual[k][0])
			t1y.push(0)
			xderivada.push(resultadoActual[k][0])
			yderivada.push(this.dfdx(resultadoActual[k][0]))
		}

		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let deriveichon = (x,x0) => {
			return this.dfdx(x0)+this.df2dx2(x0)*(x-x0)
		}
		let trace2 = {
		  x: [minx-10*dx,maxx+10*dx],
		  y: [deriveichon(minx-10*dx,resultadoActual[i][0]),deriveichon(maxx+10*dx,resultadoActual[i][0])],
		  mode: 'lines',
		  name: 'Pendiente',
		  line: {
		  	dash: 'dot'
		  }
		}
		
		let trace3 = {
		  x: xderivada,
		  y: yderivada,
		  mode: 'markers',
		  name: 'f(xi)'
		}
		let trace4 = {
	      x: [resultadoActual[i][0],resultadoActual[i][0]],
	      y: [0,this.dfdx(resultadoActual[i][0])],
	      mode: 'lines',
	      name: 'xi',
	      line: {
	      dash: 'dashdot',
	      }
	    }
	    let trace5= {
	      x: [resultadoActual[k][0],resultadoActual[k][0]],
	      y: [0,this.dfdx(resultadoActual[k][0])],
	      mode: 'lines',
	      name: 'xi+1',
	      line: {
	      dash: 'dashdot',
	      }
	    }
		let trace1 = {
		  x: t1x,
		  y: t1y,
		  mode: 'markers',
		  name: 'Xi',
		}


		let layout = {
		  title:'Derivada',
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica', [trace,trace1,trace4,trace5,trace2,trace3],layout,config)
	}
}
if (navigator.userAgent.match(/Mobile/)) {
  document.getElementById('cuelloBotella').innerHTML = '<input type="text" id="funcion" value="2*sin(x)-(x^2)/10" onchange="actualizarFuncion(this.value)">';
}

$('#cositasLindas').toolbar({
	content: '#toolbar-options',
	animation: 'grow'
	});
function input(str) {
	mathField.cmd(str)
	mathField.focus()
}
	
triggerBotones(false)