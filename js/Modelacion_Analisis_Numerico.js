/* Modelación y Análisis Numérico
* Este archivo hace parte de un proyecto para el aprendizaje interactivo de metodos numéricos.
* En este archivo se encuentra el nucleo de calculo de los metodos de raices
* 
*
* Este archivo requiere la libreria math.js
* AQUI SOLO HAY METODOS DE RAICES Y SISTEMAS DE ECUACIONES
*
* Cuando escribí esto, sólo Dios y yo entendíamos lo que estaba haciendo
* Ahora ya solo lo sabe Dios.
* 
* David Arturo Rodriguez Herrera - da.rodriguezh@uniandes.edu.co - arturo@asections.com
*/
var actual = ''
var slider = document.getElementById('slider')
var sliderx0 = document.getElementById('sliderx0')
var sliderxf = document.getElementById('sliderxf')
var estado = true
var x0G = parseFloat(sliderx0.value)
var modificado = false
var xfG = 0
try {
  xfG = parseFloat(sliderxf.value)
}
catch(err) {
}

let funcionActual = undefined
var resultadoActual = []
iteraccionActual = 0
function siguienteIteracion() {
	iteraccionActual = iteraccionActual + 1*(iteraccionActual<resultadoActual.length-1)
	actualizarGrafica(iteraccionActual)
}
function anteriorIteracion() {
	iteraccionActual = iteraccionActual - 1*(iteraccionActual>0)
	actualizarGrafica(iteraccionActual)
}
function resolver(cac) {
	actual = cac
	actualizarFuncion(document.getElementById('funcion').value)
	actualizarX0(document.getElementById('sliderx0').value)
	if (!actual == 'IS' && !actual == 'N') {
		actualizarXf(document.getElementById('sliderxf').value)
	}
	triggerBotones(true)
}
function cambiarEstado(valor) {
	estado = (valor == 'true')
	resolver(actual)
}
function alertaIntervalo(param=false) {
	if (!param) {
		document.querySelectorAll('input').forEach(x=>x.classList.add("casillaCentradaROJO"))
		triggerBotones(false)
		document.getElementById('iteracionesText').innerHTML = 'El intervalo no es válido para esta funcion'
		if (actual == 'SCM') {
			document.getElementById('iteracionesText').innerHTML = 'Delta x no puede ser 0'
		}
		actualizarTabla(-1)
	} else {
		document.querySelectorAll('input').forEach(x=>x.classList.remove("casillaCentradaROJO"))
		try {
			document.getElementById('iteracionesText').innerHTML = ''
		}
		catch(err) {

		}
	}

}
function actualizarX0(x) {
	if (funcionActual.fx(parseFloat(x))*funcionActual.fx(xfG)<=0 || actual == 'IS' || actual == 'N' || actual == 'SC' || actual == 'SCM') {
		x0G = parseFloat(x)
		actualizarFuncion(document.getElementById('funcion').value)
		alertaIntervalo(true)
	} else {
		//alert('El intervalo no cumple con la condicion de que  f(x0)*f(xf)<=0, por favor modificalo')
		x0G = parseFloat(x)
		actualizarFuncion(document.getElementById('funcion').value)
		alertaIntervalo()
	}
}
function actualizarXf(x) {
	xfG = parseFloat(x)
	if ((funcionActual.fx(parseFloat(x))*funcionActual.fx(x0G)<=0 && x>x0G) || actual == 'SC' || actual == 'SCM') {
		if (actual == 'SCM' && x==0) {
			alertaIntervalo()
		} else {
			alertaIntervalo(true)
		}
	} else {
		xfG = parseFloat(x)
		//alert('El intervalo no cumple con la condicion de que  f(x0)*f(xf)<=0, por favor modificalo')
		actualizarFuncion(document.getElementById('funcion').value)
		alertaIntervalo()
	}
	xfG = parseFloat(x)
}
function triggerBotones(param) {
	document.querySelectorAll('#iteraciones').forEach(x => x.disabled = !param)
}
function actualizarFuncion(funcion) {
	funcionActual = new MetodoDeRaiz(funcion,0,true)
	if (actual == 'FP') {
		if (modificado) {
			funcionActual.falsaPosicion(x0G,xfG,0.00000001,modificado,2)
		} else {
			funcionActual.falsaPosicion(x0G,xfG,0.00000001)
		}
	} else if (actual == 'BS') {
		funcionActual.biseccion(x0G,xfG,0.00001)
	} else if (actual == 'N') {
		funcionActual.newton(x0G,0.00000001)
	} else if (actual == 'SC') {
		funcionActual.secante(x0G,xfG,0.00000001)
	} else if (actual == 'SCM') {
		funcionActual.secanteM(x0G,xfG,0.00000001)
	} else {
		funcionActual.iteracionSimple(x0G,0.00001)
	}
	triggerBotones(false)
	actualizarGrafica(0)
	iteraccionActual = 0

	const elem = document.getElementById('pretty')
	if (actual == 'IS') {
	    elem.innerHTML = '$$x='+math.parse(funcion).toTex()+'$$'
	} else if (actual == 'N') {
		let derivada = funcionActual.nodoDerivada.toTex()
	    elem.innerHTML = '$$f(x)='+math.parse(funcion).toTex()+";f'(x)="+derivada+'$$'
	} else {
	    elem.innerHTML = '$$f(x)='+math.parse(funcion).toTex()+'$$'
	}
	MathJax.typeset()
}
function actualizarSoluciones(arreglo,pactual,objeto) {
	actual = pactual
	funcionActual = objeto
	resultadoActual = arreglo
	actualizarGrafica(0)
	iteraccionActual = 0
}
function actualizarGrafica(i) {
	if (actual == 'BS') {
		funcionActual.graficarBiseccion(i,50,estado)
		actualizarTabla(i)
	} else if (actual == 'FP' || actual == 'FPM') {
		funcionActual.graficarFalsaPosicion(i,50,estado)
		actualizarTablaFP(i)
	} else if (actual == 'N') {
		funcionActual.graficarNewton(i,50,estado)
		actualizarTablaN(i)
	} else if (actual == 'SC' || actual == 'SCM') {
		funcionActual.graficarSecante(i,50,estado)
		actualizarTablaSC(i)
	} else {
		funcionActual.graficarIteracionSimple(i,50,estado)
		actualizarTablaIS(i)
	}
}
function actualizarTabla(i) {

	if (i==-1) {
		document.getElementById('-1,xl').innerHTML = 0
		document.getElementById('-1,xu').innerHTML = 0
		document.getElementById('-1,fxl').innerHTML = 0
		document.getElementById('-1,fxu').innerHTML = 0
		document.getElementById('-1,xr').innerHTML = 0
		document.getElementById('-1,fxr').innerHTML = 0
		document.getElementById('-1,e').innerHTML = 0

		document.getElementById('1,xl').innerHTML = 0
		document.getElementById('1,xu').innerHTML = 0
		document.getElementById('1,fxl').innerHTML = 0
		document.getElementById('1,fxu').innerHTML = 0
		document.getElementById('1,xr').innerHTML = 0
		document.getElementById('1,fxr').innerHTML = 0
		document.getElementById('1,e').innerHTML = 0

		document.getElementById('+1,xl').innerHTML = 0
		document.getElementById('+1,xu').innerHTML = 0
		document.getElementById('+1,fxl').innerHTML = 0
		document.getElementById('+1,fxu').innerHTML = 0
		document.getElementById('+1,xr').innerHTML = 0
		document.getElementById('+1,fxr').innerHTML = 0
		document.getElementById('+1,e').innerHTML = 0
	} else {
		let xl = ''
	let xu = ''
	let fxl = ''
	let fxu = ''
	let xr = ''
	let fxr = ''
	let e = ''

	let xl1 = ''
	let xu1 = ''
	let fxl1 = ''
	let fxu1 = ''
	let xr1 = ''
	let fxr1 = ''
	let e1 = ''

	let xl11 = ''
	let xu11 = ''
	let fxl11 = ''
	let fxu11 = ''
	let xr11 = ''
	let fxr11 = ''
	let e11 = ''

	if (i>0) {
		xl1 = resultadoActual[i-1][0]
		xu1 = resultadoActual[i-1][1]
		fxl1 = funcionActual.fx(resultadoActual[i-1][0])
		fxu1 = funcionActual.fx(resultadoActual[i-1][1])
		xr1 = resultadoActual[i-1][2]
		fxr1 = funcionActual.fx(resultadoActual[i-1][2])
		e1 = resultadoActual[i-1][3]*100
	}
	if (iteraccionActual<resultadoActual.length-1) {
		xl11 = resultadoActual[i+1][0]
		xu11 = resultadoActual[i+1][1]
		fxl11 = funcionActual.fx(resultadoActual[i+1][0])
		fxu11 = funcionActual.fx(resultadoActual[i+1][1])
		xr11 = resultadoActual[i+1][2]
		fxr11 = funcionActual.fx(resultadoActual[i+1][2])
		e11 = resultadoActual[i+1][3]*100
	}
	xl = resultadoActual[i][0]
	xu = resultadoActual[i][1]
	fxl = funcionActual.fx(resultadoActual[i][0])
	fxu = funcionActual.fx(resultadoActual[i][1])
	xr = resultadoActual[i][2]
	fxr = funcionActual.fx(resultadoActual[i][2])
	e = resultadoActual[i][3]*100
	document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
	document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
	document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
	document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)
	document.getElementById('-1,xr').innerHTML = math.round(xr1,3)
	document.getElementById('-1,fxr').innerHTML = math.round(fxr1,3)
	document.getElementById('-1,e').innerHTML = math.round(e1,3)

	document.getElementById('1,xl').innerHTML = math.round(xl,3)
	document.getElementById('1,xu').innerHTML = math.round(xu,3)
	document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
	document.getElementById('1,fxu').innerHTML = math.round(fxu,3)
	document.getElementById('1,xr').innerHTML = math.round(xr,3)
	document.getElementById('1,fxr').innerHTML = math.round(fxr,3)
	document.getElementById('1,e').innerHTML = math.round(e,3)

	document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
	document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
	document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
	document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
	document.getElementById('+1,xr').innerHTML = math.round(xr11,3)
	document.getElementById('+1,fxr').innerHTML = math.round(fxr11,3)
	document.getElementById('+1,e').innerHTML = math.round(e11,3)
	}
}

