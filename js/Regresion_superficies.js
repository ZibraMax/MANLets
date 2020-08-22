ORDEN = 2
var RESULTADOS = []
for (var XI=[],i=-10;i<10;++i) XI.push(i);
let YI = [...XI]
let ZI =  []
var FUNCION = (x,y) => -1*x**3+5*y**2+5
let X = []
let Y = []
let Z = []
for (var i = 0; i < XI.length; i++) {
	for (var j = 0; j < YI.length; j++) {
		if (Math.random()>0.7) {
			Z.push(FUNCION(XI[i],YI[j])+1.5*(Math.random())*(Math.random() < 0.5 ? -1 : 1))
			ZI.push(FUNCION(XI[i],YI[j]))
			X.push(XI[i])
			Y.push(YI[j])
		}
	}
}
var trace1 = {
	x:X, y: Y, z: Z,
	mode: 'markers',
	marker: {
		size: 5,
		line: {
		color: 'rgba(217, 217, 217, 0.14)',
		width: 0.8},
		opacity: 0.8},
	type: 'scatter3d'
};
var trace2 = {
	x:X, y: Y, z: ZI,
	opacity: 0.8,
	color:'rgb(192, 240, 36)',
	type: 'mesh3d'
};

var data = [trace1,trace2];
var layout = {
	title:'Regresión polinomial',xaxis: {title:'x'},yaxis: {title:'y'},
	margin: {l: 0,r: 0,b: 0,t: 0},
	legend: {
		x: 1,
		xanchor: 'right',
		y: 1
	}
	};

Plotly.newPlot('myPlot', data, layout,{responsive: true});


function regresion_pol(x,y,z,o) {

	let X = [x,y]
	let K = math.zeros(2*o+1, 2*o+1)._data
	let V = []

	for (var i = 0; i < K.length; i++) {
		for (var j = 0; j < K.length; j++) {
			let suma = 0
			for (var k = 0; k < x.length; k++) {
				suma += (X[(i+1)%2][k]**Math.floor((i+1)/2)) * (X[(j+1)%2][k]**Math.floor((j+1)/2))
			}
			K[i][j] = suma
		}
		let algo = 0
		for (var j = 0; j < x.length; j++) {
			algo+=(X[(i+1)%2][j]**Math.floor((i+1)/2))*(z[j])
		}
		V.push([algo])
	}

	let U = math.multiply(math.inv(math.matrix(K)),math.matrix(V))._data
	RESULTADOS = [K,V,U]
	return U
}
function interpolar(x,y,z) {
	let U = regresion_pol(x,y,z,ORDEN).flat()
	let lambdita = (x,y) => {
		let sum = 0
		for(let j = 0, length2 = U.length; j < length2; j++){
			sum += x**(Math.floor((j+1)/2))*U[j]*((j+1)%2==0)+y**(Math.floor((j+1)/2))*U[j]*((j+1)%2==1)
		}
		return sum
	}
	//actualizarR2(lambdita)
	actualizarLatex(U)
	return lambdita
}
function actualizarLatex(coeficientes) {

	const elem = document.getElementById('pretty')
	let stringLatex = 'f(x,y)='

	for(let i = 0, length1 = coeficientes.length; i < length1; i++){
		let signo = ''
		let coeff = math.round(coeficientes[i],4)
		if (coeff>=0 && i>0) {
			signo = '+'
		}
		let variable = ''
		if (i!=0) {
			variable = 'y'
			if ((i+1)%2==0) {
				variable = 'x'
			}
		}
		let exp = ''
		if (i>2) {
			exp = '^'+(Math.floor((i+1)/2))
		}
		stringLatex += signo + coeff + variable+ exp 
	}
	elem.innerHTML = '$$'+stringLatex+'$$'
    MathJax.typeset()
}
function darResultados(a,b,funcion,n=100) {
	let h = (b-a)/n
	let x = []
	let y = []
	let z = []
	for(let i = 0; i < n; i++){
		for (var j = 0; j < n; j++) {
			x.push(a + h*i)
			y.push(a + h*j)
			z.push(funcion(a + h*i, a + h*j))
		}
	}
	return [x,y,z]
}
function graficar(a,b,funcion,n=100,excel=false) {
	let arreglo = darResultados(a,b,funcion,n=100)
	var data_update = {
		x: arreglo[0],
		y: arreglo[1],
		z: arreglo[2],
		name: 'Regresión, Órden ' + ORDEN,
		opacity:0.8,
		color:'rgb(192, 240, 36)',
		type: 'mesh3d'
	};
	actualizarTabla()
	if(excel==false) {
		Plotly.deleteTraces('myPlot', 1)
	}
	Plotly.plot('myPlot', [data_update])
}

