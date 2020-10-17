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
    let layout = {title: "Region de búsqueda unidimensional",xaxis: {
            title:'h'
          },
          yaxis: {
            title:'f(h)'
          }}

    Plotly.newPlot(divDireccion, data,layout,{responsive: true});
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
        title: 'Gradiente'
        };
    Plotly.newPlot(divGradiente,{data: data,layout: layout},{responsive: true});
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
    actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString())
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
    while (Math.abs(h) > tol && maggradPunto > tol && error > tol/10000) {
        if (i>0) {
            x0 = x0Prima
            y0 = y0Prima
        }
        i++

        let gradPunto = gradf(x0,y0)
        maggradPunto = Math.sqrt(gradPunto[0]**2+gradPunto[1]**2)
        let hmin = (ax-x0)/(gradPunto[0])
        hmin = Math.max(hmin,(ay-y0)/(gradPunto[1]))

        let hmax = (bx-x0)/(gradPunto[0])
        hmax = Math.min(hmax,(by-y0)/(gradPunto[1]))
        G = (h) => f(x(h,x0,y0),y(h,x0,y0))
        h = optimizacionLineal(G,hmin,hmax)
        ITERACIONES.push([h,x0,y0,fxprevio,hmin,hmax,error])
        x0Prima = x(h,x0,y0)
        y0Prima = y(h,x0,y0)
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
    G = (h) => f(x(h,x0,y0),y(h,x0,y0))
    graficarDireccion(G,hmin,hmax,n=100)
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
        z: [],
        type: 'scatter3d',
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
        trace2.z.push(2.5)
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
    document.getElementById('error').innerHTML = 'Error= ' + math.round(RESULTADOS[i+1][6]*100,4) + '%'
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
                actualizarFuncion(MathExpression.fromLatex(mathField.latex()).toString())
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
let x = (h,x0,y0) => {return x0+gradf(x0,y0)[0]*h}
let y = (h,x0,y0) => {return y0+gradf(x0,y0)[1]*h}
var G = undefined
triggerBotones(false)
