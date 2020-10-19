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
let layout = {
		  title:'Interpolación con Splines',
		  xaxis: {
		  	title:'x'
		  },
		  yaxis: {
		  	title:'y'
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
	Plotly.extendTraces(myPlot, {x: [[x]],y: [[y]]},[0]);}
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
	FUNCION = interpolar(EQUIS,YE)
	graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION)
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
	actualizarR2(lambdita)
	//actualizarLatex(U)
	return [lambdita,lambdita2]
}

function graficar(a,b,funcion,n=10000,excel=false) {
	let arreglo = darResultados(a,b,funcion[0],n=n)
	let arreglo2 = darResultados(a,b,funcion[1],n=n)
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
	actualizarTabla()
	if(excel==false) {
		Plotly.deleteTraces('myPlot', [1,2])
	}
	Plotly.plot('myPlot', [data_update,data_update2])
}
function actualizarTabla() {
	let data = darResultados(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION[0],9)
	let data2 = darResultados(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION[1],9)

	for(let i = 0, length1 = data[0].length; i < length1; i++){
		document.getElementById('X'+(i+1)).innerHTML = math.round(data[0][i],3)
		document.getElementById('Y'+(i+1)).innerHTML = math.round(data[1][i],3)
		document.getElementById('Y'+(i+1)+'C').innerHTML = math.round(data2[1][i],3)

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
    MathJax.typeset()
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
	                  Plotly.deleteTraces('myPlot',[0,1,2])
	                  var traces = [{
						  x: X,
						  y: Y,
						  mode: 'markers',
						  type: 'scatter',
						  name: 'Puntos a Interpolar'
						}];
					Plotly.plot('myPlot', traces)
					FUNCION = interpolar(X,Y)
					graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION,10000,true)
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

function actualizarR2(f) {
	let Y = myPlot.data[0].y
	let X = myPlot.data[0].x
	let Ypred = X.map(f)
	let ymean = Y.reduce((a,b) => a + b) / Y.length
	let ST = 0
	let SR = 0
	for (var i = 0; i < Y.length; i++) {
		ST += (Y[i] - ymean)**2
		SR += (Y[i]-Ypred[i])**2
	}
	R2 = (ST-SR)/ST
}