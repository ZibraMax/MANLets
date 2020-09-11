let actualSE = undefined
matrizResultados =[]
LATEXITOS = ['\\text{Avance en pasos para ver resultados}']
vectorResultados = []
Nmatriz = 3
var iteraccionActual = 0
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
			error = math.max(math.abs(math.add(soluciones[soluciones.length-1],math.multiply(soluciones[soluciones.length-2],-1))))
			soluciones.push([...sol])
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
function resolverSE() {
	actualSE = new sistemasEcuaciones(cargarMatriz(),cargarVector(),metodoActual)
	parcial = solveGauss(actualSE.M,math.transpose(math.matrix(actualSE.F))._data)
	matrizResultados = parcial[0]
	vectorResultados = parcial[1]
	var mods = document.querySelectorAll('#modal_2');
	[].forEach.call(mods, function(mod){ mod.checked = true; });
	triggerBotones(true)
	latexSolucion()
}
function anteriorIteracionSE() {
	iteraccionActual = iteraccionActual - 1*(iteraccionActual>0)
	for (var i = 0; i < Nmatriz; i++) {
		for (var j = 0; j < Nmatriz; j++) {
			l = document.getElementById(i+','+j)
			l.value = math.round(matrizResultados[iteraccionActual][i][j],3)
		}
		document.getElementById('F'+i).value = math.round(vectorResultados[iteraccionActual][i],3)
	}
	latexSolucion()
}
function siguienteIteracionSE() {
	iteraccionActual = iteraccionActual + 1*(iteraccionActual<matrizResultados.length-1)
	for (var i = 0; i < Nmatriz; i++) {
		for (var j = 0; j < Nmatriz; j++) {
			l = document.getElementById(i+','+j)
			l.value = math.round(matrizResultados[iteraccionActual][i][j],3)
		}
		document.getElementById('F'+i).value = math.round(vectorResultados[iteraccionActual][i],3)
	}
	latexSolucion()
}
function latexSolucion() {
	if (iteraccionActual==(matrizResultados.length-1)) {
		if (actualSE.metodo=='jordan') {
			document.getElementById('letraF').innerHTML = '\\(U\\)'
		}
		actualizarLatex(LATEXITOS[iteraccionActual])
	} else {
		document.getElementById('letraF').innerHTML = '\\(F\\)'
		actualizarLatex(LATEXITOS[iteraccionActual])
	}
}
function rellenarMatrizAleatorio(n=30) {
	let M = []
	for (var i = 0; i < Nmatriz; i++) {
		let linea = []
		for (var j = 0; j < Nmatriz; j++) {
			linea.push(math.random()*n)
		}
		M.push(linea)
	}
	for (var i = 0; i < Nmatriz; i++) {
		M[i][i] = math.sum(math.abs(M[i]))*1.5
	}
	for (var i = 0; i < Nmatriz; i++) {
		for (var j = 0; j < Nmatriz; j++) {
			l = document.getElementById(i+','+j)
			l.value = parseInt(M[i][j])
		}
		document.getElementById('F'+i).value = parseInt(math.random()*n)
	}
}
function solveGauss(M,F) {
	let tol = 0.00001
	let sol = Array(F.length).fill(0)
	let soluciones = []
	let matrices = []
	soluciones.push([...sol])
	let error = 1
	let L  = 0
	while (error > tol) {
		L++
		let s2 = '\\begin{pmatrix}'
		for (var i = 0; i < sol.length; i++) {
			s2 += math.round(sol[i],3)+'\\\\'
		}
		s2+='\\end{pmatrix}'
		let s = '\\begin{pmatrix}'
		for (var i = 0; i < sol.length; i++) {
			let sum = 0
			for (var k = 0; k < sol.length; k++) {
				sum += (i!=k)*M[i][k]*soluciones[soluciones.length-1][k]
			}
			s+='U_{'+(i+1)+'}=\\frac{'+F[i]+'-'+math.round(sum,3)+'}{'+M[i][i]+'}'+'\\\\'
		}
		s+='\\end{pmatrix}'
		let s1 = '=\\begin{pmatrix}'

		for (var j = 0; j < sol.length; j++) {
			let sum = 0
			for (var k = 0; k < sol.length; k++) {
				sum += (j!=k)*M[j][k]*soluciones[soluciones.length-1][k]
			}
			sol[j] = (F[j]-sum)/(M[j][j])
			s1 += math.round(sol[j],3)+'\\\\'
		}
		s1+='\\end{pmatrix}'
		soluciones.push([...sol])
		matrices.push(M)
		errores = []
		for (var i = 0; i < soluciones[soluciones.length-1].length; i++) {
			errores.push(math.abs((soluciones[soluciones.length-1][i]-soluciones[soluciones.length-2][i])/soluciones[soluciones.length-1][i]))
		}
		error = math.max(errores)
		LATEXITOS.push('U^{'+(L-1)+'}'+s2+'\\rightarrow U^{' + (L) + '}=' + s + s1+'\\varepsilon_a='+math.round(error*100,4)+'\\%')
	}
	return [matrices,soluciones]
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
function recargarPagina() {
	window.location.reload(true)
}
function actualizarLatex(str) {
	document.getElementById('pretty').innerHTML='$$'+str+'$$'
	MathJax.typeset()
}
function triggerBotones(param) {
	document.querySelectorAll('#iteraciones').forEach(x => x.disabled = !param)
	actualizarLatex('\\text{Presione el boton calcular}')
}

