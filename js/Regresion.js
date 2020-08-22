for (var XI=[],i=-20;i<22;++i) XI[i]=i;
let YI = XI.map(x => 10*x**2-1*x-4+1000*(Math.random())*(Math.random() < 0.5 ? -1 : 1))
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
  name: 'Regresión, Órden ' + ORDEN + ' R2 = ' + R2
})



var FUNCION = undefined
var myPlot = document.getElementById('myPlot')
let layout = {
		  title:'Regresión polinomial',
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
function regresion_pol(x,y,o) {
	var zanahorias = []

	for (var i = 0; i < 2*o+1; i++) {
		let algo = x.map(x => x ** i)
		zanahorias.push(algo.reduce((a, b) => a + b))
	}
	let K = math.zeros(o, o)._data
	let V = []

	for (var i = 0; i < K.length; i++) {
		for (var j = 0; j < K.length; j++) {
			K[i][j] = zanahorias[i+j]
		}
		let algo = 0
		for (var j = 0; j < x.length; j++) {
			algo+=(x[j]**i)*(y[j])
		}
		V.push([algo])
	}
	console.log(K,V)
	let U = math.multiply(math.inv(math.matrix(K)),math.matrix(V))._data
	return U
}
function interpolar (x,y) {
	let U = regresion_pol(x,y,ORDEN+1).flat().reverse()
	let lambdita = x => {
		let sum = 0
		for(let j = 0, length2 = U.length; j < length2; j++){
			sum+=x**((U.length-1)-j)*U[j]
		}
		return sum
	}
	actualizarR2(lambdita)
	actualizarLatex(U)
	return lambdita
}

function graficar(a,b,funcion,n=100,excel=false) {
	let arreglo = darResultados(a,b,funcion,n=100)
	var data_update = {
		x: arreglo[0],
		y: arreglo[1],
		name: 'Regresión, Órden ' + ORDEN +' R2 = ' + math.round(R2,4)
	};
	actualizarTabla()
	if(excel==false) {
		Plotly.deleteTraces('myPlot', 1)
	}
	Plotly.plot('myPlot', [data_update])
}
function actualizarTabla() {
	let data = darResultados(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION,9)
	for(let i = 0, length1 = data[0].length; i < length1; i++){
		document.getElementById('X'+(i+1)).innerHTML = math.round(data[0][i],3)
		document.getElementById('Y'+(i+1)).innerHTML = math.round(data[1][i],3)

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
	                  Plotly.deleteTraces('myPlot',[0,1])
	                  var traces = [{
						  x: X,
						  y: Y,
						  mode: 'markers',
						  type: 'scatter',
						  name: 'Puntos a Interpolar'
						}];
					Plotly.plot('myPlot', traces)
					FUNCION = interpolar(X,Y)
					graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION,100,true)
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
FUNCION = interpolar(XI,YI)
graficar(myPlot.layout.xaxis.range[0], myPlot.layout.xaxis.range[1],FUNCION)

document.onkeydown = function(e){
  if (e.keyCode == 27) {
    var mods = document.querySelectorAll('.modal > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = false; });
  }
}

function exportarExcelModal() {
	var mods = document.querySelectorAll('.modal > [type=checkbox]');
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