/* Modelación y Análisis Numérico
 * Este archivo hace parte de un proyecto para el aprendizaje interactivo de metodos numéricos.
 * En este archivo se encuentra el nucleo de calculo de los metodos de runge kutta
 *
 *
 * Este archivo requiere la libreria math.js
 *
 *
 *
 * David Arturo Rodriguez Herrera - da.rodriguezh@uniandes.edu.co
 */

var actual = undefined;
var ECUACIONES = []
var YI = []
ECUACIONES.push('-0.5y_1')
ECUACIONES.push('4-0.3y_2-0.1y_1')
YI.push(4)
YI.push(6)
var ECUACION_ACTUAL = 0
var mathFields = []
var mathFieldSpans = []
var MQ = MathQuill.getInterface(2);

for (var i = 0; i < ECUACIONES.length; i++) {
	mathFieldSpans.push(document.getElementsByName('z'+(i+1))[0])
	let mathField = MQ.MathField(mathFieldSpans[mathFieldSpans.length-1], {
	    spaceBehavesLikeTab: true,
	    handlers: {
	        edit: function() {
	            try{
					triggerBotones(false)
	            	actualizarFunciones()
	            }
	            catch(e){}
	        }
	    }
	})
	mathFields.push(mathField)
}
function ecuacionActual(i) {
	ECUACION_ACTUAL = i-1
}
function updateFuncion(i) {
	ECUACIONES[i] = MathExpression.fromLatex(mathFields[i].latex()).toString().toLowerCase()
	YI[i] = parseFloat(document.getElementById('y0_'+(i+1)).value)
}
function crearTabla() {
	let TABLA = document.getElementById('ecuaciones')
	TABLA.innerHTML = ''
	let PLANTILLA = (i)=> '<tr><td>\\(\\frac{dy_'+i+'}{dx}=\\)</td><td colspan="2" id="ecuacion'+i+'"></td><td style="text-align: right; width: 30%">\\(y_0= \\)<input oninput="triggerBotones(false)" style="width: 60%;" id="y0_'+(i)+'" type="text" value="'+YI[i-1]+'"><label style="padding: 5px" onclick="borrarEcuacion('+i+')">&times;</label></td></tr>'
	let ULTIMA_FILA = '<tr><td colspan="4" class="casillaCentrada"><label onclick="agregarEcuacion()" style="color: gray;"><i class="fas fa-plus-circle fa-2x"></i></label></td></tr>'
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
function borrarEcuacion(i) {
	ECUACIONES.splice(i-1, 1)
	YI.splice(i-1, 1)
	crearTabla()
}

function agregarEcuacion() {
	YI.push('0')
	ECUACIONES.push('1')
	crearTabla()
}
// var mathFieldSpan = document.getElementById("math-field");
// var MQ = MathQuill.getInterface(2);
// var mathField = MQ.MathField(mathFieldSpan, {
//     spaceBehavesLikeTab: true,
//     handlers: {
//         edit: function () {
//             try {
//                 triggerBotones(false);
//                 actualizarFuncion(
//                     MathExpression.fromLatex(mathField.latex())
//                         .toString()
//                         .toLowerCase()
//                 );
//             } catch (e) {
//                 console.log(e);
//             }
//         },
//     },
// });

function resolver() {
    triggerBotones(true);
	actualizarFunciones()
    actualizarFuncion();
}
function actualizarTabla() {
    actual.actualizar();
}
var NUMERO_FUNCIONES = 2;
var ACTUAL_METODO = 0;
function actualizarFuncion() {
	NUMERO_FUNCIONES = ECUACIONES.length
	let fx = [];
	for (let i = 0; i < NUMERO_FUNCIONES; i++) {
		fx.push(parseFuncion(ECUACIONES[i]))
	}
    let xi = parseFloat(document.getElementById("xi").value);
    // let yi = parseFloat(document.getElementById("yi").value);
    let h = parseFloat(document.getElementById("h").value);
    actual = new RungeKutta(fx, xi, YI, h);
}
function parseFuncion(str) {
    try {
        let fx = (x, Y) => {
            // {x: x, y: y}
            let str2 = '{"x":' + x;
            for (let i = 0; i < NUMERO_FUNCIONES; i++) {
                str2 += ',"y_' + (i + 1) + '":' + Y[i];
            }
            str2 += "}";
            obj = JSON.parse(str2);
            return math.evaluate(str, obj);
        };
        return fx;
    } catch (e) {
        console.log(e);
    }
}

function masPuntos() {
    actual.iteracionSiguiente();
}
function menosPuntos() {
    actual.iteracionAnterior();
}

class RungeKutta {
    constructor(fx, xi, yi, h) {
        this.fx = fx;
        this.n = NUMERO_FUNCIONES;
        this.xi = xi;
        this.yi = yi;
        this.h = h;
        this.x = [[xi, xi, xi, xi, xi, xi]];
        this.y = [[yi, yi, yi, yi, yi, yi]];
        this.iteracionSiguiente();
    }
    K(x, Y) {
        let Kr = new Array(this.n);
        for (let i = 0; i < Kr.length; i++) {
            Kr[i] = this.fx[i](x, Y);
        }
        return Kr;
    }
    iteracionSiguiente() {
        let x = this.x[this.x.length - 1];
        let y = this.y[this.x.length - 1];
        let h = this.h;
        let xlinea = [];
        let ylinea = [];
        //Euler
        xlinea.push(x[0] + h);
        let yy = [];
        let kr = this.K(x[0], y[0]);
        for (let i = 0; i < kr.length; i++) {
            yy.push(y[0][i] + h * kr[i]);
        }
        ylinea.push(yy);

        //Heun
        xlinea.push(x[1] + h);
        yy = [];
        let k1 = this.K(x[1], y[1]);
        let k2 = this.K(x[1] + h, math.add(y[1], math.multiply(k1, h)));
        for (let i = 0; i < kr.length; i++) {
            yy.push(y[1][i] + h * ((1 / 2) * k1[i] + (1 / 2) * k2[i]));
        }
        ylinea.push(yy);

        //PuntoMedio
        xlinea.push(x[2] + h);
        let fmedios = this.K(
            x[2] + h / 2,
            math.add(y[2], math.multiply(this.K(x[2], y[2]), h / 2))
        );
        ylinea.push(math.add(y[2], math.multiply(fmedios, h)));

        //Ralston
        xlinea.push(x[3] + h);
        let fralston = math.add(
            math.multiply(this.K(x[3], y[3]), 1 / 3),
            math.multiply(
                this.K(
                    x[3] + (3 / 4) * h,
                    math.add(
                        y[3],
                        math.multiply(this.K(x[3], y[3]), (h * 3) / 4)
                    )
                ),
                2 / 3
            )
        );
        ylinea.push(math.add(y[3], math.multiply(fralston, h)));

        //3Orden
        xlinea.push(x[4] + h);
        k1 = this.K(x[4], y[4]);
        k2 = this.K(
            x[4] + (1 / 2) * h,
            math.add(y[4], math.multiply(k1, (h * 1) / 2))
        );
        let k3 = this.K(
            x[4] + h,
            math.add(
                math.add(y[4], math.multiply(k1, -h)),
                math.multiply(k2, 2 * h)
            )
        );
        let f3ord = math.multiply(
            math.add(math.add(k1, math.multiply(k2, 4)), k3),
            1 / 6
        );
        ylinea.push(math.add(y[4], math.multiply(f3ord, h)));

        //4Orden
        xlinea.push(x[5] + h);
        k1 = this.K(x[5], y[5]);
        k2 = this.K(
            x[5] + (1 / 2) * h,
            math.add(y[5], math.multiply(k1, (h * 1) / 2))
        );
        k3 = this.K(
            x[5] + (1 / 2) * h,
            math.add(y[5], math.multiply(k2, h * 0.5))
        );
        let k4 = this.K(x[5] + h, math.add(y[5], math.multiply(k3, h)));
        let f4ord = math.multiply(
            math.add(k1, math.multiply(k2, 2), math.multiply(k3, 2), k4),
            1 / 6
        );
        ylinea.push(math.add(y[5], math.multiply(f4ord, h)));

        this.x.push(xlinea);
        this.y.push(ylinea);
        this.actualizar();
    }
    iteracionAnterior() {
        if (this.x.length > 2) {
            this.x.pop();
            this.y.pop();
            this.actualizar();
        }
    }
    actualizar() {
        this.actualizarGrafica();
        this.actualizarTabla();
    }
    actualizarTabla() {
        let metodo = document.getElementById("metodo").value;
		ACTUAL_METODO = parseInt(metodo)
        let str = "";
        str += `<thead>
			<tr style="text-align: center;">
				<th><span>\\(x\\)</span></th>
				`;
        for (let i = 0; i < NUMERO_FUNCIONES; i++) {
            str += "<th><span>\\(y_" + (i + 1) + "\\)</span></th>";
        }
        str += `</tr>
				</thead>
				<tbody>`;
        for (var i = 0; i < this.x.length; i++) {
            let fila = "<tr><td>";
            fila += math.round(this.x[i][ACTUAL_METODO], 3);
            fila += "</td>";
            for (let j = 0; j < NUMERO_FUNCIONES; j++) {
                fila += "<td>"
                fila += math.round(this.y[i][ACTUAL_METODO][j], 3);
                fila += "</td>"
            }
            fila += "</tr>";
			str+=fila
        }
        str += "</tbody>";
        document.getElementById("tabla").innerHTML = str;
        MathJax.typeset();
    }
    actualizarGrafica() {
        let nombres = [];
        let traces = [];
        for (var i = 0; i < NUMERO_FUNCIONES; i++) {
            nombres.push("Y_" + (i + 1));
            let x = [];
            let fxs = [];
            for (let j = 0; j < this.x.length; j++) {
                x.push(this.x[j][ACTUAL_METODO]);
                fxs.push(this.y[j][ACTUAL_METODO][i]);
            }
            let trace = {
                x: x,
                y: fxs,
                mode: "lines",
                name: nombres[i],
            };
            traces.push(trace);
        }

        let layout = {
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            title: "Métodos de Runge Kutta",
            xaxis: {
                title: "x",
                tickformat: ".3f",
                gridcolor: "rgb(198,194,191)",
            },
            yaxis: {
                title: "y",
                tickformat: ".3f",
                gridcolor: "rgb(198,194,191)",
            },
        };
        var config = { responsive: true };
        Plotly.newPlot("grafica", traces, layout, config);
    }
}

$("#cositasLindas").toolbar({
    content: "#toolbar-options",
    animation: "grow",
});
function input(str) {
	mathFields[ECUACION_ACTUAL].cmd(str)
	mathFields[ECUACION_ACTUAL].focus()
}
document.body.onload = function () {
	crearTabla()
    resolver();
    triggerBotones(false);
    var queryString = window.location.search;
    if (queryString != "") {
        queryString = queryString.split("?")[1];
        let parametros = new URLSearchParams(queryString);
        funcion_param = parametros.get("fx");
        console.log(funcion_param);
        try {
            document.getElementById("xi").value = parseFloat(
                parametros.get("xi")
            );
            document.getElementById("yi").value = parseFloat(
                parametros.get("yi")
            );
            document.getElementById("h").value = parseFloat(
                parametros.get("h")
            );
            mathField.focus();
            mathField.keystroke("End Shift-Home Del");
            // input(funcion_param)
            mathField.write(funcion_param);
            mathField.focus();
            triggerBotones(true);
        } catch (e) {
            console.log(queryString, e);
        }
    }
};
function triggerBotones(param) {
    document
        .querySelectorAll("#iteraciones")
        .forEach((x) => (x.disabled = !param));
}
