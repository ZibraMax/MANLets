function zerosMat(r, c) {
    const A = [];
    for (let i = 0; i < r; i++) A.push(new Array(c).fill(0.0));
    return A;
}
class Spline {
    constructor(xs, ys) {
        this.xs = xs;
        this.ys = ys;
        this.N = xs.length 
        this.K = zerosMat((this.N-1)*4,(this.N-1)*4)
        this.F = zerosMat((this.N-1)*4,1)
        this.funciones = []
        let count = 0
        for (var i = 0; i < this.K.length; i+=4) {
        	let X0 = this.xs[count]
        	let Y0 = this.ys[count]
        	let X1 = this.xs[count+1]
        	let Y1 = this.ys[count+1]

        	this.F[i][0]+=Y0
        	this.F[i+1][0]+=Y1

        	this.K[i][i]+=X0**3
        	this.K[i][i+1]+=X0**2
            this.K[i][i+2]+=X0
        	this.K[i][i+3]+=1

        	this.K[i+1][i]+=X1**3
        	this.K[i+1][i+1]+=X1**2
            this.K[i+1][i+2]+=X1
        	this.K[i+1][i+3]+=1

        	this.K[i+2][i]+=3*X1**2
            this.K[i+2][i+1]+=2*X1
            this.K[i+2][i+2]+=1

        	this.K[i+2][i+4]+=-3*X1**2
            this.K[i+2][i+5]+=-2*X1
            this.K[i+2][i+6]+=-1

            this.K[i+3][i]+=6*X1
            this.K[i+3][i+1]+=2

            this.K[i+3][i+4]+=-6*X1
            this.K[i+3][i+5]+=-2
        	count++
        }

        let ceros = zerosMat(1,this.K.length)[0]
        ceros[0]=6*this.xs[0]
        ceros[1]=2
    	this.K[this.K.length-1]= ceros
        ceros = zerosMat(1,this.K.length)[0]
        ceros[this.K.length-4]=6*this.xs[this.xs.length-1]
        ceros[this.K.length-3]=2
        this.K[this.K.length-2]=ceros
        let M = math.matrix(this.K)
		let F = math.matrix(this.F)
		this.U = math.multiply(math.inv(M),F)._data
    }
    at(x) {
    	let tramo = -1
    	for (var i = 0; i < this.xs.length-1; i++) {
    		if (x<this.xs[i+1]) {
    			tramo = i
    			break
    		}
    	}
    	if (x>=this.xs[this.xs.length-2]) {
    		tramo = this.xs.length-2
    	}
    	let A = this.U[tramo*4][0]
    	let B = this.U[tramo*4+1][0]
    	let C = this.U[tramo*4+2][0]
        let D = this.U[(i-1)*4+3][0]
    	return A*x**3+B*x**2+C*x+D
	}
    darResultados(n=30) {
        let _X = []
        let _Y = []
        for (var i = 1; i < this.xs.length; i++) {
            let a = this.xs[i-1]
            let b = this.xs[i]
            let h = (b-a)/n
            let A = this.U[(i-1)*4][0]
            let B = this.U[(i-1)*4+1][0]
            let C = this.U[(i-1)*4+2][0]
            let D = this.U[(i-1)*4+3][0]
            for (var j = 0; j <= n; j++) {
                let x = a+j*h
                _X.push(x)
                _Y.push(A*x**3+B*x**2+C*x+D)
            }
        }
        return [_X,_Y]
    }
    darSegundasDerivadas() {
        let dd = []
        for (var i = 0; i < this.xs.length-1; i++) {
            let a = parseFloat(this.xs[i])
            let A = parseFloat(this.U[(i)*4])
            let B = parseFloat(this.U[(i)*4+1])
            dd.push(6.0*A*a+2.0*B)
        }
        let a = parseFloat(this.xs[this.xs.length-1])
        let A = parseFloat(this.U[(i-1)*4])
        let B = parseFloat(this.U[(i-1)*4+1])
        dd.push(6.0*A*a+2.0*B)
        return dd
    }
}
