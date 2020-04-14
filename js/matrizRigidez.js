var canvas = document.getElementById('canvas_estructura')
var ctx = canvas.getContext('2d')
elementos = []
K = []
F = []
W = canvas.width
H = canvas.height
margen = 80

h = 5
l = 4.2

coordenadaMaxima = Math.max(h,l)


function definirElementos() {
	bv = parseFloat(document.getElementById('bviga').value)
	hv = parseFloat(document.getElementById('hviga').value)

	bc = parseFloat(document.getElementById('bcol').value)
	hc = parseFloat(document.getElementById('hcol').value)

	AV = bv*hv
	IV = bv*hv**3/12

	AC = bc*hc
	IC = bc*hc**3/12

	E = 20000000
	mu = 0

	c = Math.cos(0)
    s = Math.sin(0)

    alfa = 12
    beta = 4
    gamma = 6
    A = AV
    I = IV
    L = l

    k1 = (E * A / L) * (c ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * s ** 2
    k2 = E * A / (L) * (s ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * (c ** 2)
    k3 = (beta + mu) * E * I / ((1 + mu) * L)
    k4 = (E * A / L - alfa * E * I / ((1 + mu) * L ** 3)) * s * c
    k5 = gamma * E * I / ((1 + mu) * L ** 2) * c
    k6 = gamma * E * I / ((1 + mu) * L ** 2) * s
    k7 = (beta / 2 - mu) * E * I / ((1 + mu) * L)
    fi = 1
    fidiag = 1
    Ke = [[k1, k4, -k6 * fi, -k1, -k4, -k6 * fidiag], [k4, k2, k5 * fi, -k4, -k2, k5 * fidiag],
                        [-k6 * fi, k5 * fi, k3 * fi, k6 * fi, -k5 * fi, fi * k7 * fidiag],
                        [-k1, -k4, k6 * fi, k1, k4, k6 * fidiag], [-k4, -k2, -k5 * fi, k4, k2, -k5 * fidiag],
                        [-k6 * fidiag, k5 * fidiag, fidiag * k7 * fi, k6 * fidiag, -k5 * fidiag, k3 * fidiag]]
	KEV = [...Ke]

	c = Math.cos(Math.PI/2)
    s = Math.sin(Math.PI/2)

    alfa = 12
    beta = 4
    gamma = 6
    A = AC
    I = IC
    L = h

    k1 = (E * A / L) * (c ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * s ** 2
    k2 = E * A / (L) * (s ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * (c ** 2)
    k3 = (beta + mu) * E * I / ((1 + mu) * L)
    k4 = (E * A / L - alfa * E * I / ((1 + mu) * L ** 3)) * s * c
    k5 = gamma * E * I / ((1 + mu) * L ** 2) * c
    k6 = gamma * E * I / ((1 + mu) * L ** 2) * s
    k7 = (beta / 2 - mu) * E * I / ((1 + mu) * L)
    fi = 1
    fidiag = 1
    Ke = [[k1, k4, -k6 * fi, -k1, -k4, -k6 * fidiag], [k4, k2, k5 * fi, -k4, -k2, k5 * fidiag],
                        [-k6 * fi, k5 * fi, k3 * fi, k6 * fi, -k5 * fi, fi * k7 * fidiag],
                        [-k1, -k4, k6 * fi, k1, k4, k6 * fidiag], [-k4, -k2, -k5 * fi, k4, k2, -k5 * fidiag],
                        [-k6 * fidiag, k5 * fidiag, fidiag * k7 * fi, k6 * fidiag, -k5 * fidiag, k3 * fidiag]]
    KEC = [...Ke]
    T = Math.atan(h/l)
	c = Math.cos(Math.PI/2)
    s = Math.sin(Math.PI/2)

    alfa = 12
    beta = 4
    gamma = 6
    A = AC
    I = IC
    L = h

    k1 = (E * A / L) * (c ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * s ** 2
    k2 = E * A / (L) * (s ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * (c ** 2)
    k3 = (beta + mu) * E * I / ((1 + mu) * L)
    k4 = (E * A / L - alfa * E * I / ((1 + mu) * L ** 3)) * s * c
    k5 = gamma * E * I / ((1 + mu) * L ** 2) * c
    k6 = gamma * E * I / ((1 + mu) * L ** 2) * s
    k7 = (beta / 2 - mu) * E * I / ((1 + mu) * L)
    fi = 1
    fidiag = 1
    Ke = [[k1, k4, -k6 * fi, -k1, -k4, -k6 * fidiag], [k4, k2, k5 * fi, -k4, -k2, k5 * fidiag],
                        [-k6 * fi, k5 * fi, k3 * fi, k6 * fi, -k5 * fi, fi * k7 * fidiag],
                        [-k1, -k4, k6 * fi, k1, k4, k6 * fidiag], [-k4, -k2, -k5 * fi, k4, k2, -k5 * fidiag],
                        [-k6 * fidiag, k5 * fidiag, fidiag * k7 * fi, k6 * fidiag, -k5 * fidiag, k3 * fidiag]]
    KER1 = [...Ke]

    T = -Math.atan(h/l)
	c = Math.cos(Math.PI/2)
    s = Math.sin(Math.PI/2)

    alfa = 12
    beta = 4
    gamma = 6
    A = AC
    I = IC
    L = h

    k1 = (E * A / L) * (c ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * s ** 2
    k2 = E * A / (L) * (s ** 2) + alfa * E * I / ((1 + mu) * L ** 3) * (c ** 2)
    k3 = (beta + mu) * E * I / ((1 + mu) * L)
    k4 = (E * A / L - alfa * E * I / ((1 + mu) * L ** 3)) * s * c
    k5 = gamma * E * I / ((1 + mu) * L ** 2) * c
    k6 = gamma * E * I / ((1 + mu) * L ** 2) * s
    k7 = (beta / 2 - mu) * E * I / ((1 + mu) * L)
    fi = 1
    fidiag = 1
    Ke = [[k1, k4, -k6 * fi, -k1, -k4, -k6 * fidiag], [k4, k2, k5 * fi, -k4, -k2, k5 * fidiag],
                        [-k6 * fi, k5 * fi, k3 * fi, k6 * fi, -k5 * fi, fi * k7 * fidiag],
                        [-k1, -k4, k6 * fi, k1, k4, k6 * fidiag], [-k4, -k2, -k5 * fi, k4, k2, -k5 * fidiag],
                        [-k6 * fidiag, k5 * fidiag, fidiag * k7 * fi, k6 * fidiag, -k5 * fidiag, k3 * fidiag]]
    KER2 = [...Ke]

	ue = [0,0,0,0,0,0]

	elementos.push([0,0,0,h,AC,IC,KEC,ue,[12,13,14,0,1,2]])
	elementos.push([0,h,0,2*h,AC,IC,KEC,ue,[0,1,2,3,4,5]])
	elementos.push([0,2*h,l,2*h,AV,IV,KEV,ue,[3,4,5,6,7,8]])
	elementos.push([l,h,l,2*h,AC,IC,KEC,ue,[9,10,11,6,7,8]])
	elementos.push([l,0,l,h,AC,IC,KEC,ue,[15,16,17,9,10,11]])
	elementos.push([0,h,l,h,AV,IV,KEV,ue,[0,1,2,9,10,11]])
	elementos.push([0,2*h,l,h,AV,IV,KER1,ue,[3,4,5,9,10,11]])
	elementos.push([0,0,l,h,AV,IV,KER2,ue,[12,13,14,9,10,11]])

}

function drawEstructura(desplazamientos=[[0,0,0,0,0,0,0,0,0,0,0,0]],inicial=false,k=1,inicio=0,colorPintar='blue') {
	ctx.clearRect(0,0,W,H)
	for (var j = inicio; j < k+1; j++) {
		try {
			asignarEElementos(desplazamientos[j].concat([0,0,0,0,0,0]))
		} catch {

		}
		if (colorPintar == 'aleatorio') {
			coloriter = 'rgb('+parseInt(math.random()*255)+','+parseInt(math.random()*255)+','+parseInt(math.random()*255)+')'
		} else {
			coloriter =colorPintar
		}
		for (var i = 0; i < elementos.length; i++) {
			e = elementos[i]
			draw(e[0],e[1],e[2],e[3],dash=[5,5],color='gray')
			if (inicial) {
			} else {
				draw(e[0]+e[7][0]*10,e[1]+e[7][1]*10,e[2]+e[7][3]*10,e[3]+e[7][4]*10,dash=[],color=coloriter)
			}
		}
	}
	e = elementos[0]
	draw(e[0]-0.5,e[1],e[0]+0.5,e[1],dash=[],color='gray')
	draw(l-0.5,0,l+0.5,0,dash=[],color='gray')

	draw(0-0.7,h,0-0.3,h,dash=[],color='orange')
	draw(0-0.5,h-0.2,0-0.3,h,dash=[],color='orange')
	draw(0-0.5,h+0.2,0-0.3,h,dash=[],color='orange')

	carga1 = 520
	carga2 = 740
	carga3 = 20000
	carga4 = 20000

	drawText(0-1.6,h-0.1,'' + carga1 + 'KN',color='black',grosor='2')

	draw(0-0.7,2*h,0-0.3,2*h,dash=[],color='orange')
	draw(0-0.5,2*h-0.2,0-0.3,2*h,dash=[],color='orange')
	draw(0-0.5,2*h+0.2,0-0.3,2*h,dash=[],color='orange')

	drawText(0-1.6,2*h-0.1,'' + carga2 + 'KN',color='black',grosor='2')

	draw(0,2*h+0.7,0,2*h+0.3,dash=[],color='orange')
	draw(0-0.2,2*h+0.5,0,2*h+0.3,dash=[],color='orange')
	draw(0+0.2,2*h+0.5,0,2*h+0.3,dash=[],color='orange')

	drawText(0-0.48,2*h+0.85,'' + carga3 + 'KN',color='black',grosor='2')

	draw(l+0,2*h+0.7,l+0,2*h+0.3,dash=[],color='orange')
	draw(l+0-0.2,2*h+0.5,l+0,2*h+0.3,dash=[],color='orange')
	draw(l+0+0.2,2*h+0.5,l+0,2*h+0.3,dash=[],color='orange')

	drawText(l+0-0.48,2*h+0.85,'' + carga4 + 'KN',color='black',grosor='2')

}
function asignarEElementos(U) {
	for (var i = 0; i < elementos.length; i++) {
		z = []
		for (var j = 0; j < 6; j++) {
			z.push(U[elementos[i][8][j]])
		}
		elementos[i][7] = z
	}
}
function kestructura() {
	K = []
	F = []
	n =6*3
	for (var i = 0; i < n; i++) {
		z = []
		for (var j = 0; j < n; j++) {
			z.push(0)
		}
		K.push(z)
		F.push(0)
	}
	F[0] = 520
	F[3] = 740
	F[4] = -20000
	F[7] = -20000
	for (var i = 0; i < elementos.length; i++) {
		for (var j = 0; j < 6; j++) {
			for (var k = 0; k < 6; k++) {
				K[elementos[i][8][j]][elementos[i][8][k]] += elementos[i][6][j][k]
			}
		}
	}
}
function draw(xi,yi,xf,yf,dash=[],color='black',grosor='2') {
	margen = 60
	mult = (W-margen*2)/coordenadaMaxima
	ctx.setLineDash(dash)
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = grosor
    ctx.moveTo(xi*mult + margen , (H-margen) - yi*mult)
    ctx.lineTo(xf*mult + margen , (H-margen) - yf*mult)
    ctx.stroke()
    ctx.closePath()
}
function drawText(xi,yi,text,color='black',grosor='2') {
	ctx.setLineDash(dash)
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = grosor
    ctx.fillText(text,xi*mult+margen,H-margen - yi*mult)
    ctx.stroke()
    ctx.closePath()
}
function correr() {
	elementos = []
	K = []
	F = []
	W = canvas.width
	H = canvas.height
	margen = 40

	h = 5
	l = 4.2
	definirElementos()
	kestructura()
	KPARCIAL = []
	FPARCIAL = []
	for (var i = 0; i < K.length-6; i++) {
		Z = []
		for (var j = 0; j < K.length-6; j++) {
			Z.push(K[i][j])
		}
		KPARCIAL.push(Z)
		FPARCIAL.push(F[i])
	}
	KSISTEMA = []
	sistema = new sistemasEcuaciones(KPARCIAL,FPARCIAL)
	sistema.U._data.push(0,0,0,0,0,0)
	return sistema
}
function actualizarCosas(bC,hC,bV,hV) {

	cvigas = document.getElementById('vigas')
	ccolumnas = document.getElementById('columnas')
	HCC = 166
	WCC = 300
	margenCC = 15
	multiC = (HCC-margenCC*2)/math.max(bC,hC)
	multiV = (HCC-margenCC*2)/math.max(bV,hV)

	ctxv = cvigas.getContext('2d')
	ctxc = ccolumnas.getContext('2d')

	ctxv.clearRect(0,0,WCC,HCC)
	ctxc.clearRect(0,0,WCC,HCC)

	ctxv.beginPath()
	ctxv.fillStyle = 'gray'
	ctxv.fillRect(WCC/2-bV/2*multiV,HCC/2-hV/2*multiV,bV*multiV,hV*multiV)
	ctxv.rect(WCC/2-bV/2*multiV,HCC/2-hV/2*multiV,bV*multiV,hV*multiV)
	ctxv.stroke()


	ctxc.beginPath()
	ctxc.fillStyle = 'gray'
	ctxc.fillRect(WCC/2-bC/2*multiC,HCC/2-hC/2*multiC,bC*multiC,hC*multiC)
	ctxc.rect(WCC/2-bC/2*multiC,HCC/2-hC/2*multiC,bC*multiC,hC*multiC)

	ctxc.stroke()

}
function actualizarCanvitas() {
	bv = parseFloat(document.getElementById('bviga').value)
	hv = parseFloat(document.getElementById('hviga').value)

	bc = parseFloat(document.getElementById('bcol').value)
	hc = parseFloat(document.getElementById('hcol').value)
	actualizarCosas(bc,hc,bv,hv)
}