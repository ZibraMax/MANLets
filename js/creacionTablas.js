
function tablaNXN(n,divname,tipo='input') {
	var tabla = document.createElement("table")
	tabla.setAttribute('class','primary')
	tabla.setAttribute('style','width: auto')
	var tableHeader = document.createElement('thead')
	var tablebody = document.createElement('tbody')

	for (var i = 0; i < n+1; i++) {
		let coli = document.createElement("th")
		if (i == 0) {
			coli.innerHTML = 'Eq\\Var'
		} else {
			coli.innerHTML = '$$x_{'+i+'}$$'
			fila = document.createElement('tr')
			for (var j = 0; j < n+1; j++) {
				if (j==0) {
					celdai = document.createElement('th')
					celdai.innerHTML = i
				} else {
					celdai = document.createElement('td')
					inputsirto = document.createElement(tipo)
					if (tipo != 'input') {
						inputsirto.innerHTML = 99999
					} else {
						inputsirto.setAttribute('value','0')
					}
					inputsirto.setAttribute('style','width: 100%')
					inputsirto.setAttribute('type','number')
					inputsirto.setAttribute('id',(i-1)+','+(j-1))
					celdai.appendChild(inputsirto)
				}
				fila.appendChild(celdai)
			}
			celdai = document.createElement('td')
			let Fi = document.createElement(tipo)
			if (tipo != 'input') {
				Fi.innerHTML = 99999
			} else {
				Fi.setAttribute('value','0')
			}
			Fi.setAttribute('type','number')
			Fi.setAttribute('id','F'+(i-1))
			celdai.appendChild(Fi)
			fila.appendChild(celdai)
			tablebody.appendChild(fila)
		}
		tableHeader.appendChild(coli)
	}
	let ff = document.createElement('th')
	ff.innerHTML='$$F$$'
	tableHeader.appendChild(ff)

	filasolver = document.createElement('tr')
	botonsolver = document.createElement('th')
	botonsolver.setAttribute('colspan',''+(n+2))
	boton = document.createElement('button')
	boton.setAttribute('onclick','resolverSE()')
	boton.setAttribute('class','stack icon-paper-plane')
	boton.setAttribute('style','text-align: center;')
	boton.innerHTML = 'Calcular'
	botonsolver.appendChild(boton)
	filasolver.appendChild(botonsolver)
	tablebody.appendChild(filasolver)


	filaIteraciones = document.createElement('tr')
	tamañoBoton = math.floor((n+2)/2)-(n+1)%2
	LabelbotonSiguiente = document.createElement('td')
	LabelbotonSiguiente.setAttribute('colspan',''+tamañoBoton)
	LabelbotonSiguiente.setAttribute('style','text-align: center')

	boton1 = document.createElement('button')
	boton1.setAttribute('onclick','anteriorIteracionSE()')
	boton1.setAttribute('class','succes icon-paper-plane')
	boton1.innerHTML = '< Iteracion Anterior'
	LabelbotonSiguiente.appendChild(boton1)


	LabelbotonAnterior = document.createElement('td')
	LabelbotonAnterior.setAttribute('colspan',''+tamañoBoton)
	LabelbotonAnterior.setAttribute('style','text-align: center')

	boton1 = document.createElement('button')
	boton1.setAttribute('onclick','siguienteIteracionSE()')
	boton1.setAttribute('class','warning icon-paper-plane')
	boton1.innerHTML = 'Iteracion Siguiente >'
	LabelbotonAnterior.appendChild(boton1)

	labellist = document.createElement('label')
	spansicro = document.createElement('span')

	tdDistance = document.createElement('td')
	tdDistance.setAttribute('colspan',''+(n+2-2*tamañoBoton))
	tdDistance.setAttribute('style','text-align: center')


	spansicro.setAttribute('class','checkable')
	spansicro.innerHTML = 'Jordan'
	list = document.createElement('input')
	list.setAttribute('type','checkbox')
	list.setAttribute('id','tipo')
	list.setAttribute('onchange',"if (document.getElementById('tipo').checked){metodoActual = 'jordan'} else {metodoActual = 'gauss'}")

	labellist.appendChild(list)
	labellist.appendChild(spansicro)
	tdDistance.appendChild(labellist)
	filaIteraciones.appendChild(LabelbotonSiguiente)
	filaIteraciones.appendChild(tdDistance)
	filaIteraciones.appendChild(LabelbotonAnterior)

	tablebody.appendChild(filaIteraciones)



	tabla.appendChild(tableHeader)
	tabla.appendChild(tablebody)
	document.getElementById(divname).appendChild(tabla)
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

document.onkeydown = function(e){
  if (e.keyCode == 27) {
    var mods = document.querySelectorAll('.modal > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = false; });
  }
}
function cerrarModal(){
	var mods = document.querySelectorAll('.modal > [type=checkbox]');
    [].forEach.call(mods, function(mod){ mod.checked = false; });
}