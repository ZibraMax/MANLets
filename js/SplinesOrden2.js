function zerosMat(r, c) {
    const A = [];
    for (let i = 0; i < r; i++) A.push(new Array(c).fill(0.0));
    return A;
}
class SplineO2 {
    constructor(xs, ys) {
        this.xs = xs;
        this.ys = ys;
        this.N = xs.length 
        this.K = zerosMat((this.N-1)*3,(this.N-1)*3)
        this.F = zerosMat((this.N-1)*3,1)
        this.funciones = []
        let count = 0
        for (var i = 0; i < this.K.length; i+=3) {
        	let X0 = this.xs[count]
        	let Y0 = this.ys[count]
        	let X1 = this.xs[count+1]
        	let Y1 = this.ys[count+1]

        	this.F[i][0]+=Y0
        	this.F[i+1][0]+=Y1

        	this.K[i][i]+=X0**2
        	this.K[i][i+1]+=X0
        	this.K[i][i+2]+=1

        	this.K[i+1][i]+=X1**2
        	this.K[i+1][i+1]+=X1
        	this.K[i+1][i+2]+=1

        	this.K[i+2][i]+=2*X1
        	this.K[i+2][i+1]+=1
        	this.K[i+2][i+3]+=-2*X1
        	this.K[i+2][i+4]+=-1
        	count++
        }
    	this.K[this.K.length-1]=zerosMat(1,this.K.length)[0]
        this.K[this.K.length-1][0]=1
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
    	let A = this.U[tramo*3][0]
    	let B = this.U[tramo*3+1][0]
    	let C = this.U[tramo*3+2][0]
    	return A*x**2+B*x+C
	}
}