function actualizarTablaSC(i) {

	if (i==-1) {
		document.getElementById('-1,xl').innerHTML = 0
		document.getElementById('-1,xu').innerHTML = 0
		document.getElementById('-1,fxl').innerHTML = 0
		document.getElementById('-1,fxu').innerHTML = 0
		document.getElementById('-1,xr').innerHTML = 0
		document.getElementById('-1,fxr').innerHTML = 0

		document.getElementById('1,xl').innerHTML = 0
		document.getElementById('1,xu').innerHTML = 0
		document.getElementById('1,fxl').innerHTML = 0
		document.getElementById('1,fxu').innerHTML = 0
		document.getElementById('1,xr').innerHTML = 0
		document.getElementById('1,fxr').innerHTML = 0

		document.getElementById('+1,xl').innerHTML = 0
		document.getElementById('+1,xu').innerHTML = 0
		document.getElementById('+1,fxl').innerHTML = 0
		document.getElementById('+1,fxu').innerHTML = 0
		document.getElementById('+1,xr').innerHTML = 0
		document.getElementById('+1,fxr').innerHTML = 0
	} else {
		let xl = ''
	let xu = ''
	let fxl = ''
	let fxu = ''
	let xr = ''
	let fxr = ''

	let xl1 = ''
	let xu1 = ''
	let fxl1 = ''
	let fxu1 = ''
	let xr1 = ''
	let fxr1 = ''

	let xl11 = ''
	let xu11 = ''
	let fxl11 = ''
	let fxu11 = ''
	let xr11 = ''
	let fxr11 = ''

	if (i>0) {
		xl1 = resultadoActual[i-1][0]
		xu1 = resultadoActual[i-1][1]
		fxl1 = funcionActual.fx(resultadoActual[i-1][0])
		fxu1 = funcionActual.fx(resultadoActual[i-1][1])
		xr1 = resultadoActual[i-1][3]
		fxr1 = resultadoActual[i-1][4]*100
	}
	if (iteraccionActual<resultadoActual.length-1) {
		xl11 = resultadoActual[i+1][0]
		xu11 = resultadoActual[i+1][1]
		fxl11 = funcionActual.fx(resultadoActual[i+1][0])
		fxu11 = funcionActual.fx(resultadoActual[i+1][1])
		xr11 = resultadoActual[i+1][3]
		fxr11 = resultadoActual[i+1][4]*100
	}
	xl = resultadoActual[i][0]
	xu = resultadoActual[i][1]
	fxl = funcionActual.fx(resultadoActual[i][0])
	fxu = funcionActual.fx(resultadoActual[i][1])
	xr = resultadoActual[i][3]
	fxr = resultadoActual[i][4]*100
	document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
	document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
	document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
	document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)
	document.getElementById('-1,xr').innerHTML = math.round(xr1,3)
	document.getElementById('-1,fxr').innerHTML = math.round(fxr1,3)

	document.getElementById('1,xl').innerHTML = math.round(xl,3)
	document.getElementById('1,xu').innerHTML = math.round(xu,3)
	document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
	document.getElementById('1,fxu').innerHTML = math.round(fxu,3)
	document.getElementById('1,xr').innerHTML = math.round(xr,3)
	document.getElementById('1,fxr').innerHTML = math.round(fxr,3)

	document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
	document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
	document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
	document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
	document.getElementById('+1,xr').innerHTML = math.round(xr11,3)
	document.getElementById('+1,fxr').innerHTML = math.round(fxr11,3)
	}
}

