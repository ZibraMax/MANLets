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
	anteriorIteracionSE()
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
			document.getElementById('letraF').innerHTML = '\\(F\\)'
		}
		let s = 'U = \\begin{pmatrix}'
		for (var i = 0; i < actualSE.U._data.length; i++) {
			s+=math.round(actualSE.U._data[i],4)+'\\\\'
		}
		s+='\\end{pmatrix}'
		actualizarLatex(LATEXITOS[iteraccionActual]+'\\rightarrow '+s)
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
	var n = M.length
	var L = []
	var U = []
	var P = []
	for (var i = 0; i < n; i++) {
		L.push(new Array(n).fill(0))
		U.push(new Array(n).fill(0))
		L[i][0]=M[i][0]
		U[0][i]=M[0][i]/L[0][0]
	}
    for (var i = 0; i < M.length; i++) {
    	L[i][0] = M[i][0]
    	U[i][i] = 1
    }

	for (var j = 1; j < M.length; j++) {
	    U[0][j] = M[0][j] / L[0][0]
	}

    for (var i = 1; i < M.length; i++) {
    	for (var j = 1; j <= i; j++) {
    		let SUM = 0
    		for (var k = 0; k <= j-1; k++) {
    			SUM+=L[i][k]*U[k][j]
    		}
    		L[i][j] = M[i][j] - SUM
    	}
    	for (var j = i+1; j < M.length; j++) {
    		let SUM = 0
    		for (var k = 0; k <= i-1; k++) {
    			SUM+=L[i][k]*U[k][j]
    		}
    		U[i][j]=(M[i][j]-SUM)/(L[i][i])
    	}
    }
	return solucionarLU(L,U,F,M,[...F])
}
function solucionarLU(matrix,matrix2,vector_solucion,MATRIZORIGINAL,EFE) {
	matricesRESULTADOS = []
	vectorRESULTADOS = []
	vectorRESULTADOS.push([...EFE])
	matricesRESULTADOS.push([...MATRIZORIGINAL])

	for (var i = 0; i < matrix.length; i++) {
		L = M2Tex(matrix)  + '\\cdot \\{x\\}=' + M2TexV(vector_solucion) + '\\rightarrow '
		LATEXITOS.push(L+'F'+(i+1)+'=F'+(i+1)+'\\cdot '+math.round(1/matrix[i][i],3))
		vector_solucion[i] = vector_solucion[i]/(matrix[i][i])
		matrix[i] = multiplicacionVectores(matrix[i],1/(matrix[i][i]))
		vectorRESULTADOS.push([...EFE])
		matricesRESULTADOS.push([...MATRIZORIGINAL])
		for (var j = i; j < matrix[i].length; j++) {
			if (i==j) {
			} else {
				L = M2Tex(matrix)  + '\\cdot \\{x\\}=' + M2TexV(vector_solucion) + '\\rightarrow '
				LATEXITOS.push(L+'F'+(j+1)+'=F'+(j+1)+'-F'+(i+1)+'\\cdot '+math.round((matrix[j][i])/(matrix[i][i]),3))
				vector_solucion[j] = vector_solucion[j] -(matrix[j][i])/(matrix[i][i])*vector_solucion[i]
				matrix[j] = sumarVectores(matrix[j],multiplicacionVectores(matrix[i],-(matrix[j][i])/(matrix[i][i])))
				vectorRESULTADOS.push([...EFE])
				matricesRESULTADOS.push([...MATRIZORIGINAL])
			}
		}
	}
	for (var i = matrix2.length-1; i >=0; i--) {
		U = M2Tex(matrix2) +'\\cdot \\{x\\}=' + M2TexV(vector_solucion) + '\\rightarrow '
		LATEXITOS.push(U+ 'F'+(i+1)+'=F'+(i+1)+'\\cdot '+math.round(1/matrix2[i][i],3))
		vector_solucion[i] = vector_solucion[i]/(matrix2[i][i])
		matrix2[i] = multiplicacionVectores(matrix2[i],1/(matrix2[i][i]))
		vectorRESULTADOS.push([...EFE])
		matricesRESULTADOS.push([...MATRIZORIGINAL])
		for (var j = i - 1; j >=0; j--) {
			U = M2Tex(matrix2) +'\\cdot \\{x\\}=' + M2TexV(vector_solucion) + '\\rightarrow '
			LATEXITOS.push(U+ 'F'+(j+1)+'=F'+(j+1)+'-F'+(i+1)+'\\cdot '+math.round((matrix2[j][i])/(matrix2[i][i]),3))
			vector_solucion[j] = vector_solucion[j] -(matrix2[j][i])/(matrix2[i][i])*vector_solucion[i]
			matrix2[j] = sumarVectores(matrix2[j],multiplicacionVectores(matrix2[i],-(matrix2[j][i])/(matrix2[i][i])))
			vectorRESULTADOS.push([...EFE])
			matricesRESULTADOS.push([...MATRIZORIGINAL])
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
function M2Tex(M) {
	M = M.map(X => X.map(x => math.round(x,3)))
	M = M.map(x => x.join('&'))
	return '\\begin{pmatrix}'+M.join('\\\\')+'\\end{pmatrix}'
}
function M2TexV(M) {
	M = M.map(x => math.round(x,3))
	return '\\begin{pmatrix}'+M.join('\\\\')+'\\end{pmatrix}'
}