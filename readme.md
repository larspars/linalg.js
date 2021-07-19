#What is linalg.js

linalg.js is a linear algebra library for javascript. It is based on Typed Arrays, so you can have fast interop with, for example, WebGL code that uses Typed Arrays.

Example:

```javascript
var matrix = new Matrix([[7, 3, -1, 2], 
                         [3, 8, 1, -4], 
                         [-1, 1, 4, -1], 
                         [2, -4, -1, 6]]);
						 
//Perform LU decomposition
var res = matrix.LU(),
	L = res[0],
	U = res[1];

var expectedL = new Matrix([[ 1.        ,  0.        ,  0.        ,  0.        ],
							[ 0.42857143,  1.        ,  0.        ,  0.        ],
							[-0.14285714,  0.21276596,  1.        ,  0.        ],
							[ 0.28571429, -0.72340426,  0.08982036,  1.        ]]);
var expectedU = new Matrix([[ 7.        ,  3.        , -1.        ,  2.        ],
							[ 0.        ,  6.71428571,  1.42857143, -4.85714286],
							[ 0.        ,  0.        ,  3.55319149,  0.31914894],
							[ 0.        ,  0.        ,  0.        ,  1.88622754]]);
	
assert(expectedL.allClose(L));
assert(expectedU.allClose(U));

``` 

##What's in it?

Currently, the following functions are implemented: Matrix multiplication, matrix inverse, element wise operators (+-*/), LU decomposition, matrix determinant and the Frobenius norm. 

##Will this code work in all circumstances?

Probably not.

License: MIT