function actualizarTablaFP(i) {

	let xl = ''
	let xu = ''
	let fxl = ''
	let fxu = ''
	let xr = ''
	let fxr = ''
	let e = ''

	let xl1 = ''
	let xu1 = ''
	let fxl1 = ''
	let fxu1 = ''
	let xr1 = ''
	let fxr1 = ''
	let e1 = ''

	let xl11 = ''
	let xu11 = ''
	let fxl11 = ''
	let fxu11 = ''
	let xr11 = ''
	let fxr11 = ''
	let e11 = ''

	if (i>0) {
		xl1 = resultadoActual[i-1][0]
		xu1 = resultadoActual[i-1][1]
		fxl1 = funcionActual.fx(resultadoActual[i-1][0])*2/resultadoActual[i-1][4]
		fxu1 = funcionActual.fx(resultadoActual[i-1][1])*2/resultadoActual[i-1][5]
		xr1 = resultadoActual[i-1][2]
		fxr1 = funcionActual.fx(resultadoActual[i-1][2])
		e1 = resultadoActual[i-1][3]*100
	}
	if (iteraccionActual<resultadoActual.length-1) {
		xl11 = resultadoActual[i+1][0]
		xu11 = resultadoActual[i+1][1]
		fxl11 = funcionActual.fx(resultadoActual[i+1][0])*2/resultadoActual[i+1][4]
		fxu11 = funcionActual.fx(resultadoActual[i+1][1])*2/resultadoActual[i+1][5]
		xr11 = resultadoActual[i+1][2]
		fxr11 = funcionActual.fx(resultadoActual[i+1][2])
		e11 = resultadoActual[i+1][3]*100
	}
	xl = resultadoActual[i][0]
	xu = resultadoActual[i][1]
	fxl = funcionActual.fx(resultadoActual[i][0])*2/resultadoActual[i][4]
	fxu = funcionActual.fx(resultadoActual[i][1])*2/resultadoActual[i][5]
	xr = resultadoActual[i][2]
	fxr = funcionActual.fx(resultadoActual[i][2])
	e = resultadoActual[i][3]*100
	document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
	document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
	document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
	document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)
	document.getElementById('-1,xr').innerHTML = math.round(xr1,3)
	document.getElementById('-1,fxr').innerHTML = math.round(fxr1,3)
	document.getElementById('-1,e').innerHTML = math.round(e1,3)

	document.getElementById('1,xl').innerHTML = math.round(xl,3)
	document.getElementById('1,xu').innerHTML = math.round(xu,3)
	document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
	document.getElementById('1,fxu').innerHTML = math.round(fxu,3)
	document.getElementById('1,xr').innerHTML = math.round(xr,3)
	document.getElementById('1,fxr').innerHTML = math.round(fxr,3)
	document.getElementById('1,e').innerHTML = math.round(e,3)

	document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
	document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
	document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
	document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
	document.getElementById('+1,xr').innerHTML = math.round(xr11,3)
	document.getElementById('+1,fxr').innerHTML = math.round(fxr11,3)
	document.getElementById('+1,e').innerHTML = math.round(e11,3)

	if (resultadoActual[i][4]>2) {
		document.getElementById('1,fxl').classList.add("iteracionModificada")
	} else {
		document.getElementById('1,fxl').classList.remove("iteracionModificada")
	}

	if (resultadoActual[i][5]>2) {
		document.getElementById('1,fxu').classList.add("iteracionModificada")
	} else {
		document.getElementById('1,fxu').classList.remove("iteracionModificada")
	}
}

