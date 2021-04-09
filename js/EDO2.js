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
var MQ = MathQuill.getInterface(2);

var mathFieldSpanDDU = document.getElementById("math-fieldDDU");
var mathFieldDDU = MQ.MathField(mathFieldSpanDDU, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function () {
            try {
                triggerBotones(false);
                // actualizarFuncion(
                //     MathExpression.fromLatex(mathFieldDDU.latex())
                //         .toString()
                //         .toLowerCase()
                // );
            } catch (e) {
                console.log(e);
            }
        },
    },
});

var mathFieldSpanDU = document.getElementById("math-fieldDU");
var mathFieldDU = MQ.MathField(mathFieldSpanDU, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function () {
            try {
                triggerBotones(false);
                // actualizarFuncion(
                //     MathExpression.fromLatex(mathFieldDU.latex())
                //         .toString()
                //         .toLowerCase()
                // );
            } catch (e) {
                console.log(e);
            }
        },
    },
});

var mathFieldSpanU = document.getElementById("math-fieldU");
var mathFieldU = MQ.MathField(mathFieldSpanU, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function () {
            try {
                triggerBotones(false);
                // actualizarFuncion(
                //     MathExpression.fromLatex(mathFieldU.latex())
                //         .toString()
                //         .toLowerCase()
                // );
            } catch (e) {
                console.log(e);
            }
        },
    },
});

var mathFieldSpand = document.getElementById("math-fieldd");
var mathFieldd = MQ.MathField(mathFieldSpand, {
    spaceBehavesLikeTab: true,
    handlers: {
        edit: function () {
            try {
                triggerBotones(false);
                // actualizarFuncion(
                //     MathExpression.fromLatex(mathFieldd.latex())
                //         .toString()
                //         .toLowerCase()
                // );
            } catch (e) {
                console.log(e);
            }
        },
    },
});

function resolver() {
    //mathFieldDDU
    //ddu, du, u, d, n, L
    let strddu = MathExpression.fromLatex(mathFieldDDU.latex())
        .toString()
        .toLowerCase();
    let ddu = parseFuncion(strddu);

    let strdu = MathExpression.fromLatex(mathFieldDU.latex())
        .toString()
        .toLowerCase();
    let du = parseFuncion(strdu);

    let stru = MathExpression.fromLatex(mathFieldU.latex())
        .toString()
        .toLowerCase();
    let u = parseFuncion(stru);

    let strd = MathExpression.fromLatex(mathFieldd.latex())
        .toString()
        .toLowerCase();
    let d = parseFuncion(strd);
    let n = parseFloat(document.getElementById("n").value);
    let L = parseFloat(document.getElementById("L").value);
    let naturalizq = document.getElementById("izq").checked;
    let naturalder = document.getElementById("der").checked;
    let valorizq = parseFloat(document.getElementById("valorizq").value);
    let valorder = parseFloat(document.getElementById("valorder").value);
    let m = n - !naturalizq - !naturalder;
    let cb = [
        { escencial: !naturalizq, valor: valorizq, x: 0, i: 0 },
        { escencial: !naturalder, valor: valorder, x: L, i: m - 1 },
    ];
    actual = new DiferenciasFinitas(ddu, du, u, d, n, L, cb);
}

function parseFuncion(str) {
    try {
        let fx = (x, y) => {
            return math.evaluate(str, { x: x, y: y });
        };
        return fx;
    } catch (e) {
        console.log(e);
    }
}

function updateizq() {
    let nautral = document.getElementById("izq").checked;
    document.getElementById("spanizq").innerHTML = nautral
        ? "$$\\frac{dU}{dx}=$$"
        : "$$U=$$";
    MathJax.typeset();
}
function updateder() {
    let nautral = document.getElementById("der").checked;
    document.getElementById("spander").innerHTML = nautral
        ? "$$\\frac{dU}{dx}=$$"
        : "$$U=$$";
    MathJax.typeset();
}

