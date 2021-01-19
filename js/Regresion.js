var mathFields = []
var mathFieldSpans = []
var ECUACIONES = []

var MQ = MathQuill.getInterface(2);
ECUACIONES.push('1')
ECUACIONES.push('x')
ECUACIONES.push('x^2')
for (var i = 0; i < ECUACIONES.length; i++) {
	mathFieldSpans.push(document.getElementsByName('z'+(i+1))[0])
	let mathField = MQ.MathField(mathFieldSpans[mathFieldSpans.length-1], {
	    spaceBehavesLikeTab: true,
	    handlers: {
	        edit: function() {
	            try{
	            	actualizarFunciones()
	            }
	            catch(e){}
	        }
	    }
	})
	mathFields.push(mathField)
}
function updateFuncion(i) {
	ECUACIONES[i] = mathFields[i].latex()
}
function crearTabla() {
	let TABLA = document.getElementById('ecuaciones')
	TABLA.innerHTML = ''
	let PLANTILLA = (i)=> '<tr><td>\\(z_{'+i+'}=\\)</td><td id="ecuacion'+i+'"></td><td><label onclick="borrarEcuacion('+i+')">&times;</label></td></tr>'
	let ULTIMA_FILA = '<tr><td colspan="3" class="casillaCentrada"><label onclick="agregarEcuacion()" style="color: gray;"><i class="fas fa-plus-circle fa-2x"></i></label></td></tr>'
	mathFieldSpans = []
	mathFields = []
	for (var i = 0; i < ECUACIONES.length; i++) {
		TABLA.innerHTML+=PLANTILLA(i+1)
	}
	TABLA.innerHTML+=ULTIMA_FILA
	for (var i = 0; i < ECUACIONES.length; i++) {
		let config = {spaceBehavesLikeTab: true,handlers: {edit: function() {actualizarFunciones()}}}
		let ecuacion = ECUACIONES[i]
		var mathFieldSpan = $('<span onclick ="ecuacionActual('+(i+1)+')" id="math-field" name="z'+(i+1)+'" class="mathquill-editable-math-field"></span>');
		var mathField = MQ.MathField(mathFieldSpan[0],config);
		mathFieldSpan.appendTo(document.getElementById('ecuacion'+(i+1)));
		mathField.write(ecuacion)
		mathField.reflow();
		mathFields.push(mathField)
		mathFieldSpans.push(document.getElementsByName('z'+(i+1))[0])
	}
	try {
		MathJax.typeset()
	} catch {

	}
}
function actualizarFunciones() {
	for (var i = 0; i < mathFields.length; i++) {
		updateFuncion(i)
	}
}
for (var XI=[],i=-20;i<22;++i) XI[i]=i;
let YI = XI.map(x => 10*x**2-1*x-4+1000*(Math.random())*(Math.random() < 0.5 ? -1 : 1))
ORDEN = 2
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
  name: 'Regresión'
})



