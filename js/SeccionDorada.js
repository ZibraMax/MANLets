var sliderx0 = document.getElementById('sliderx0')
var x0G = parseFloat(sliderx0.value)
var sliderxf = document.getElementById('sliderxf')
let xfG = parseFloat(sliderxf.value)
var funcionActual = undefined
let iteraccionActual = 0
var resultadoActual = []

var mathFieldSpan = document.getElementById('math-field');
var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function() {
            try{
              triggerBotones(false)
              actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
            }
            catch(e){}
        }
    }
});


function siguienteIteracion() {
  iteraccionActual = iteraccionActual + 1*(iteraccionActual<resultadoActual.length-1)
  actualizarGrafica(iteraccionActual)
}
function anteriorIteracion() {
  iteraccionActual = iteraccionActual - 1*(iteraccionActual>0)
  actualizarGrafica(iteraccionActual)
}
function triggerBotones(param) {
  document.querySelectorAll('#iteraciones').forEach(x => x.disabled = !param)
}
function actualizarX0(x) {
  x0G = parseFloat(x)
  try {
    actualizarFuncion(document.getElementById('funcion').value)
  } catch {
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
  }
}
function actualizarXf(x) {
  xfG = parseFloat(x)
  try {
    actualizarFuncion(document.getElementById('funcion').value)
  } catch {
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
  }
}
function actualizarFuncion(funcion) {
  funcionActual = new SeccionDorada(funcion)
  funcionActual.dorada(x0G,xfG,0.00000001)
  triggerBotones(false)
  actualizarGrafica(0)
  iteraccionActual = 0

  const elem = document.getElementById('pretty')
  elem.innerHTML = '$$f(x)='+math.parse(funcion).toTex()+'$$'
  MathJax.typeset()
}
function actualizarSoluciones(arreglo,objeto) {
  funcionActual = objeto
  resultadoActual = arreglo
  iteraccionActual = 0
  actualizarGrafica(0)
}
function actualizarGrafica(i) {
  funcionActual.graficar(i,50)
  actualizarTabla(i)
}
function resolver() {
  try {
    actualizarFuncion(document.getElementById('funcion').value)
  } catch {
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
  }
  actualizarX0(document.getElementById('sliderx0').value)
  actualizarXf(document.getElementById('sliderxf').value)
  triggerBotones(true)
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
    fxl1 = resultadoActual[i-1][2]
    fxu1 = resultadoActual[i-1][3]
    xr1 = resultadoActual[i-1][4]
    fxr1 = resultadoActual[i-1][5]
    e1 = resultadoActual[i-1][6]*100
  }
  if (iteraccionActual<resultadoActual.length-1) {
    xl11 = resultadoActual[i+1][0]
    xu11 = resultadoActual[i+1][1]
    fxl11 = resultadoActual[i+1][2]
    fxu11 = resultadoActual[i+1][3]
    xr11 = resultadoActual[i+1][4]
    fxr11 = resultadoActual[i+1][5]
    e11 = resultadoActual[i+1][6]*100
  }
  xl = resultadoActual[i][0]
  xu = resultadoActual[i][1]
  fxl = resultadoActual[i][2]
  fxu = resultadoActual[i][3]
  xr = resultadoActual[i][4]
  fxr = resultadoActual[i][5]
  e = resultadoActual[i][6]*100

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

