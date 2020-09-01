var sliderx0 = document.getElementById('sliderx0')
var x0G = parseFloat(sliderx0.value)
var sliderxf = document.getElementById('sliderxf')
var xfG = parseFloat(sliderxf.value)
var sliderx3 = document.getElementById('sliderx3')
var xf3 = parseFloat(sliderx3.value)

var funcionActual = undefined
let iteraccionActual = 0
var resultadoActual = []

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
function actualizarX0(x,paila=false) {
  x0G = parseFloat(x)
  if (!paila) {
    actualizarFuncion(document.getElementById('funcion').value)
  }
}
function actualizarXf(x,paila=false) {
  xfG = parseFloat(x)
  if (!paila) {
    actualizarFuncion(document.getElementById('funcion').value)
  }
}
function actualizarX3(x,paila=false) {
  xf3 = parseFloat(x)
  if (!paila) {
    actualizarFuncion(document.getElementById('funcion').value)
  }
}
function actualizarFuncion(funcion) {
  funcionActual = new OPtimizacionCuadratica(funcion)
  funcionActual.cuadratica(x0G,xfG,xf3,0.00000001)
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
  actualizarX0(document.getElementById('sliderx0').value,paila=true)
  actualizarXf(document.getElementById('sliderxf').value,paila=true)
  actualizarX3(document.getElementById('sliderx3').value,paila=true)
  actualizarFuncion(document.getElementById('funcion').value)
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
    document.getElementById('-1,e2').innerHTML = 0
    document.getElementById('-1,e3').innerHTML = 0


    document.getElementById('1,xl').innerHTML = 0
    document.getElementById('1,xu').innerHTML = 0
    document.getElementById('1,fxl').innerHTML = 0
    document.getElementById('1,fxu').innerHTML = 0
    document.getElementById('1,xr').innerHTML = 0
    document.getElementById('1,fxr').innerHTML = 0
    document.getElementById('1,e').innerHTML = 0
    document.getElementById('1,e2').innerHTML = 0
    document.getElementById('1,e3').innerHTML = 0


    document.getElementById('+1,xl').innerHTML = 0
    document.getElementById('+1,xu').innerHTML = 0
    document.getElementById('+1,fxl').innerHTML = 0
    document.getElementById('+1,fxu').innerHTML = 0
    document.getElementById('+1,xr').innerHTML = 0
    document.getElementById('+1,fxr').innerHTML = 0
    document.getElementById('+1,e').innerHTML = 0
    document.getElementById('+1,e2').innerHTML = 0
    document.getElementById('+1,e3').innerHTML = 0

  } else {
    let xl = ''
  let xu = ''
  let fxl = ''
  let fxu = ''
  let xr = ''
  let fxr = ''
  let e = ''
  let ee2 = ''
  let ee3 = ''

  let xl1 = ''
  let xu1 = ''
  let fxl1 = ''
  let fxu1 = ''
  let xr1 = ''
  let fxr1 = ''
  let e1 = ''
  let e2 = ''
  let e3 = ''

  let xl11 = ''
  let xu11 = ''
  let fxl11 = ''
  let fxu11 = ''
  let xr11 = ''
  let fxr11 = ''
  let e11 = ''
  let e12 = ''
  let e13 = ''

  if (i>0) {
    xl1 = resultadoActual[i-1][0]
    xu1 = resultadoActual[i-1][1]
    fxl1 = resultadoActual[i-1][2]
    fxu1 = resultadoActual[i-1][3]
    xr1 = resultadoActual[i-1][4]
    fxr1 = resultadoActual[i-1][5]
    e1 = resultadoActual[i-1][6]
    e2 = resultadoActual[i-1][7]
    e3 = resultadoActual[i-1][8]*100
  }
  if (iteraccionActual<resultadoActual.length-1) {
    xl11 = resultadoActual[i+1][0]
    xu11 = resultadoActual[i+1][1]
    fxl11 = resultadoActual[i+1][2]
    fxu11 = resultadoActual[i+1][3]
    xr11 = resultadoActual[i+1][4]
    fxr11 = resultadoActual[i+1][5]
    e11 = resultadoActual[i+1][6]
    e12 = resultadoActual[i+1][7]
    e13 = resultadoActual[i+1][8]*100

  }
  xl = resultadoActual[i][0]
  xu = resultadoActual[i][1]
  fxl = resultadoActual[i][2]
  fxu = resultadoActual[i][3]
  xr = resultadoActual[i][4]
  fxr = resultadoActual[i][5]
  e = resultadoActual[i][6]
  ee2 = resultadoActual[i][7]
  ee3 = resultadoActual[i][8]*100


  document.getElementById('-1,xl').innerHTML = math.round(xl1,3)
  document.getElementById('-1,xu').innerHTML = math.round(xu1,3)
  document.getElementById('-1,fxl').innerHTML = math.round(fxl1,3)
  document.getElementById('-1,fxu').innerHTML = math.round(fxu1,3)
  document.getElementById('-1,xr').innerHTML = math.round(xr1,3)
  document.getElementById('-1,fxr').innerHTML = math.round(fxr1,3)
  document.getElementById('-1,e').innerHTML = math.round(e1,3)
  document.getElementById('-1,e2').innerHTML = math.round(e2,3)
  document.getElementById('-1,e3').innerHTML = math.round(e3,3)



  document.getElementById('1,xl').innerHTML = math.round(xl,3)
  document.getElementById('1,xu').innerHTML = math.round(xu,3)
  document.getElementById('1,fxl').innerHTML = math.round(fxl,3)
  document.getElementById('1,fxu').innerHTML = math.round(fxu,3)
  document.getElementById('1,xr').innerHTML = math.round(xr,3)
  document.getElementById('1,fxr').innerHTML = math.round(fxr,3)
  document.getElementById('1,e').innerHTML = math.round(e,3)
  document.getElementById('1,e2').innerHTML = math.round(ee2,3)
  document.getElementById('1,e3').innerHTML = math.round(ee3,3)


  document.getElementById('+1,xl').innerHTML = math.round(xl11,3)
  document.getElementById('+1,xu').innerHTML = math.round(xu11,3)
  document.getElementById('+1,fxl').innerHTML = math.round(fxl11,3)
  document.getElementById('+1,fxu').innerHTML = math.round(fxu11,3)
  document.getElementById('+1,xr').innerHTML = math.round(xr11,3)
  document.getElementById('+1,fxr').innerHTML = math.round(fxr11,3)
  document.getElementById('+1,e').innerHTML = math.round(e11,3)
  document.getElementById('+1,e2').innerHTML = math.round(e12,3)
  document.getElementById('+1,e3').innerHTML = math.round(e13,3)
  }
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
  let lambdita = x => {
    let sum = 0
    for(let j = 0, length2 = U.length; j < length2; j++){
      sum+=x**((U.length-1)-j)*U[j]
    }
    return sum
  }
  return lambdita
}
class OPtimizacionCuadratica {
  constructor(dFx) {
    this.nodoF = math.parse(dFx)
    this.fx = (x) => this.nodoF.evaluate({x: x})
  }
  cuadratica(x0,x1,x2,tol=0.000001,maxIter=300) {
    let f = this.fx
    let R = (Math.sqrt(5)-1)/2
    let x3 = -1
    let i = 0
    let error = 1
    let iteraciones = []
    while(error > tol && i < maxIter) {
      x3 = (f(x0)*(x1*x1-x2*x2)+f(x1)*(x2*x2-x0*x0)+f(x2)*(x0*x0-x1*x1))/(2*f(x0)*(x1-x2)+2*f(x1)*(x2-x0)+2*f(x2)*(x0-x1))
      iteraciones.push([x0,x1,x2,f(x0),f(x1),f(x2),x3,f(x3)])
      if (x3>x1) {
        if (f(x3)>f(x1)) {
          x0 = x1
          x1 = x3
        } else {
          x2 = x3
        }
      } else {
        if (f(x3)>f(x1)) {
          x2 = x1
          x1 = x3
        } else {
          x0 = x3
        }
      }
      let x31 = (f(x0)*(x1*x1-x2*x2)+f(x1)*(x2*x2-x0*x0)+f(x2)*(x0*x0-x1*x1))/(2*f(x0)*(x1-x2)+2*f(x1)*(x2-x0)+2*f(x2)*(x0-x1))
      error = Math.abs((x31-x3)/(x31))
      i++
      iteraciones[iteraciones.length-1].push(error)
    }
    actualizarSoluciones(iteraciones,this)
    return [x3,iteraciones]
  }
  graficar(i,n=50,zoom=true) {
    let x = []
    let y = []
    let j = 1*(zoom*i)
    let min = 9*10**10
    let max = 9*10**-10
    let dx = math.abs(resultadoActual[j][2]-resultadoActual[j][0])/n
    let x0 = resultadoActual[j][0]
    let x1 = resultadoActual[j][1]
    let x2 = resultadoActual[j][2]
    let f = this.fx

    let parabola = interpolar([x0,x1,x2],[f(x0),f(x1),f(x2)])
    let y_parabola = []
    for (var k = -10; k < n+10; k++) {
      x.push(resultadoActual[j][0]+k*dx)
      y.push(this.fx(resultadoActual[j][0]+k*dx))
      y_parabola.push(parabola(resultadoActual[j][0]+k*dx))
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
      name: 'x0'
    }
    let trace2 = {
      x: [resultadoActual[i][1],resultadoActual[i][1]],
      y: [min,max],
      mode: 'lines',
      name: 'x1'
    }
    let trace3 = {
      x: [resultadoActual[i][2],resultadoActual[i][2]],
      y: [min,max],
      mode: 'lines',
      name: 'x2',
    }
    let trace4 = {
      x: [resultadoActual[i][6],resultadoActual[i][6]],
      y: [min,max],
      mode: 'lines',
      name: 'x3',
      line: {
      dash: 'dashdot',
      }
    }
    let trace5 = {
      x: x,
      y: y_parabola,
      mode: 'lines',
      name: 'Parábola',
      line: {
      dash: 'dashdot',
      }
    }
    let layout = {
      title:'Iteracion ' + (parseInt(i)+1),
      xaxis: {
        title:'x'
      },
      yaxis: {
        title:'y'
      }
    }
    var config = {responsive: true}
    Plotly.newPlot('grafica', [trace,trace1,trace2,trace3,trace4,trace5],layout,config)
    this.graficar2(i,n,false)
  }
  graficar2(i,n=50,zoom=true) {
    let x = []
    let y = []
    let j = 1*(zoom*i)
    let min = 9*10**10
    let max = 9*10**-10

    let x0 = resultadoActual[i][0]
    let x1 = resultadoActual[i][1]
    let x2 = resultadoActual[i][2]
    let f = this.fx

    let parabola = interpolar([x0,x1,x2],[f(x0),f(x1),f(x2)])
    let y_parabola = []
    let dx = math.abs(resultadoActual[j][2]-resultadoActual[j][0])/n
    for (var k = -10; k < n+10; k++) {
      x.push(resultadoActual[j][0]+k*dx)
      y.push(this.fx(resultadoActual[j][0]+k*dx))
      y_parabola.push(parabola(resultadoActual[j][0]+k*dx))
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
    let t4x = []
    let t4y = []
    for (var k = 0; k <= i; k++) {
      t1x.push(resultadoActual[k][0])
      t1y.push(0)
      t2x.push(resultadoActual[k][1])
      t2y.push(0)
      t3x.push(resultadoActual[k][2])
      t3y.push(0)
      t3x.push(resultadoActual[k][6])
      t3y.push(f(resultadoActual[k][6]))
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
      name: 'x0'
    }
    let trace2 = {
      x: t2x,
      y: t2y,
      mode: 'markers',
      name: 'x1'
    }
    let trace3 = {
      x: t3x,
      y: t3y,
      mode: 'markers',
      name: 'x2',
    }
    let trace4 = {
      x: [resultadoActual[i][6],resultadoActual[i][6]],
      y: [min,max],
      mode: 'lines',
      name: 'x3',
      line: {
      dash: 'dashdot',
      }
    }
    let trace5 = {
      x: x,
      y: y_parabola,
      mode: 'lines',
      name: 'Parábola',
      line: {
      dash: 'dashdot',
      }
    }
    let layout = {
      title:'Iteraciones General ',
      xaxis: {
        title:'x'
      },
      yaxis: {
        title:'y'
      }
    }
    var config = {responsive: true}
    Plotly.newPlot('grafica2', [trace,trace1,trace2,trace3,trace4,trace5],layout,config)
  }
}
triggerBotones(false)