var FUNCION = undefined
var myPlot = document.getElementById('myPlot')
let layout = {plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
		  title:'Regresión de Mínimos Cuadrados',
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
	ORDEN = 1

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
FUNCIONES = []
function parserFunciones() {
	FUNCIONES = []
	for (var i = 0; i < ECUACIONES.length; i++) {
		let nodoF = math.parse(MathExpression.fromLatex(ECUACIONES[i]).toString().toLowerCase())
		let fx = (x) => nodoF.evaluate({x: x})
		FUNCIONES.push(fx)
	}
	return FUNCIONES

}
function regresionGeneral(x,y) {
	FUNCIONES = parserFunciones()
	let Z = math.zeros(x.length,FUNCIONES.length)._data
	let F = []
	for (var i = 0; i < Z.length; i++) {
		for (var j = 0; j < Z[i].length; j++) {
			Z[i][j]=FUNCIONES[j](x[i])
		}
		F.push([y[i]])
	}
	Z = math.matrix(Z)
	F = math.matrix(F)
	let IZQUIERDA = math.multiply(math.transpose(Z),Z)
	let DERECHA = math.multiply(math.transpose(Z),F);

	MATRIZ_GENERAL = IZQUIERDA._data
	VECTOR_GENERAL = DERECHA._data
	let U = math.multiply(math.inv(IZQUIERDA),DERECHA)._data
	return U
}
function interpolar (x,y) {
	let U = []
	let lambdita = undefined
	U = regresionGeneral(x,y)
	lambdita = x => {
		let sum = 0
		for (var i = 0; i < U.length; i++) {
			sum+=FUNCIONES[i](x)*U[i]
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
		name: 'Regresión'
	};
	actualizarTabla()
	if(excel==false) {
		try {
			Plotly.deleteTraces('myPlot', 1)
		} catch {

		}
	}
	Plotly.plot('myPlot', [data_update])
}
function actualizarTabla() {
	//Datos en X,Y
	let X = myPlot.data[0].x
	let Y = myPlot.data[0].y
	let K = MATRIZ_GENERAL
	let V = VECTOR_GENERAL

	//Matriz de Coeficientes
	let tabla = '\\small\\begin{pmatrix}'
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
	tabla+='\\end{pmatrix}'
	document.getElementById('latexmatriz').innerHTML = '$$'+tabla+'$$'

	let e = 0
	for (var i = 0; i < X.length; i++) {
		e += (Y[i]-FUNCION(X[i]))**2
	}
	let sxy = math.sqrt(e/(X.length-2))
	document.getElementById('resultadosInformacion').innerHTML = '\\(S_{x/y}=' + math.round(sxy,2) + ';R^2='+math.round(R2,3)+'\\)'
	try {
		MathJax.typeset() 

	} catch {

	}
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
function calcularRegresionGeneral(){
	let XI = myPlot.data[0].x
	let YI = myPlot.data[0].y
	FUNCION = interpolar(XI,YI)
	let xmin = math.min(XI)
	let xmax = math.max(XI)
	graficar(xmin, xmax,FUNCION)
}
function actualizarLatex(coeficientes) {
	console.log(coeficientes)
	const elem = document.getElementById('pretty')
	let stringLatex = 'f(x)='
	for (var i = 0; i < coeficientes.length; i++) {
		let COEFF = math.round(coeficientes[i],2)
		if (math.abs(COEFF)<=1*10**-6) {
			continue
		}
		let signo1 = COEFF>0? '+':''
		if (i==0) {
			signo1 = ''
		}
		if (COEFF==1 && i != 0) {
			COEFF=''
		}
		let ecuacion = ECUACIONES[i]
		if (ECUACIONES[i]=='1') {
			ecuacion = ''
		}
		stringLatex += signo1+COEFF+''+ecuacion
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
	                  Plotly.deleteTraces('myPlot',[0,1])
                  } catch {}
	                  var traces = [{
						  x: X,
						  y: Y,
						  mode: 'markers',
						  type: 'scatter',
						  name: 'Puntos a Interpolar'
						}];
					Plotly.plot('myPlot', traces)
					FUNCION = interpolar(X,Y)
					let xmin = math.min(X)
					let xmax = math.max(X)
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
FUNCION = interpolar(XI,YI)
let xmin = math.min(XI)
let xmax = math.max(XI)
graficar(xmin, xmax,FUNCION)

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

function menosOrden() {
	ORDEN -= 1*(ORDEN>=1)
	actualizarOrden()
}
function masOrden() {
	ORDEN += 1*(ORDEN<myPlot.data[0].x.length-1)
	actualizarOrden()
}

function actualizarOrden() {
	ECUACIONES = []
	for (var i = 0; i <= ORDEN; i++) {
		if (i==0) {
			ECUACIONES.push('1')
		} else if(i==1) {
			ECUACIONES.push('x')
		} else {
			ECUACIONES.push('x^{'+i+'}')
		}
	}
	crearTabla()
	let X = myPlot.data[0].x
	let Y = myPlot.data[0].y
	let xmin = math.min(X)
	let xmax = math.max(X)
	FUNCION = interpolar(X,Y)
	graficar(xmin, xmax,FUNCION)
}
function importarExcelModal() {
	var mods = document.querySelectorAll('.modal2 > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = true; });
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


function triggerBotones(param,id='iteraciones') {
	document.querySelectorAll('#'+id).forEach(x => x.disabled = !param)
}
function abrirModalZ() {
	var mods = document.querySelectorAll('.modal3 > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = true; });
};
ECUACION_ACTUAL = 0
function ecuacionActual(i) {
	ECUACION_ACTUAL = i-1
}

function input(str) {
	mathFields[ECUACION_ACTUAL].cmd(str)
	mathFields[ECUACION_ACTUAL].focus()
}
function borrarEcuacion(i) {
	ECUACIONES.splice(i-1, 1)
	crearTabla()
}

function agregarEcuacion() {
	ECUACIONES.push('1')
	crearTabla()
}
// triggerBotones(false)
triggerBotones(false,'botonZeta')