function actualizarTablaIS(i) {
	let xl = ''
	let xu = ''
	let fxl = ''
	let fxu = ''
	let e = ''

	let xl1 = ''
	let xu1 = ''
	let fxl1 = ''
	let fxu1 = ''
	let e1 = ''

	let xl11 = ''
	let xu11 = ''
	let fxl11 = ''
	let fxu11 = ''
	let e11 = ''

	if (i>0) {
		xl1 = resultadoActual[i-1][0]
		xu1 = resultadoActual[i-1][1]
		fxl1 = funcionActual.fx(resultadoActual[i-1][0])
		fxu1 = funcionActual.fx(resultadoActual[i-1][1])
		e1 = resultadoActual[i-1][2]*100
	}
	if (iteraccionActual<resultadoActual.length-1) {
		xl11 = resultadoActual[i+1][0]
		xu11 = resultadoActual[i+1][1]
		fxl11 = funcionActual.fx(resultadoActual[i+1][0])
		fxu11 = funcionActual.fx(resultadoActual[i+1][1])
		e11 = resultadoActual[i+1][2]*100
	}
	xl = resultadoActual[i][0]
	xu = resultadoActual[i][1]
	fxl = funcionActual.fx(resultadoActual[i][0])
	fxu = funcionActual.fx(resultadoActual[i][1])
	e = resultadoActual[i][2]*100

	document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
	document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
	document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
	document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)
	document.getElementById('-1,e').innerHTML = math.round(e1,3)

	document.getElementById('1,xl').innerHTML = math.round(xl,3)
	document.getElementById('1,xu').innerHTML = math.round(xu,3)
	document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
	document.getElementById('1,fxu').innerHTML = math.round(fxu,3)
	document.getElementById('1,e').innerHTML = math.round(e,3)

	document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
	document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
	document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
	document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
	document.getElementById('+1,e').innerHTML = math.round(e11,3)
}
function actualizarTablaN(i) {
	let xl = ''
	let xu = ''
	let fxl = ''
	let fxu = ''
	let e = ''

	let xl1 = ''
	let xu1 = ''
	let fxl1 = ''
	let fxu1 = ''

	let xl11 = ''
	let xu11 = ''
	let fxl11 = ''
	let fxu11 = ''

	if (i>0) {
		xl1 = resultadoActual[i-1][0]
		xu1 = resultadoActual[i-1][1]
		fxl1 = resultadoActual[i-1][2]
		fxu1 = resultadoActual[i-1][3]
	}
	if (iteraccionActual<resultadoActual.length-1) {
		xl11 = resultadoActual[i+1][0]
		xu11 = resultadoActual[i+1][1]
		fxl11 = resultadoActual[i+1][2]
		fxu11 = resultadoActual[i+1][3]
	}
	xl = resultadoActual[i][0]
	xu = resultadoActual[i][1]
	fxl = resultadoActual[i][2]
	fxu = resultadoActual[i][3]

	document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
	document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
	document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
	document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)

	document.getElementById('1,xl').innerHTML = math.round(xl,3)
	document.getElementById('1,xu').innerHTML = math.round(xu,3)
	document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
	document.getElementById('1,fxu').innerHTML = math.round(fxu,3)

	document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
	document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
	document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
	document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
}
const Tipo = {
	ATRAS: 'Atras',
	ADELANTE: 'Adelante',
	CENTRADAS: 'Centradas'
}
//TODO Hacer algo parecido a las funciones lambda en Python
let dudx = (x) => {
	return -(-2*x+3)
}
class DiferenciasFinitas1D{
	constructor(pTipo,pNodos,pLongitud,pDuDx,pCb) {
		this.tipo = pTipo
		this.n = pNodos
		this.l = pLongitud
		this.dx = this.l/(this.n+1)
		this.dudx = pDuDx
		this.cb = pCb
		this.matrizTridiagonal = []
		this.vector = []
		this.solucion = []
		this.crearMatrices()
		this.crearVectores()
		this.solcuionar()
	}
	crearMatrices() {
		if (this.tipo == Tipo.CENTRADAS) {
			this.matrizTridiagonal = math.add(math.DenseMatrix.diagonal([this.n,this.n],1/(this.dx**2),1),math.DenseMatrix.diagonal([this.n,this.n],1/(this.dx**2),-1),math.DenseMatrix.diagonal([this.n,this.n],-2/(this.dx**2)))
		} else if (this.tipo == Tipo.ATRAS) {
			this.matrizTridiagonal = math.add(math.DenseMatrix.diagonal([this.n,this.n],-1/(this.dx),-1),math.DenseMatrix.diagonal([this.n,this.n],1/(this.dx)))
		} else if (this.tipo == Tipo.ADELANTE) {
			this.matrizTridiagonal = math.add(math.DenseMatrix.diagonal([this.n,this.n],1/(this.dx),1),math.DenseMatrix.diagonal([this.n,this.n],-1/(this.dx)))
		} else {
			//ERRORES
		}
	}
	crearVectores() {
		if (this.cb['E'][0] != undefined || this.cb['E'][1] != undefined) {
			let temp = []
			for (var i = 0; i < this.n; i++) {
				temp.push(this.dudx(i*this.dx)+(i==0)*-this.cb['E'][0]+(i==(this.n-1))*-this.cb['E'][1])
			}
			this.vector = math.reshape(math.matrix(temp),[this.n,1])
		} else if (pCb['E'][0] != undefined || pCb['N'][1] != undefined) {

		} else if (pCb['N'][0] != undefined || pCb['E'][1] != undefined) {

		} else if (pCb['N'][0] != undefined || pCb['N'][1] != undefined) {

		}
	}
	solcuionar() {
		this.solucion = math.multiply(math.inv(this.matrizTridiagonal),this.vector)
	}
}
class MetodoDeRaiz {
	constructor(dFx,pB=0,mathi=false) {
		if (mathi) {
			this.nodoF = math.parse(dFx)
			this.nodoDerivada = math.derivative(this.nodoF,'x')
			this.fx = (x) => this.nodoF.evaluate({x: x})
			this.dfdx = (x) => this.nodoDerivada.evaluate({x: x})
		} else {
			this.fx = (x) => {return dFx(x)-pB}
		}
	}
	secanteM(x0,dx,tol=0.00001,maxIter=300) {
		let xr = x0
		let iteraciones = []
		let numiter = 0
		let xr1 = xr - (dx*this.fx(xr))/(this.fx(xr+dx) - this.fx(xr))
		let error = math.abs((xr1 - xr)/xr1)
		iteraciones.push([xr,xr+dx,this.fx(xr),this.dfdx(xr),error])
		while (error > tol && numiter < maxIter) {
			xr = xr - (dx*this.fx(xr))/(this.fx(xr+dx) - this.fx(xr))
			xr1 = xr - (dx*this.fx(xr))/(this.fx(xr+dx) - this.fx(xr))
			error = math.abs((xr1 - xr)/xr1)
			iteraciones.push([xr,xr+dx,this.fx(xr),this.dfdx(xr),error])
			numiter++
		}
		actualizarSoluciones(iteraciones,'SCM',this)
		return [xr,iteraciones]
	}
	secante(x0,xf,tol=0.00001,maxIter=300) {
		let error = 1
		let xr = x0
		let xr1 = xf
		let iteraciones = []
		let numiter = 0
		iteraciones.push([xr,xr1,this.fx(xr),this.dfdx(xr),error])
		while (error > tol && numiter < maxIter) {
			let xr1_parcial = xr
			xr = xr - (this.fx(xr)*(xr-xr1))/(this.fx(xr)-this.fx(xr1))
			xr1 = xr1_parcial
			error = math.abs((xr - xr1)/xr)
			iteraciones.push([xr,xr1,this.fx(xr),this.dfdx(xr),error])
			numiter++
		}
		actualizarSoluciones(iteraciones,'SC',this)
		return [xr,iteraciones]
	}

