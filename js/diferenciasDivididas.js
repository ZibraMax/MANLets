function interpolate(x, f)
{
	var amap = function(v){ return parseFloat(v) },
		x = x.map(amap),
		f = f.map(amap),
		n = Math.min(x.length, f.length),
		a = [];
	// calculate interpolation (https://en.wikipedia.org/wiki/Newton_polynomial#Application)
	for( var i=0; i < n; i++ )
	{
		a[i] = f[0];
		for( var j=1; j<n-i; j++ )
			f[j-1] = parseFloat( ((f[j] - f[j-1]) / (x[j+i] - x[j-1])).toFixed(7) );
	}
	// a0 + a1(x - x0) + a2(x-x0)(x-x1) + a3(x-x0)(x-x1)(x-x2) + ...
	// print the interpolating polynomial and also multiply the binomials for final form
	var pstr = math.round(a[0],2),
		multi = [new Poly(a[0])];
	for(var i=1; i<a.length; i++)
	{
		let signo = "+"
		if (a[i]<0) {
			signo = ''
		} 
		pstr += signo+math.round(a[i],2);
		var pairs = [a[i]];
		for(var j=0; j<i; j++)
		{
			let signo_1 = x[j]<0?'+':'-'
			pstr += "(x"+signo_1+math.round(x[j]**2/math.abs(x[j]),2)+")";
			pairs.push([-x[j],1]);
		}
		if (i%1 == 0) {
			pstr += "\\\\"
		}
		multi.push(Poly.multiply.apply(undefined, pairs));
	}
	return pstr
}
/*!
 * polynomial class with multiplication 
 */
function Poly(coeff)
{
	this.coeff = !(coeff instanceof Array) ? Array.prototype.slice.call(arguments) : coeff;
	this.length = this.coeff.length;
	this.multiply = function(poly)
	{
		if( !poly ) return this;
		var totalLength = this.coeff.length + poly.coeff.length - 1,
			result = new Array(totalLength);
		for( var i = 0; i < result.length; i++ ) result[i] = 0;
		for( var i = 0; i < this.coeff.length; i++ )
		{
			for( var j = 0; j < poly.coeff.length; j++ )
			{
				result[i+j] += this.coeff[i] * poly.coeff[j];
			}
		}
		return new Poly(result);
	}
}
Poly.multiply = function()
{
	var args = Array.prototype.slice.call(arguments),
		result = undefined;
	for (var i = 0; i < args.length; i++) 
	{
		if( !(args[i] instanceof Poly) ) args[i] = new Poly(args[i]);
		result = args[i].multiply(result);
	};
	return result;
}