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
            z[i][j] = f(x[j],y[i]);
        }
    }
    var data = [{
        z: z,
        x: x,
        y: y,
        type: 'contour'}];
    let layout = {title: "Función",xaxis: {
            title:'x'
          },
          yaxis: {
            title:'y'
          }}
    Plotly.newPlot(divGeneral, data,layout,{responsive: true});
}
function graficarDireccion(f,a,b,n=100,TITULO='x') {
    let x = new Array(n)
    let y = new Array(n)

    let h = (b-a)/n

    for (var i = 0; i < n; i++) {
        x[i] = a + i*h
        y[i] = f(a + i*h)
    }
    let trace4 = {
          x: [RESULTADOS[iteraccionActual+1][0],RESULTADOS[iteraccionActual+1][0]],
          y: [math.min(y),math.max(y)],
          mode: 'lines',
          name: 'Óptimo',
          line: {
          dash: 'dashdot',
          }
        }
    var data = [{
        x: x,
        y: y,
        type: 'lines'},trace4];
    let layout = {title: "Region de búsqueda unidimensional",xaxis: {
            title:TITULO
          },
          yaxis: {
            title:'f('+TITULO+')'
          }}

    Plotly.newPlot(divDireccion, data,layout,{responsive: true});
}
function graficarGradiente(f,ax,bx,ay,by,n=300) {
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
    let u = []
    for(let i = 0; i < n; i++) {
        let linea = []
        for(let j = 0; j < n; j++) {
            let mgrad = f(x[j],y[i])
            z[i][j] = (mgrad[0]**2+mgrad[1]**2)**0.5;
            linea.push('Grad_x: '+ math.round(mgrad[0],3) + ' Grad_y: '+math.round(mgrad[1],3))
        }
        u.push(linea)
    }
    var data = [{
        z: z,
        x: x,
        y: y,
        text: u,
        type: 'contour'}];
    let layout = {title: "Gradiente",xaxis: {
            title:'x'
          },
          yaxis: {
            title:'y'
          }}
    Plotly.newPlot(divGradiente, data,layout,{responsive: true});
}

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
    iteraccionActual = 0
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString().toLowerCase())
    actualizarRangos()
    actualizarLatex()

    graficarContornos2D(f,ax,bx,ay,by,n=40)
    graficarGradiente(gradf,ax,bx,ay,by,n=30)
    RESULTADOS = optimizar(f,ax,bx,ay,by)
    actualizar(iteraccionActual)
    triggerBotones(true)
}
function actualizarRangos() {
    ax = parseFloat(document.getElementById('x0').value)
    bx = parseFloat(document.getElementById('xf').value)
    ay = parseFloat(document.getElementById('y0').value)
    by = parseFloat(document.getElementById('yf').value)
    triggerBotones(false)
}
function actualizarLatex() {
    let str1 = fnode.toTex()
    let str2 = gradfnodex.toTex()

    document.getElementById('pretty1').innerHTML = '$$\\small \\nabla f=\\{'+str2+','+gradfnodey.toTex()+'\\}$$'
    MathJax.typeset()
}
function optimizacionLineal(f,a,b,tol=0.000000000001) {
    let R = (Math.sqrt(5)-1)/2
    let xl = a
    let xu = b
    let xr = -1
    let i = 0
    let error = 1
    let iteraciones = []
    while(error > tol) {
        let d = R*(xu-xl)
        let x1 = xl + d
        let x2 = xu - d
        let fx1 = f(x1)
        let fx2 = f(x2)
        maximizando = document.getElementById('maximizarRadio').checked
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
        error = 0.3819*Math.abs((xu-xl)/(xr))
    }
    return xr
}