class DiferenciasFinitas {
    constructor(ddu, du, u, d, n, L, cb) {
        this.ddu = ddu;
        this.du = du;
        this.u = u;
        this.d = d;
        this.n = n;
        this.L = L;
        this.cb = cb;
        this.x = [];
        this.y = [];
        this.h = this.L / (this.n - 1);
        this.resolver();
        this.actualizar();
    }
    resolver() {
        this.m = this.n - this.cb[0].escencial - this.cb[1].escencial;
        this.K = [...Array(this.m)].map((e) => Array(this.m).fill(0));
        this.F = [...Array(this.m)].map((e) => Array(1).fill(0));
        this.offset = this.h;

        if (!this.cb[0].escencial) {
            this.offset = 0;
        }
        for (let i = 0; i < this.m; i++) {
            let x = this.offset + this.h * i;
            let l1 = this.ddu(x) / this.h / this.h;
            let l2 = this.du(x) / 2 / this.h;
            let l3 = this.u(x);
            let l4 = this.d(x);

            this.K[i][i] = l3 - 2 * l1;
            if (!i == 0) {
                this.K[i][i - 1] = l1 - l2;
            }
            if (i < this.m - 1) {
                this.K[i][i + 1] = l1 + l2;
            }
            this.F[i][0] = -l4;
        }
        let cb = this.cb[0];
        let l1 = this.ddu(cb.x) / this.h / this.h;
        let l2 = this.du(cb.x) / 2 / this.h;
        if (cb.escencial) {
            this.F[cb.i][0] -= cb.valor * (l1 - l2);
        } else {
            this.K[cb.i][cb.i + 1] = 2 * l1;
            this.F[cb.i][0] += 2 * this.h * cb.valor * (l1 - l2);
        }

        cb = this.cb[1];
        l1 = this.ddu(cb.x) / this.h / this.h;
        l2 = this.du(cb.x) / 2 / this.h;
        if (cb.escencial) {
            this.F[cb.i][0] -= cb.valor * (l1 + l2);
        } else {
            this.K[cb.i][cb.i - 1] = 2 * l1;
            this.F[cb.i][0] -= 2 * this.h * cb.valor * (l1 + l2);
        }
        this.U = math.lusolve(this.K, this.F);
        if (this.cb[0].escencial) {
            this.x.push(this.cb[0].x);
            this.y.push(this.cb[0].valor);
        }
        for (let i = 0; i < this.m; i++) {
            this.x.push(this.offset + this.h * i);
            this.y.push(this.U[i][0]);
        }
        if (this.cb[1].escencial) {
            this.x.push(this.cb[1].x);
            this.y.push(this.cb[1].valor);
        }
    }
    actualizar() {
        this.actualizarGrafica();
        this.actualizarSistemaEcuaciones();
    }
    actualizarSistemaEcuaciones() {
        let K = this.K;
        let V = this.F;
        let U = this.U;
        let tabla = "\\scriptsize\\begin{pmatrix}";
        for (var i = 0; i < K.length; i++) {
            for (var j = 0; j < K.length; j++) {
                let sep = "&";
                if (j == K.length - 1) {
                    sep = "";
                }
                tabla += math.round(K[i][j], 3) + sep;
            }
            tabla += "\\\\";
        }
        tabla += "\\end{pmatrix}";
        tabla += "\\cdot\\begin{pmatrix}";
        for (var i = 0; i < K.length; i++) {
            tabla += "a_{" + i + "}\\\\";
        }
        tabla += "\\end{pmatrix}=";
        tabla += "\\begin{pmatrix}";
        for (var i = 0; i < K.length; i++) {
            tabla += math.round(V[i], 3) + "\\\\";
        }
        tabla += "\\end{pmatrix}\\rightarrow";
        tabla += "\\begin{pmatrix}";
        for (var i = 0; i < K.length; i++) {
            tabla += math.round(U[i], 3) + "\\\\";
        }
        tabla += "\\end{pmatrix}";
        document.getElementById("SistemaEcuaciones").innerHTML =
            "$$" + tabla + "$$";
        MathJax.typeset();
    }
    actualizarGrafica() {
        let traces = [];

        let trace = {
            x: this.x,
            y: this.y,
            mode: "lines+markers",
            name: "Diferencias Finitas",
        };
        traces.push(trace);

        let layout = {
            plot_bgcolor: "rgba(0,0,0,0)",
            paper_bgcolor: "rgba(0,0,0,0)",
            title: "EDO Orden 2",
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
    mathField.cmd(str);
    mathField.focus();
}
document.body.onload = function () {
    resolver();
    triggerBotones(false);
    var queryString = window.location.search;
    // if (queryString != "") {
    //     queryString = queryString.split("?")[1];
    //     let parametros = new URLSearchParams(queryString);
    //     funcion_param = parametros.get("fx");
    //     console.log(funcion_param);
    //     try {
    //         document.getElementById("xi").value = parseFloat(
    //             parametros.get("xi")
    //         );
    //         document.getElementById("yi").value = parseFloat(
    //             parametros.get("yi")
    //         );
    //         document.getElementById("h").value = parseFloat(
    //             parametros.get("h")
    //         );
    //         mathField.focus();
    //         mathField.keystroke("End Shift-Home Del");
    //         // input(funcion_param)
    //         mathField.write(funcion_param);
    //         mathField.focus();
    //         triggerBotones(true);
    //     } catch (e) {
    //         console.log(queryString, e);
    //     }
    // }
};
function triggerBotones(param) {
    document
        .querySelectorAll("#iteraciones")
        .forEach((x) => (x.disabled = !param));
}
