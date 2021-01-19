let Nnn =5

for (var XI=[],i=-Nnn;i<Nnn;++i) XI[i]=i;
let YI = XI.map(x => 10*x**2-1*x-4+300*(Math.random())*(Math.random() < 0.5 ? -1 : 1))
ORDEN = 1
R2 = '-'
var traces = [{
  x: XI,
  y: YI,
  mode: 'markers',
  type: 'scatter',
  name: 'Puntos'
}];


traces.push({
  x: XI,
  y: YI,
  name: 'Órden ' + 3
})
traces.push({
  x: XI,
  y: YI,
  name: 'Órden ' + 2
})



var FUNCION = undefined
var myPlot = document.getElementById('myPlot')
let layout = {plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
		  title:'Interpolación con Splines',
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
	let YE = objetos.map(x=>x.y)
	let xmin = math.min(EQUIS)
	let xmax = math.max(EQUIS)
	FUNCION = interpolar(EQUIS,YE)
	graficar(xmin, xmax,FUNCION)
});
var spline = undefined
var spline2 = undefined

function interpolar (x,y) {
	spline = new Spline(x, y);
	spline2 = new SplineO2(x, y);

	let lambdita = x => {
		return spline.at(x)
	}
	let lambdita2 = x => {
		return spline2.at(x)
	}
	let TT = ''
	let U = spline2.U
	for (var i = 0; i < U.length; i+=3) {
		let signo1 = U[i+1][0] <0 ? '' : '+'
		let signo2 = U[i+2][0] <0 ? '' : '+'
		TT+= '&f(x)_{'+(parseInt(i/3)+1)+'}='+math.round(U[i][0],2)+'x^2'+signo1 +math.round(U[i+1][0],2)+'x'+signo2+math.round(U[i+2][0],2) +'\\\\'
	}
	TT += '\\\\\\text{Cúbicas:} \\'
	U = spline.U
	let derivadas = spline.darSegundasDerivadas()
	let contador = -1
	for (var i = 0; i < U.length; i+=4) {
		contador++
		let signo1 = U[i+1][0] <0 ? '' : '+'
		let signo2 = U[i+2][0] <0 ? '' : '+'
		let signo3 = U[i+3][0] <0 ? '' : '+'
		TT+= ' & f(x)_{'+(parseInt(i/4)+1)+'}='+math.round(U[i],2)+'x^3'+signo1 +math.round(U[i+1],2)+'x^2'+signo2+math.round(U[i+2],2)+'x'+signo3+math.round(U[i+3],2)+';f"('+math.round(x[contador],2)+')='+math.round(derivadas[contador],2) +' \\\\ '
	}
	TT+=' & f"('+math.round(x[contador+1],2)+')='+math.round(derivadas[contador+1],2) +' \\\\ '
	actualizarTabla(TT)
	return [lambdita,lambdita2]
}

function graficar(a,b,funcion,n=10000,excel=false) {

	let arreglo = spline.darResultados(n=100)
	let arreglo2 = spline2.darResultados(n=100)
	var data_update = {
		x: arreglo[0],
		y: arreglo[1],
		name: 'Órden ' + 3
	};
	var data_update2 = {
		x: arreglo2[0],
		y: arreglo2[1],
		name: 'Órden ' + 2
	};
	if(excel==false) {
		try {
			Plotly.deleteTraces('myPlot', [1,2])
		} catch {

		}
	}
	Plotly.plot('myPlot', [data_update,data_update2])
}
function actualizarTabla(TEXT) {
	document.getElementById('latexmatriz').innerHTML = '$$\\small\\begin{align}' +'\\text{Parábolas:} '+'\\ '+ TEXT+ '\\end{align}$$'
	try {
		MathJax.typeset()
	} catch {}
}
function borrarDatos() {
	myPlot.data[0].x = []
	myPlot.data[0].y = []
	myPlot.data[1].x = []
	myPlot.data[1].y = []
	Plotly.react(myPlot)
	document.getElementById('latexmatriz').innerHTML = ''
	document.getElementById('resultadosInformacion').innerHTML = ''
	try {
		MathJax.typeset()
	} catch {}
}

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

function darResultados(a,b,funcion,n=100) {
	let h = (b-a)/n
	let x = []
	let y = []
	for(let i = 0; i < n; i++){
		x.push(a + h*i)
		y.push(funcion(a + h*i))
	}
	return [x,y]
}
function actualizarLatex(coeficientes) {

	const elem = document.getElementById('pretty')
	let stringLatex = 'f(x)='

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
				stringLatex+=signo + math.round(coeficientes[i],3)+'x^'+((coeficientes.length-1)-i)
			}
		} else {
			stringLatex+=signo + math.round(coeficientes[i],3)
		}
	}

	elem.innerHTML = '$$'+stringLatex+'$$'
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
	                  Plotly.deleteTraces('myPlot',[0,1,2])
                  } catch {}
	                  var traces = [{
						  x: X,
						  y: Y,
						  mode: 'markers',
						  type: 'scatter',
						  name: 'Puntos a Interpolar'
						}];
					Plotly.plot('myPlot', traces)
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

	let data = darResultados(a,b,FUNCION[0],n)
	data = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
	let data2 = darResultados(a,b,FUNCION[1],n)
	data2 = data2[0].map((_, colIndex) => data2.map(row => row[colIndex]));
	var wb = XLSX.utils.book_new()
	wb.Props = {
                Title: "FuncionInterpolada",
                Subject: "",
                Author: "",
                CreatedDate: new Date()};
    wb.SheetNames.push("Funcion Cubica")
	wb.SheetNames.push("Funcion Cuadratica")
    wb.Sheets["Funcion Cubica"] = XLSX.utils.aoa_to_sheet(data)
    wb.Sheets["Funcion Cuadratica"] = XLSX.utils.aoa_to_sheet(data2)

    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) { 
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;    
	}
	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'FuncionInterpolada.xlsx')
}
FUNCION = interpolar(XI,YI)
graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION)

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

function menosOrden() {
	ORDEN -= 1*(ORDEN>=1)
	actualizarOrden()
}
function masOrden() {
	ORDEN += 1
	actualizarOrden()
}

function actualizarOrden() {
	let X = myPlot.data[0].x
	let Y = myPlot.data[0].y
	FUNCION = interpolar(X,Y)
	graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION)
}
