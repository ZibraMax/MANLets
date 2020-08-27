function graficarContornos2D(f,ax,bx,ay,by,n=100) {
  let x = new Array(n)
  let y = new Array(n) 
  let z = new Array(n)

  let hx = (bx-ax)/n
  let hy = (by-ay)/n

  for(let i = 0; i < n; i++) {
    x[i] = ax + hx*i
    y[i] = ay + hy*i
    z[i] = new Array(n);
  }
  for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        z[i][j] = f(x[i],y[j]);
    }
  }
  var data = [{
      z: z,
      x: x,
      y: y,
      type: 'contour'}];
  let layout = {margin: {l: 0,r: 0,b: 0,t: 0},title: 'Funcion y contornos'}
  Plotly.newPlot(divGeneral, data,layout);
}

function graficarDireccion(f,a,b,n=100) {
  let x = new Array(n)
  let y = new Array(n)

  let h = (b-a)/n

  for (var i = 0; i < n; i++) {
    x[i] = a + i*h
    y[i] = f(a + i*h)
  }
  var data = [{
      x: x,
      y: y,
      type: 'lines'}];
  var layout = {
    title: "Region de búsqueda unidimensional"
  }


  Plotly.newPlot(divDireccion, data);
}

function graficarGradiente(f,ax,bx,ay,by,n=30) {
  let hx = (bx-ax)/n
  let hy = (by-ay)/n

  let X = []
  let Y = []
  let Z = []

  let U = []
  let V = []
  let W = []

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      X.push(ax + hx*i)
      Y.push(ay + hy*j)
      Z.push(2.5)
      let dxdy = f(X[X.length-1],Y[Y.length-1])
      U.push(dxdy[0])
      V.push(dxdy[1])
      W.push(0)
    }
  }
  trace1 = {
    type: 'cone', 
    u: U,
    v: V,
    w: W,
    x: X,
    y: Y,
    z: Z,
    anchor: 'tail', 
    sizeref: 3,
    colorbar: {
      len: 0.75, 
      ticklen: 4, 
      thickness: 20
    }, 
    sizemode: 'scaled', 
    showscale: true, 
    colorscale: [['0.0', 'rgb(20, 29, 67)'], ['0.05', 'rgb(25, 52, 80)'], ['0.1', 'rgb(28, 76, 96)'], ['0.15', 'rgb(23, 100, 110)'], ['0.2', 'rgb(16, 125, 121)'], ['0.25', 'rgb(44, 148, 127)'], ['0.3', 'rgb(92, 166, 133)'], ['0.35', 'rgb(140, 184, 150)'], ['0.4', 'rgb(182, 202, 175)'], ['0.45', 'rgb(220, 223, 208)'], ['0.5', 'rgb(253, 245, 243)'], ['0.55', 'rgb(240, 215, 203)'], ['0.6', 'rgb(230, 183, 162)'], ['0.65', 'rgb(221, 150, 127)'], ['0.7', 'rgb(211, 118, 105)'], ['0.75', 'rgb(194, 88, 96)'], ['0.8', 'rgb(174, 63, 95)'], ['0.85', 'rgb(147, 41, 96)'], ['0.9', 'rgb(116, 25, 93)'], ['0.95', 'rgb(82, 18, 77)'], ['1.0', 'rgb(51, 13, 53)']]
  };
  data = [trace1];
  layout = {
    scene: {
      aspectratio: {
        x: 1, 
        y: 1, 
        z: 0.9
      }
    },
    margin: {l: 0,r: 0,b: 0,t: 0},
    title: 'Gradiente'
    };
  Plotly.newPlot(divGradiente,{data: data,layout: layout});
}
var f = undefined
var fnode = undefined
var gradf = undefined
var gradfnodex = undefined
var gradfnodey = undefined

function actualizarFuncion(str) {
  fnode = math.parse(str)
  f = (x,y) => fnode.evaluate({x:x,y:y})
  gradf = grad(fnode)
}