function optimizar(f,ax,bx,ay,by) {
    ITERACIONES = []
    let x0 = parseFloat(document.getElementById('x_0').value)
    let y0 = parseFloat(document.getElementById('y_0').value)
    let h = 1
    let maggradPunto = 1
    let tol = 1*10**-6
    let fxprevio = f(x0,y0)
    let error =1
    i=0
    ITERACIONES.push([h,x0,y0,fxprevio,ax,bx,error])
    while (error > tol/10000) {
        if (i>0) {
            x0 = x0Prima
            y0 = y0Prima
        }
        i++

        G = (h) => f(h,y0)
        x0Prima = optimizacionLineal(G,ax,bx)
        ITERACIONES.push([x0Prima,x0Prima,y0,fxprevio,ax,bx,error])
        G = (h) => f(x0Prima,h)
        y0Prima = optimizacionLineal(G,ay,by)
        ITERACIONES.push([y0Prima,x0Prima,y0Prima,fxprevio,ay,by,error])

        let fx = f(x0Prima,y0Prima)

        error = Math.abs((fx-fxprevio)/fx)

        fxprevio = fx
        //console.log(x0,y0,error)
    }
    return ITERACIONES
}
function darFuncionTransformacion(RESULTADOI) {
    let x0 = RESULTADOI[1]
    let y0 = RESULTADOI[2]
    return (h) => f(x(h,x0,y0),y(h,x0,y0))
}
function actualizar(i) {
    [h,x0,y0,fx,hmin,hmax,error] = RESULTADOS[i]
    t='y'
    if (i%2) {
        G = (h) => f(x0,h)
    } else {
        G = (h) => f(h,y0)
        t='x'
    }
    graficarDireccion(G,hmin,hmax,n=100,TITULO=t)
    trace = {
        x: [],
        y: [],
        text: [],
        name: 'Rutas'
    }
    traceInicial = {
        x: [x0],
        y: [y0],
        text: [f(x0,y0)],
        marker:{size: 10},
        name: 'Punto Incial (x0,y0)'
    }
    trace2 = {
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines+markers',
        marker:{symbol: 203,size: 5}
    }
    let layout = {
        title: "Iteración " + (i+1),
        xaxis: {
            title:'x'
        },
        yaxis: {
            title:'y'
        }
    }
    for (var j = 0; j <= i+1; j++) {
        [h,x0,y0,fx,hmin,hmax,error] = RESULTADOS[j]
        trace.x.push(x0)
        trace.y.push(y0)
        trace.text.push('Z = '+math.round(f(x0,y0),2))

        trace2.x.push(x0)
        trace2.y.push(y0)
    }
    try {
        Plotly.deleteTraces(graficaGeneral, [1,2])
        Plotly.deleteTraces(graficaGradiente, 1)

    }
    catch {
        console.log('alv')
    }
    Plotly.plot(graficaGeneral, [trace,traceInicial],layout)
    Plotly.plot(graficaGradiente, [trace2])
    document.getElementById('niter').innerHTML = 'Óptimo: '+[math.round(RESULTADOS[i][1],2),math.round(RESULTADOS[i][2],2)]
    let gradientePunto = gradf(RESULTADOS[i][1],RESULTADOS[i][2])
    let magGrad = math.round((gradientePunto[0]**2+gradientePunto[1]**2)**0.5,3)
    document.getElementById('error').innerHTML = '|∇|='+magGrad + '<br>ε=' + math.round(RESULTADOS[i+1][6]*100,3) + '%'
}

function siguienteIteracion() {
    iteraccionActual = iteraccionActual + 1*(iteraccionActual<RESULTADOS.length-2)
    actualizar(iteraccionActual)
}
function anteriorIteracion() {
    iteraccionActual = iteraccionActual - 1*(iteraccionActual>0)
    actualizar(iteraccionActual)
}
function triggerBotones(param) {
    document.querySelectorAll('#iteraciones').forEach(x => x.disabled = !param)
}

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
$('#cositasLindas').toolbar({
  content: '#toolbar-options',
  animation: 'grow'
  });
function input(str) {
  mathField.cmd(str)
  mathField.focus()
}

var f = undefined
var fnode = undefined
var gradf = undefined
var gradfnodex = undefined
var gradfnodey = undefined

iteraccionActual = 0
RESULTADOS = []

let divDireccion = 'graficaDireccion'
let divGeneral = 'graficaGeneral'
let divGradiente = 'graficaGradiente'

let ax = parseFloat(document.getElementById('x0').value)
let bx = parseFloat(document.getElementById('xf').value)
let ay = parseFloat(document.getElementById('y0').value)
let by = parseFloat(document.getElementById('yf').value)

let a = Math.min(ax,ay)
let b = Math.max(bx,by)
let x = (h,x0,y0) => {return h}
let y = (h,x0,y0) => {return h}
var G = undefined
triggerBotones(false)
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
      document.getElementById('x0').value = parseFloat(parametros.get('xa'))
      document.getElementById('xf').value = parseFloat(parametros.get('xb'))
      document.getElementById('y0').value = parseFloat(parametros.get('ya'))
      document.getElementById('yf').value = parseFloat(parametros.get('yb'))

      document.getElementById('x_0').value = parseFloat(parametros.get('x0'))
      document.getElementById('y_0').value = parseFloat(parametros.get('y0'))
      mathField.focus();
      mathField.keystroke('End Shift-Home Del');
      // input(funcion_param)
      mathField.write(funcion_param)
      mathField.focus()

      calcular()

    } catch (e) {
      console.log(queryString,e)
    }
  }
}