function actualizarTabla() {
	let lugarTabla = document.getElementById('tablaNXN')

	let K = RESULTADOS[0]
	let V = RESULTADOS[1]
	let U = RESULTADOS[2]
	let tabla = '\\tiny\\begin{pmatrix}'
	for (var i = 0; i < K.length; i++) {
		for (var j = 0; j < K.length; j++) {
			let sep = '&'
			if (j==(K.length-1)) {
				sep = ''
			}
			tabla+=math.round(K[i][j],3)+sep
		}
		tabla+='\\\\'
	}
	tabla+='\\end{pmatrix}'
	tabla+= '\\cdot\\begin{pmatrix}'
	for (var i = 0; i < K.length; i++) {
		tabla+='a_{'+i+'}\\\\'
	}
	tabla+='\\end{pmatrix}='
	tabla+= '\\begin{pmatrix}'
	for (var i = 0; i < K.length; i++) {
		tabla+=math.round(V[i],3)+'\\\\'
	}
	tabla+='\\end{pmatrix}\\rightarrow'
	tabla+= '\\begin{pmatrix}'
	for (var i = 0; i < K.length; i++) {
		tabla+=math.round(U[i],3)+'\\\\'
	}
	tabla+='\\end{pmatrix}'
	lugarTabla.innerHTML = '$$'+tabla+'$$'
	MathJax.typeset()
}

var myPlot = document.getElementById('myPlot')
FUNCION = interpolar(X,Y,Z)
graficar(-15, 15,FUNCION,100)

function menosOrden() {
	ORDEN -= 1*(ORDEN>=1)
	actualizarOrden()
}
function masOrden() {
	ORDEN += 1
	actualizarOrden()
}

function actualizarOrden(excel=false) {
	let X = myPlot.data[0].x
	let Y = myPlot.data[0].y
	let Z = myPlot.data[0].z
	FUNCION = interpolar(X,Y,Z)
	let a = math.min(myPlot.data[0].x)
	let b = math.max(myPlot.data[0].x)
	a = Math.min(a,math.min(myPlot.data[0].y))
	b = Math.max(b,math.max(myPlot.data[0].y))
	if (!excel) {
		a = math.min(myPlot.data[1].x)
		b = math.max(myPlot.data[1].x)
		a = Math.min(a,math.min(myPlot.data[1].y))
		b = Math.max(b,math.max(myPlot.data[1].y))
	}
	graficar(a, b,FUNCION,100,excel)
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
              let Z = []
              workbook.SheetNames.forEach(function(sheetName) {
                  XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                  
                  for(let i = 0, length1 = XL_row_object.length; i < length1; i++){
                  	let fila = XL_row_object[i]
                  	X.push(fila.X)
                  	Y.push(fila.Y)
                  	Z.push(fila.Z)
                  }
	                  Plotly.deleteTraces('myPlot',[0,1])
	                  var traces = [{
						  x: X,
						  y: Y,
						  z: Z,
						  marker: {
							size: 5,
							line: {
							color: 'rgba(217, 217, 217, 0.14)',
							width: 0.8},
							opacity: 0.8},
						type: 'scatter3d'
						}];
					Plotly.plot('myPlot', traces)
					actualizarOrden(excel=true)
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