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
let layout = {plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
		  title:'Iterpolación polinomial',
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
		try {
			Plotly.extendTraces(myPlot, {x: [[x]],y: [[y]]},[0]);
		} catch {
			Plotly.plot('myPlot', [{x: [x],y: [y],mode: 'markers',type: 'scatter',name: 'Puntos'}]);
		}
	}
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
	let xmin = math.min(EQUIS)
	let xmax = math.max(EQUIS)
	let YE = objetos.map(x=>x.y)
	FUNCION = interpolar(EQUIS,YE)
	graficar(xmin, xmax,FUNCION)
});
MATRIZ_GENERAL = undefined
VECTOR_GENERAL = undefined

function agregarDatoXY() {
	let x = parseFloat(document.getElementById('entradaX').value)
	let y = parseFloat(document.getElementById('entradaY').value)

	//agregarDatosXY
	if (x && y || (x == 0 || y == 0)) {
	try {
		Plotly.extendTraces(myPlot, {x: [[x]],y: [[y]]},[0]);
	} catch {
		Plotly.plot('myPlot', [{x: [x],y: [y],mode: 'markers',type: 'scatter',name: 'Puntos'}]);
	}


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
	let xmin = math.min(EQUIS)
	let xmax = math.max(EQUIS)
	FUNCION = interpolar(EQUIS,YE)
	graficar(xmin, xmax,FUNCION)
	}
}

function borrarDatos() {
	myPlot.data[0].x = []
	myPlot.data[0].y = []

	myPlot.data[1].x = []
	myPlot.data[1].y = []

	Plotly.react(myPlot)
	document.getElementById('latexmatriz').innerHTML = ''
	document.getElementById('pretty').innerHTML = ''
	document.getElementById('resultadosInformacion').innerHTML = ''
	try {
		MathJax.typeset()
	} catch {}

	//Plotly.deleteTraces('myPlot', [0,1])
}

function Lk(x,k) {
	let res = ''
	for (var i = 0; i < x.length; i++) {
		if (k!=i) {
			let signosup = x[i] <0?'+':'-'
			res += '\\left(\\frac{x'+signosup+math.round(x[i]**2/math.abs(x[i]),2)+'}{'+math.round(x[k]**2/math.abs(x[k]),2)+signosup+math.round(x[i]**2/math.abs(x[i]),2)+'}\\right)'
		}
	}
	return res
}

function lagrange(x,y) {
	let L = ''
	for (var i = 0; i < x.length; i++) {
		let signo = '+'
		if (i==0) {
			signo=''
		}
		let salto = '\\\\'
		L += signo+Lk(x,i) +'('+math.round(y[i],2)+')'+ salto
	}
	return L
}

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
	MATRIZ_GENERAL = M
	VECTOR_GENERAL = F
	let lambdita = x => {
		let sum = 0
		for(let j = 0, length2 = U.length; j < length2; j++){
			sum+=x**((U.length-1)-j)*U[j]
		}
		return sum
	}
	actualizarLatex(U,lagrange(x,y))
	return lambdita
}

function graficar(a,b,funcion,n=100,excel=false) {
	let arreglo = darResultados(a,b,funcion,n=100)
	var data_update = {
		x: arreglo[0],
		y: arreglo[1],
		name: 'Funcion Interpolada'
	};
	if(excel==false) {
		try {
			Plotly.deleteTraces('myPlot', 1)
		} catch {

		}
	}
	Plotly.plot('myPlot', [data_update])
}
function actualizarTabla(tabla) {
	//Datos en X,Y
	document.getElementById('latexmatriz').innerHTML = '$$\\small\\begin{align} f(x)='+tabla+'\\end{align}$$'
}
function darResultados(a,b,funcion,n=100) {
	let h = (b-a)/n
	let x = []
	let y = []
	for(let i = 0; i <= n; i++){
		x.push(a + h*i)
		y.push(funcion(a + h*i))
	}
	return [x,y]
}
function actualizarLatex(coeficientes,tabla) {

	const elem = document.getElementById('pretty')
	let stringLatex = '\\small f(x)='

	for(let i = 0, length1 = coeficientes.length; i < length1; i++){
		let signo = ''
		if (coeficientes[i]>=0) {
				signo = '+'
				if (i==0) {
					signo = ''
				}
			} 
		if (((coeficientes.length-1)-i)) {
			if (((coeficientes.length-1)-i) == 1) {
				stringLatex+=signo + math.round(coeficientes[i],3)+'x'
			} else {
				stringLatex+=signo + math.round(coeficientes[i],3)+'x^{'+((coeficientes.length-1)-i+'}')
			}
		} else {
			stringLatex+=signo + math.round(coeficientes[i],3)
		}
	}

	elem.innerHTML = '$$'+stringLatex+'$$'
	actualizarTabla(tabla)
	try {
	    MathJax.typeset()
	} catch {

	}
}
XL_row_object = undefined
$(document).ready(function(){
      $("#archivoEntrada").change(function(evt){
            var selectedFile = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
              var data = event.target.result;
              var workbook = XLSX.read(data, {
                  type: 'binary'
              });
              let X = []
              let Y = []
              workbook.SheetNames.forEach(function(sheetName) {
                  XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                  
                  for(let i = 0, length1 = XL_row_object.length; i < length1; i++){
                  	let fila = XL_row_object[i]
                  	X.push(fila.X)
                  	Y.push(fila.Y)
                  }
                  try {
	                  Plotly.deleteTraces('myPlot',[0,1])
                  } catch {}
	                  var traces = [{
						  x: X,
						  y: Y,
						  mode: 'markers',
						  type: 'scatter',
						  name: 'Puntos a Interpolar'
						}];
					Plotly.plot('myPlot', traces,layout)
					let objetos = []
					for(let i = 0, length1 = X.length; i < length1; i++){
						objetos.push({
							x:X[i],
							y:Y[i]
						})
					}
					objetos.sort(function (a, b) {
					  return a.x - b.x;
					});
					let EQUIS = objetos.map(x=>x.x)
					let YE = objetos.map(x=>x.y)
					FUNCION = interpolar(EQUIS,YE)
					let xmin = math.min(EQUIS)
					let xmax = math.max(EQUIS)
					graficar(xmin, xmax,FUNCION,100,true)
					var mods = document.querySelectorAll('.modal > [type=checkbox]');
				    [].forEach.call(mods, function(mod){ mod.checked = false; });
                })
              document.getElementById('archivoEntrada').value = ''
            };
            reader.onerror = function(event) {
              console.error("File could not be read! Code " + event.target.error.code);
            };
            reader.readAsBinaryString(selectedFile);
      });
});
function exportarExcel(a=0,b=1,n=100) {

	let data = darResultados(a,b,FUNCION,n)
	data = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
	var wb = XLSX.utils.book_new()
	wb.Props = {
                Title: "FuncionInterpolada",
                Subject: "",
                Author: "",
                CreatedDate: new Date()};
    wb.SheetNames.push("Funcion 1");
    var ws = XLSX.utils.aoa_to_sheet(data);
    wb.Sheets["Funcion 1"] = ws;

    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) { 
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;    
	}
	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'FuncionInterpolada.xlsx')
}
FUNCION = interpolar([1, 2],[10, 15])
graficar(1, 2,FUNCION)

document.onkeydown = function(e){
  if (e.keyCode == 27) {
    var mods = document.querySelectorAll('.modal > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = false; });
  }
}

function exportarExcelModal() {
	var mods = document.querySelectorAll('.modal1 > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = true; });
}
function importarExcelModal() {
	var mods = document.querySelectorAll('.modal2 > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = true; });
}