function grad(f) {
  gradfnodex = math.derivative(f,'x')
  gradfnodey = math.derivative(f,'y')
  return (x,y) => [gradfnodex.evaluate({x:x,y:y}),gradfnodey.evaluate({x:x,y:y})]
}

function calcular() {
  actualizarFuncion(document.getElementById('funcion').value)
  actualizarRangos()
  actualizarLatex()
  graficarContornos2D(f,ax,bx,ay,by,n=100)
  graficarGradiente(gradf,ax,bx,ay,by,n=30)

  console.log(optimizar(f,ax,bx,ay,by))
  graficarDireccion(G,a,b,n=100)
}

function actualizarRangos() {
  ax = parseFloat(document.getElementById('x0').value)
  bx = parseFloat(document.getElementById('xf').value)
  ay = parseFloat(document.getElementById('y0').value)
  by = parseFloat(document.getElementById('yf').value)

}

function actualizarLatex() {
  let str1 = fnode.toTex()
  let str2 = gradfnodex.toTex()

  document.getElementById('pretty1').innerHTML = '$$\\small f(x,y)='+str1 +';\\Delta(f)=\\{'+str2+','+gradfnodey.toTex()+'\\}$$'
  MathJax.typeset()
}

let divDireccion = 'graficaDireccion'
let divGeneral = 'graficaGeneral'
let divGradiente = 'graficaGradiente'

let ax = parseFloat(document.getElementById('x0').value)
let bx = parseFloat(document.getElementById('xf').value)
let ay = parseFloat(document.getElementById('y0').value)
let by = parseFloat(document.getElementById('yf').value)

let a = Math.min(ax,ay)
let b = Math.max(bx,by)


function optimizacionLineal(f,a,b,tau=0.000001) {
  let phi = (1 + Math.sqrt(5)) / 2
  let resphi = 2 - phi
  let c = a + (b-a) * resphi
  let d = b - (b-a) * resphi
  let fc = f(c)
  let fd = f(d)

  while (Math.abs(b - a) > tau * (Math.abs(c) + Math.abs(d))){
    if (fc > fd) {
      b = d
      d = c
      c = a + (b-a) * resphi
      fd = fc
      fc = f(c)
    } else {
      a = c
      c = d
      d = b - (b-a) * resphi
      fc = fd
      fd = f(d)
    }
  }
  return (a + b) / 2
}

let x = (h,x0,y0) => {
  return x0+gradf(x0,y0)[0]*h
}

let y = (h,x0,y0) => {
  return y0+gradf(x0,y0)[1]*h
}
var G = undefined
function optimizar(f,ax,bx,ay,by) {
  let x0 = ax + Math.random()*(bx-ax)
  let y0 = ay + Math.random()*(by-ay)
  let h = 1
  let maggradPunto = 1
  let tol = 1*10**-6
  let fxprevio = 1
  let error =1
  while (Math.abs(h) > tol && maggradPunto > tol && error > tol/10000) {
    let gradPunto = gradf(x0,y0)
    maggradPunto = Math.sqrt(gradPunto[0]**2+gradPunto[1]**2)
    let hmin = (ax-x0)/(gradPunto[0])
    hmin = Math.max(hmin,(ay-y0)/(gradPunto[1]))

    let hmax = (bx-x0)/(gradPunto[0])
    hmax = Math.min(hmax,(by-y0)/(gradPunto[1]))
    G = (h) => f(x(h,x0,y0),y(h,x0,y0))
    h = optimizacionLineal(G,hmin,hmax)
    x0 = x(h,x0,y0)
    y0 = y(h,x0,y0)
    a = hmin
    b = hmax
    let fx = f(x0,y0)
    error = Math.abs((fx-fxprevio)/fx)
    fxprevio = fx
    console.log(x0,y0,error)
  }
  return [h,x0,y0]
}