class SeccionDorada {
  constructor(dFx) {
    this.nodoF = math.parse(dFx)
    this.fx = (x) => this.nodoF.evaluate({x: x})
  }
  dorada(a,b,tol=0.000001,maxIter=300) {
    let f = this.fx
    let R = (Math.sqrt(5)-1)/2
    let xl = a
    let xu = b
    let xr = -1
    let i = 0
    let error = 1
    let iteraciones = []
    let maximizando = document.getElementById('maximizarRadio').checked
    while(error > tol && i < maxIter) {
      let d = R*(xu-xl)
      let x1 = xl + d
      let x2 = xu - d
      let fx1 = f(x1)
      let fx2 = f(x2)
      iteraciones.push([xl,xu,d,fx1,fx2])
      if (maximizando) {
        if (fx1>fx2) {
          xr = x1
          xl = x2
          x2 = x1
        } else {
          xr = x2
          xu = x1
          x1 = x2
        }
      } else {
        if (fx1<fx2) {
          xr = x1
          xl = x2
          x2 = x1
        } else {
          xr = x2
          xu = x1
          x1 = x2
        }
      }
      i++
      error = 0.3819*Math.abs((xu-xl)/(xr))
      iteraciones[iteraciones.length-1].push(xr)
      iteraciones[iteraciones.length-1].push(error)
    }
    actualizarSoluciones(iteraciones,this)
    return [xr,iteraciones]
  }
  graficar(i,n=50,zoom=true) {
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
      name: 'xu'
    }
    let trace2 = {
      x: [resultadoActual[i][1],resultadoActual[i][1]],
      y: [min,max],
      mode: 'lines',
      name: 'xl'
    }
    let trace3 = {
      x: [resultadoActual[i][0]+resultadoActual[i][2],resultadoActual[i][0]+resultadoActual[i][2]],
      y: [min,max],
      mode: 'lines',
      name: 'X1',
      line: {
      dash: 'dashdot',
      }
    }
    let trace4 = {
      x: [resultadoActual[i][1]-resultadoActual[i][2],resultadoActual[i][1]-resultadoActual[i][2]],
      y: [min,max],
      mode: 'lines',
      name: 'X2',
      line: {
      dash: 'dashdot',
      }
    }
    let layout = {plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
      title:'Iteracion ' + (parseInt(i)+1),
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
    var config = {responsive: true}
    Plotly.newPlot('grafica', [trace,trace1,trace2,trace3,trace4],layout,config)
    this.graficar2(i,n,false)
  }
  graficar2(i,n=50,zoom=true) {
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
      t3x.push(resultadoActual[k][5])
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
      name: 'xl'
    }
    let trace2 = {
      x: t2x,
      y: t2y,
      mode: 'markers',
      name: 'xu'
    }
    let trace3 = {
      x: t3x,
      y: t3y,
      mode: 'markers',
      name: 'Xopt',
    }
    let trace4 = {
        x: [resultadoActual[i][5],resultadoActual[i][5]],
        y: [0,this.fx(resultadoActual[i][5])],
        mode: 'lines',
        name: 'Óptimo',
        line: {
        dash: 'dashdot',
        }
      }
    let layout = {plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
      title:'Iteraciones General ',
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
    var config = {responsive: true}
    Plotly.newPlot('grafica2', [trace,trace1,trace2,trace3,trace4],layout,config)
  }
}
if (navigator.userAgent.match(/Mobile/)) {
  document.getElementById('cuelloBotella').innerHTML = '<input type="text" id="funcion" value="2sin(x)-(x^2)/10" onchange="actualizarFuncion(this.value)">';
}

$('#cositasLindas').toolbar({
  content: '#toolbar-options',
  animation: 'grow'
  });
function input(str) {
  mathField.cmd(str)
  mathField.focus()
}
document.body.onload = function(){
  triggerBotones(false)
  var queryString = window.location.search;
  if (queryString != '') {
    queryString = queryString.split('?')[1]
    let parametros = new URLSearchParams(queryString);
    funcion_param = parametros.get('fx')
    console.log(funcion_param)
    try {
      let estado = parametros.get('max')=='true'
      document.getElementById('maximizarRadio').checked = estado
      document.getElementById('minimizarRadio').checked = !estado
      mathField.focus();
      mathField.keystroke('End Shift-Home Del');
      // input(funcion_param)
      mathField.write(funcion_param)
      mathField.focus()
      actualizarX0(parseFloat(parametros.get('xl')))
      actualizarXf(parseFloat(parametros.get('xu')))
      sliderxf.value = parseFloat(parametros.get('xu'))
      sliderx0.value = parseFloat(parametros.get('xl'))

    } catch (e) {
      console.log(queryString,e)
    }
    triggerBotones(true)
  }
}