	graficarSecante(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let min = 9*10**10
		let max = 9*10**-10
		let minx = 9*10**10
		let maxx = 9*10**-10

		let dx = (resultadoActual[j][1]-resultadoActual[j][0])/n

		for (var k = -10; k < n+10; k++) {
			x.push(resultadoActual[j][0]+k*dx)
			y.push(this.fx(resultadoActual[j][0]+k*dx))
		}
		min = math.min(y)
		max = math.max(y)
		minx = math.min(x)
		maxx = math.max(x)
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: [resultadoActual[i][0],resultadoActual[i][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xi',
		  line: {
			dash: 'dashdot',
		  }
		}
		let trace4 = {
		  x: [resultadoActual[i][1],resultadoActual[i][1]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xi-1',
		  line: {
			dash: 'dashdot',
		  }
		}
		let deriveichon = (x,x1,x2) => {
			let m = (this.fx(x2)-this.fx(x1))/(x2-x1)
			return this.fx(x1)+m*(x-x1)
		}
		let trace2 = {
		  x: [minx,maxx],
		  y: [deriveichon(minx,resultadoActual[i][1],resultadoActual[i][0]),deriveichon(maxx,resultadoActual[i][1],resultadoActual[i][0])],
		  mode: 'lines',
		  name: 'Pendiente',
		  line: {
		  	dash: 'dot'
		  }
		}
		let trace3 = {
		  x: [resultadoActual[i][0]],
		  y: [this.fx(resultadoActual[i][0])],
		  mode: 'markers',
		  name: 'f(Xi)',
		}
		let layout = {
		  title:'Iteracion ' + (parseInt(i)+1),
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica', [trace,trace1,trace4,trace2,trace3],layout,config)
		this.graficarSecante2(i,n,false)
	}

	graficarSecante2(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let min = 9*10**10
		let max = 9*10**-10
		let minx = 9*10**10
		let maxx = 9*10**-10
		let Xgeneral = []
		let Ygeneral = []
		for (var m = 0; m < resultadoActual.length; m++) {
			Xgeneral.push(resultadoActual[m][1])
			Ygeneral.push(this.fx(resultadoActual[m][1]))
		}
		Ygeneral.push(this.fx(resultadoActual[m-1][0]))
		Xgeneral.push(resultadoActual[m-1][0])
		minx = math.min(Xgeneral)
		maxx = math.max(Xgeneral)
		let dx = math.abs(maxx-minx)/n
		let xderivada = []
		let yderivada = []
		for (var k = -10; k < n+10; k++) {
			x.push(minx+k*dx)
			y.push(this.fx(minx+k*dx))
		}
		min = math.min(Ygeneral)-10*dx
		max = math.max(Ygeneral)+10*dx
		let t1x = []
		let t1y = []

		t1x.push(resultadoActual[0][1])
		t1y.push(0)
		xderivada.push(resultadoActual[0][1])
		yderivada.push(this.fx(resultadoActual[0][1]))
		
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
		let tracexi = {
		  x: [resultadoActual[i][0],resultadoActual[i][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xi',
		  line: {
			dash: 'dashdot',
		  }
		}
		let tracexi1 = {
		  x: [resultadoActual[i][1],resultadoActual[i][1]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xi-1',
		  line: {
			dash: 'dashdot',
		  }
		}
		let deriveichon = (x,x1,x2) => {
			let m = (this.fx(x2)-this.fx(x1))/(x2-x1)
			return this.fx(x1)+m*(x-x1)
		}
		let trace2 = {
		  x: [minx-10*dx,maxx+10*dx],
		  y: [deriveichon(minx-10*dx,resultadoActual[i][1],resultadoActual[i][0]),deriveichon(maxx+10*dx,resultadoActual[i][1],resultadoActual[i][0])],
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
		Plotly.newPlot('grafica2', [trace,tracexi,tracexi1,trace1,trace2,trace3],layout,config)
	}

	newton(x0,tol=0.0001,maxIter = 300) {
		let error = 1
		let xr = x0
		let iteraciones = []
		let numiter = 0
		iteraciones.push([xr,this.fx(xr),this.dfdx(xr),error])
		while (error > tol && numiter < maxIter) {
			
			xr = xr-(this.fx(xr))/(this.dfdx(xr))

			let xri = xr-(this.fx(xr))/(this.dfdx(xr))

			error = math.abs((xr - xri)/xri)
			numiter++
			iteraciones.push([xr,this.fx(xr),this.dfdx(xr),error])
		}
		actualizarSoluciones(iteraciones,'N',this)
		return [xr,iteraciones]
	}
	graficarNewton(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let min = 9*10**10
		let max = 9*10**-10
		let minx = 9*10**10
		let maxx = 9*10**-10

		let dx = (resultadoActual[j+1][0]-resultadoActual[j][0])/n

		for (var k = -10; k < n+10; k++) {
			x.push(resultadoActual[j][0]+k*dx)
			y.push(this.fx(resultadoActual[j][0]+k*dx))
		}
		min = math.min(y)
		max = math.max(y)
		minx = math.min(x)
		maxx = math.max(x)
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: [resultadoActual[i][0],resultadoActual[i][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xi',
		  line: {
			dash: 'dashdot',
		  }
		}
		let trace4 = {
		  x: [resultadoActual[i+1][0],resultadoActual[i+1][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xi+1',
		  line: {
			dash: 'dashdot',
		  }
		}
		let deriveichon = (x,x0) => {
			return this.fx(x0)+this.dfdx(x0)*(x-x0)
		}
		let trace2 = {
		  x: [minx,maxx],
		  y: [deriveichon(minx,resultadoActual[i][0]),deriveichon(maxx,resultadoActual[i][0])],
		  mode: 'lines',
		  name: 'Pendiente',
		  line: {
		  	dash: 'dot'
		  }
		}
		let trace3 = {
		  x: [resultadoActual[i][0]],
		  y: [this.fx(resultadoActual[i][0])],
		  mode: 'markers',
		  name: 'f(Xi)',
		}
		let layout = {
		  title:'Iteracion ' + (parseInt(i)+1),
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica', [trace,trace1,trace4,trace2,trace3],layout,config)
		this.graficarNewton2(i,n,false)
	}
	graficarNewton2(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
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
		Plotly.newPlot('grafica2', [trace,trace1,trace2,trace3],layout,config)
	}
	biseccion(pX0,pXf,tol=0.01) {
		if (this.fx(pX0)*this.fx(pXf)<=0) {
			let error = 99999999
			let x0 = pX0
			let xf = pXf
			let xr = 1
			let iteraciones = []
			while (error > tol) {
				xr = (x0 + xf)/2
				iteraciones.push([x0,xf,xr])
				let fxr = this.fx(xr)
				if (this.fx(x0)*fxr <= 0) {
					xf = xr
				} else {
					x0 = xr
				}
				error = math.abs(((x0 + xf)/2-xr)/((x0 + xf)/2))
				iteraciones[iteraciones.length-1].push(error) 
			}
			actualizarSoluciones(iteraciones,'BS',this)
			return [xr,iteraciones]
		} else {
			console.log('El intervalo no cumple con la condicion de que  f(x0)*f(xf)<=0, por favor modificalo')
		}
	}
	graficarBiseccion(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let min = 9*10**10
		let max = 9*10**-10
		let dx = math.abs(resultadoActual[j][1]-resultadoActual[j][0])/n
		for (var k = -10; k < n+10; k++) {
			x.push(resultadoActual[j][0]+k*dx)
			y.push(this.fx(resultadoActual[j][0]+k*dx))
			if (y[y.length-1]<min) {
				min = y[y.length-1]
			}
			if (y[y.length-1]>max) {
				max = y[y.length-1]
			}
		}
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: [resultadoActual[i][0],resultadoActual[i][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'X0'
		}
		let trace2 = {
		  x: [resultadoActual[i][1],resultadoActual[i][1]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'XF'
		}
		let trace3 = {
		  x: [resultadoActual[i][2],resultadoActual[i][2]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xr',
		  line: {
			dash: 'dashdot',
		  }
		}
		let layout = {
		  title:'Iteracion ' + (parseInt(i)+1),
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica', [trace,trace3,trace1,trace2],layout,config)
		this.graficarBiseccion2(i,n,false)
	}
	graficarBiseccion2(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let min = 9*10**10
		let max = 9*10**-10
		let dx = math.abs(resultadoActual[j][1]-resultadoActual[j][0])/n
		for (var k = -10; k < n+10; k++) {
			x.push(resultadoActual[j][0]+k*dx)
			y.push(this.fx(resultadoActual[j][0]+k*dx))
			if (y[y.length-1]<min) {
				min = y[y.length-1]
			}
			if (y[y.length-1]>max) {
				max = y[y.length-1]
			}
		}
		let t1x = []
		let t1y = []
		let t2x = []
		let t2y = []
		let t3x = []
		let t3y = []
		for (var k = 0; k <= i; k++) {
			t1x.push(resultadoActual[k][0])
			t1y.push(0)
			t2x.push(resultadoActual[k][1])
			t2y.push(0)
			t3x.push(resultadoActual[k][2])
			t3y.push(0)
		}
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: t1x,
		  y: t1y,
		  mode: 'markers',
		  name: 'X0'
		}
		let trace2 = {
		  x: t2x,
		  y: t2y,
		  mode: 'markers',
		  name: 'XF'
		}
		let trace3 = {
		  x: t3x,
		  y: t3y,
		  mode: 'markers',
		  name: 'Xr',
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
		Plotly.newPlot('grafica2', [trace,trace3,trace1,trace2],layout,config)
	}
	falsaPosicion(pX0,pXf,tol=0.01,pModificado=false,pN=3) {
		if (this.fx(pX0)*this.fx(pXf)<=0) {
			let error = 99999999
			let x0 = pX0
			let xf = pXf
			let xr = 1
			let iteraciones = []
			let divisorx0 = 2
			let divisorxf = 2
			while (error > tol) {
				let fx0 = this.fx(x0)/(divisorx0/2)
				let fxf =this.fx(xf)/(divisorxf/2)
				
				xr = xf - (fxf*(x0-xf))/(fx0-fxf)

				let fxr = this.fx(xr)

				iteraciones.push([x0,xf,xr])

				if (fx0*fxr <= 0) {
					xf = xr
				} else {
					x0 = xr
				}
				fx0 = this.fx(x0)/(divisorx0/2)
				fxf =this.fx(xf)/(divisorxf/2)
				let xr1 = xf - (fxf*(x0-xf))/(fx0-fxf)

				error = math.abs((xr1-xr)/xr1)
				iteraciones[iteraciones.length-1].push(error) 
				iteraciones[iteraciones.length-1].push(divisorx0)
				iteraciones[iteraciones.length-1].push(divisorxf)
				if (pModificado && iteraciones.length>=pN) {
					if (x0 == iteraciones[iteraciones.length-pN][0]) {
						divisorx0 += 2 
						divisorxf = 2
					} else if (xf == iteraciones[iteraciones.length-pN][1]) {
						divisorxf += 2
						divisorx0 = 2
					} else {
						divisorx0 = 2 
						divisorxf = 2
					}
				} 
			}
			actualizarSoluciones(iteraciones,'FP',this)
			return [xr,iteraciones]
		} else {
			triggerBotones(false)
			console.log('El intervalo no cumple con la condicion de que  f(x0)*f(xf)<=0, por favor modificalo')
		}
	}
	graficarFalsaPosicion(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let dx = math.abs(resultadoActual[j][1]-resultadoActual[j][0])/n
		let min = 9*10**10
		let max = 9*10**-10
		for (var k = -10; k < n+10; k++) {
			x.push(resultadoActual[j][0]+k*dx)
			y.push(this.fx(resultadoActual[j][0]+k*dx))
			if (y[y.length-1]<min) {
				min = y[y.length-1]
			}
			if (y[y.length-1]>max) {
				max = y[y.length-1]
			}
		}
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: [resultadoActual[i][0],resultadoActual[i][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'X0'
		}
		let trace2 = {
		  x: [resultadoActual[i][1],resultadoActual[i][1]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'XF'
		}
		let trace3 = {
		  x: [resultadoActual[i][2],resultadoActual[i][2]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xr',
		  line: {
			dash: 'dashdot',
		  }
		}
		let trace4 = {
		  x: [resultadoActual[i][0],resultadoActual[i][1]],
		  y: [this.fx(resultadoActual[i][0])/resultadoActual[i][4]*2,this.fx(resultadoActual[i][1])/resultadoActual[i][5]*2],
		  mode: 'lines',
		  name: 'Pendiente',
		  line: {
		  	dash: 'dot'
		  }

		}
		let layout = {
		  title:'Iteracion ' + (parseInt(i)+1),
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica', [trace,trace1,trace2,trace3,trace4],layout,config)
		this.graficarFalsaPosicion2(i,n,false)
	}
	graficarFalsaPosicion2(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let dx = math.abs(resultadoActual[j][1]-resultadoActual[j][0])/n
		let min = 9*10**10
		let max = 9*10**-10
		for (var k = -10; k < n+10; k++) {
			x.push(resultadoActual[j][0]+k*dx)
			y.push(this.fx(resultadoActual[j][0]+k*dx))
			if (y[y.length-1]<min) {
				min = y[y.length-1]
			}
			if (y[y.length-1]>max) {
				max = y[y.length-1]
			}
		}
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: [resultadoActual[i][0],resultadoActual[i][0]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'X0'
		}
		let trace2 = {
		  x: [resultadoActual[i][1],resultadoActual[i][1]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'XF'
		}
		let trace3 = {
		  x: [resultadoActual[i][2],resultadoActual[i][2]],
		  y: [min,max],
		  mode: 'lines',
		  name: 'Xr',
		  line: {
			dash: 'dashdot',
		  }
		}
		let trace4 = {
		  x: [resultadoActual[i][0],resultadoActual[i][1]],
		  y: [this.fx(resultadoActual[i][0])*2/resultadoActual[i][4],this.fx(resultadoActual[i][1])*2/resultadoActual[i][5]],
		  mode: 'lines',
		  name: 'Pendiente',
		  line: {
		  	dash: 'dot'
		  }

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
		Plotly.newPlot('grafica2', [trace,trace1,trace2,trace3,trace4],layout,config)
	}
	iteracionSimple(xr,tol=0.01) {
		console.log(xr)
		let numiter = 0
		let error = 1
		let xri = xr
		let iteraciones = []
		iteraciones.push([xri,this.fx(xri),error])
		while (error > tol && numiter < 300) {
			xri = this.fx(xri)
			error = math.abs((this.fx(xri) - xri)/this.fx(xri))
			numiter++
			iteraciones.push([xri,this.fx(xri),error])
		}
		actualizarSoluciones(iteraciones,'IS',this)
		return [xri,iteraciones]
	}
	graficarIteracionSimple(i,n=50,zoom=true) {
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let dx = math.abs(resultadoActual[j][1]-resultadoActual[j][0])/n
		let min = 9*10**10
		let max = 9*10**-10
		for (var k = -100; k < n+100; k++) {
			x.push(math.min(resultadoActual[j][0],resultadoActual[j][0])+k*dx)
			y.push(this.fx(math.min(resultadoActual[j][0],resultadoActual[j][0])+k*dx))
			if (y[y.length-1]<min) {
				min = y[y.length-1]
			}
			if (y[y.length-1]>max) {
				max = y[y.length-1]
			}
		}
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: x,
		  y: x,
		  mode: 'lines',
		  name: 'f(x)=x'
		}
		let trace2 = {
		  x: [resultadoActual[i][0],this.fx(resultadoActual[i][0])],
		  y: [this.fx(resultadoActual[i][0]),this.fx(resultadoActual[i][0])],
		  mode: 'lines+markers',
		  name: 'Xi',
		  line: {
		  	dash: 'dashdot'
		  }
		}
		let trace3 = {
		  x: [this.fx(resultadoActual[i][0]),this.fx(resultadoActual[i][0])],
		  y: [this.fx(resultadoActual[i][0]),this.fx(resultadoActual[i][1])],
		  mode: 'lines+markers',
		  name: 'Xi+1',
		  line: {
		  	dash: 'dashdot'
		  }
		}
		let layout = {
		  title:'Iteracion ' + (parseInt(i)+1),
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica', [trace,trace1,trace2,trace3],layout,config)
		this.graficarIteracionSimple2(i,n*2,false)
	}
	graficarIteracionSimple2(i,n=50,zoom=true) {
		let xx = []
		let yy = []
		let x = []
		let y = []
		let j = 1*(zoom*i)
		let min = 9*10**10
		let max = 9*10**-10
		let minX = 9*10**10
		let maxX = 9*10**-10
		for (var l = 0; l <= i; l++) {
			xx.push(resultadoActual[l][0],this.fx(resultadoActual[l][0]))
			yy.push(this.fx(resultadoActual[l][0]),this.fx(resultadoActual[l][0]))
			if (xx[xx.length-1]<minX) {
				minX = xx[xx.length-1]
			}
			if (xx[xx.length-2]<minX) {
				minX = xx[xx.length-2]
			}
			if (xx[xx.length-2]>maxX) {
				maxX = xx[xx.length-2]
			}
			if (xx[xx.length-1]>maxX) {
				maxX = xx[xx.length-1]
			}
		}
		let dx = math.abs(maxX-minX)/n
		for (var k = -100; k < n+100; k++) {
			x.push(minX+k*dx)
			y.push(this.fx(minX+k*dx))
			if (y[y.length-1]<min) {
				min = y[y.length-1]
			}
			if (y[y.length-1]>max) {
				max = y[y.length-1]
			}
		}
		let trace = {
		  x: x,
		  y: y,
		  mode: 'lines',
		  name: 'Grafica'
		}
		let trace1 = {
		  x: x,
		  y: x,
		  mode: 'lines',
		  name: 'f(x)=x'
		}
		let trace2 = {
		  x: xx,
		  y: yy,
		  mode: 'lines+markers',
		  name: 'Xi',
		  line: {
		  	dash: 'dashdot'
		  }
		}
		let layout = {
		  title:'Iteracion ' + (parseInt(i)+1),
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
		  }
		}
		var config = {responsive: true}
		Plotly.newPlot('grafica2', [trace,trace1,trace2],layout,config)
	}
}
class sistemasEcuaciones{
	constructor(M,F,metodo='gauss') {
		this.M = M
		this.F = F
		this.metodo = metodo
		this.solcuionarInversa()
		this.dibujarSoluciones()
	}
	solcuionarInversa() {
		let M = math.matrix(this.M)
		let F = math.matrix(this.F)
		this.U = math.multiply(math.inv(M),F)
		return this.U
	}
	dibujarSoluciones() {
		for (var i = 0; i < this.U._data.length; i++) {
			//document.getElementById('F'+i).value = this.U._data[i]
		}
	}
	solcuionarSeidel(tol=0.001) {
		let sol = [0,0,0,0,0,0,0,0,0,0,0,0]
		let soluciones = []
		soluciones.push([...sol])
		let error = 1
		let i = 0
		while (error > tol) {
			for (var j = 0; j < sol.length; j++) {
				let sum = 0
				for (var k = 0; k < sol.length; k++) {
					sum += (j!=k)*this.M[j][k]*soluciones[soluciones.length-1][k]
				}
				sol[j] = (this.F[j]-sum)/(this.M[j][j])
			}
			i++
			soluciones.push([...sol])
			error = math.max(math.abs(math.add(soluciones[soluciones.length-1],math.multiply(soluciones[soluciones.length-2],-1))))
		}
		return soluciones
	}
}
function cargarMatriz() {
	let a = []
	for (var i = 0; i < Nmatriz; i++) {
		let b = []
		for (var j = 0; j < Nmatriz; j++) {
			b.push(parseFloat(document.getElementById(i+','+j).value))
		}
		a.push(b)
	}
	return a
}
function cargarVector() {
	let f = []
	for (var i = 0; i < Nmatriz; i++) {
		p = parseFloat(document.getElementById('F'+i).value)
		f.push(p)
	}
	return f
}
let actualSE = undefined
matrizResultados =[]
vectorResultados = []
Nmatriz = 3
metodoActual = 'gauss'
function resolverSE() {
	actualSE = new sistemasEcuaciones(cargarMatriz(),cargarVector(),metodoActual)
	parcial = solveGauss(actualSE.M,math.transpose(math.matrix(actualSE.F))._data)
	matrizResultados = parcial[0]
	vectorResultados = parcial[1]
	var mods = document.querySelectorAll('#modal_2');
	[].forEach.call(mods, function(mod){ mod.checked = true; });
}
function anteriorIteracionSE() {
	iteraccionActual = iteraccionActual - 1*(iteraccionActual>0)
	for (var i = 0; i < Nmatriz; i++) {
		for (var j = 0; j < Nmatriz; j++) {
			l = document.getElementById(i+','+j)
			l.value = math.round(matrizResultados[iteraccionActual][i][j],2)
		}
		document.getElementById('F'+i).value = math.round(vectorResultados[iteraccionActual][i],2)
	}
}
function siguienteIteracionSE() {
	iteraccionActual = iteraccionActual + 1*(iteraccionActual<matrizResultados.length-1)
	for (var i = 0; i < Nmatriz; i++) {
		for (var j = 0; j < Nmatriz; j++) {
			l = document.getElementById(i+','+j)
			l.value = math.round(matrizResultados[iteraccionActual][i][j],2)
		}
		document.getElementById('F'+i).value = math.round(vectorResultados[iteraccionActual][i],2)
	}
}
function rellenarMatrizAleatorio(n=30) {
	for (var i = 0; i < Nmatriz; i++) {
		for (var j = 0; j < Nmatriz; j++) {
			l = document.getElementById(i+','+j)
			l.value = parseInt(math.random()*n)
		}
		document.getElementById('F'+i).value = parseInt(math.random()*n)
	}
}
function solveGauss(matrix,vector_solucion) {
	matricesRESULTADOS = []
	vectorRESULTADOS = []
	vectorRESULTADOS.push([...vector_solucion])
	matricesRESULTADOS.push([...matrix])
	if (actualSE.metodo == 'gauss') {
		for (var i = 0; i < matrix.length; i++) {
			for (var j = i + 1; j < matrix.length; j++) {
				vector_solucion[j] = vector_solucion[j] -(matrix[j][i])/(matrix[i][i])*vector_solucion[i]
				matrix[j] = sumarVectores(matrix[j],multiplicacionVectores(matrix[i],-(matrix[j][i])/(matrix[i][i])))
				vectorRESULTADOS.push([...vector_solucion])
				matricesRESULTADOS.push([...matrix])
			}
		}
	} else {
		for (var i = 0; i < matrix.length; i++) {
			vector_solucion[i] = vector_solucion[i]/(matrix[i][i])
			matrix[i] = multiplicacionVectores(matrix[i],1/(matrix[i][i]))
			vectorRESULTADOS.push([...vector_solucion])
			matricesRESULTADOS.push([...matrix])
			for (var j = i + 1; j < matrix.length; j++) {
				vector_solucion[j] = vector_solucion[j] -(matrix[j][i])/(matrix[i][i])*vector_solucion[i]
				matrix[j] = sumarVectores(matrix[j],multiplicacionVectores(matrix[i],-(matrix[j][i])/(matrix[i][i])))
				vectorRESULTADOS.push([...vector_solucion])
				matricesRESULTADOS.push([...matrix])
			}

		}
		for (var i = matrix.length-1; i >=0; i--) {
			vector_solucion[i] = vector_solucion[i]/(matrix[i][i])
			matrix[i] = multiplicacionVectores(matrix[i],1/(matrix[i][i]))
			vectorRESULTADOS.push([...vector_solucion])
			matricesRESULTADOS.push([...matrix])
			for (var j = i - 1; j >=0; j--) {
				vector_solucion[j] = vector_solucion[j] -(matrix[j][i])/(matrix[i][i])*vector_solucion[i]
				matrix[j] = sumarVectores(matrix[j],multiplicacionVectores(matrix[i],-(matrix[j][i])/(matrix[i][i])))
				vectorRESULTADOS.push([...vector_solucion])
				matricesRESULTADOS.push([...matrix])
			}
		}
	}

	return [matricesRESULTADOS,vectorRESULTADOS]
}
function sumarVectores(v1,v2) {
	let a = []
	for (var i = 0; i < v1.length; i++) {
		a.push(v1[i]+v2[i])
	}
	return a
}
function multiplicacionVectores(v,e) {
	let a = []
	for (var i = 0; i < v.length; i++) {
		a.push(v[i]*e)
	}
	return a		
}
function seidelIteracionAnterior() {
	iteraccionActual = iteraccionActual - 10*(iteraccionActual>0)
	dibujarSolucionesSeidel(iteraccionActual)
}
function calcularSeidel() {
	actualSE = correr()
	vectorResultados = actualSE.solcuionarSeidel(0.0001)
	dibujarSolucionesSeidel(0)
	iteraccionActual = 0
}
function seidelIteracionSiguiente() {
	iteraccionActual = iteraccionActual + 10*(iteraccionActual<vectorResultados.length-10)
	dibujarSolucionesSeidel(iteraccionActual)
}
function dibujarSolucionesSeidel(j) {
	v = vectorResultados
	for (var i = 0; i < v[j].length; i++) {
		if (v[j-1]==undefined) {
			document.getElementById('x'+i+'ii').innerHTML = 0
			document.getElementById('x'+i+'i').innerHTML = math.round(v[j][i],3)
			document.getElementById('x'+i+'iii').innerHTML = math.round(v[j+1][i],3)
		} else if (v[j+1]==undefined) {
			document.getElementById('x'+i+'ii').innerHTML = math.round(v[j-1][i],3)
			document.getElementById('x'+i+'i').innerHTML = math.round(v[j][i],3)
			document.getElementById('x'+i+'iii').innerHTML = 0
		} else if (v[j]!=undefined) {
			document.getElementById('x'+i+'ii').innerHTML = math.round(v[j-1][i],3)
			document.getElementById('x'+i+'i').innerHTML = math.round(v[j][i],3)
			document.getElementById('x'+i+'iii').innerHTML =  math.round(v[j+1][i],3)
		}
	}
	drawEstructura(v,inicial=false,j,inicio=j,colorPintar='blue')
}
triggerBotones(false)