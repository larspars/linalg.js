var linalg = (function() {
    'use strict';
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    
    function toArray(obj) {
        return Array.prototype.slice.call(obj);
    }
    
    function countLength(arr) {
        var n = 0;
        if (isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
                n += countLength(arr[i]);
            }
            return n;
        } else {
            return 1;
        }
    }
    
    function checkShape(arr) {
        var cur = arr,
            shape = [];
        while (isArray(cur)) {
            shape.push(cur.length);
            for (var i = 1; i < cur.length; i++) {
                if (cur[i-1].length !== cur[i].length) {
                    throw "Inconsistent shape";
                }
            }
            cur = cur[0];
        }
        return shape;
    }
    
    function fillTypedArray(arr, typedArr, n) {
        var filled = n;
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] == "number") {
                typedArr[filled] = arr[i];
                filled++;
            } else {
                filled += fillTypedArray(arr[i], typedArr, filled)
            }
        }
        return filled - n; //Return the number of indices filled by this call
    }
    
    function commonType(_a, _b) {
        //determine the result type of arithmetic between types of a and b
        if (_a === _b) return _a;
        if (_a === Matrix.uint8clamped) return _b;
        if (_b === Matrix.uint8clamped) return _a;
        
        
        var a = _a < _b ? _a : _b;
        var b = _a < _b ? _b : _a;
        //from here on, a is before b in the series [float32, float64, int16, int32, int8, uint16, uint32, uint8]
        
        if (a === Matrix.float32) {
            return (b === Matrix.float64 || b === Matrix.int32 || b === Matrix.uint32) ? Matrix.float64
                : Matrix.float32;
        }
        if (a === Matrix.float64) {
            return Matrix.float64;
        }
        if (a === Matrix.int16) {
            return (b === Matrix.int32 || b === Matrix.uint16) ? Matrix.int32
                :  (b === Matrix.int8 || b === Matrix.uint8) ? Matrix.int16
                : Matrix.float64 //b === Matrix.uint32
        }
        if (a === Matrix.int32) {
            return b === Matrix.uint32 ? Matrix.float64
                : Matrix.int32;
        }
        if (a === Matrix.int8) {
            return b === Matrix.uint16 ? Matrix.int32
                : b === Matrix.uint32 ? Matrix.float64
                : Matrix.int16; // b === Matrix.uint8;
        }
        if (a === Matrix.uint16) {
            return b === Matrix.uint32 ? Matrix.uint32
                : Matrix.uint16; //b === Matrix.uint8
        }
        return Matrix.uint32; //a === uint32, b === uint8
    }
    
    function typedArrayConstructor(dtype) {
        switch (dtype) {
            case Matrix.float64: return Float64Array;
            case Matrix.float32: return Float32Array;
            case Matrix.int32: return Int32Array;
            case Matrix.int16: return Int16Array;
            case Matrix.int8: return Int8Array;
            case Matrix.uint32: return Uint32Array;
            case Matrix.uint16: return Uint16Array;
            case Matrix.uint8: return Uint8Array;
            case Matrix.uint8clamped: return Uint8ClampedArray;
        }
    }
    
    function createTypedArray(dtype, length) {
        return new (typedArrayConstructor(dtype))(length);
    }
    
    function dtypeOf(typedArray) {
		switch (typedArray.constructor) {
			case Float64Array: return Matrix.float64;
			case Float32Array: return Matrix.float32;
			case Int32Array: return Matrix.int32;
			case Int16Array: return Matrix.int16;
			case Int8Array: return Matrix.int8;
			case Uint32Array: return Matrix.uint32;
			case Uint16Array: return Matrix.uint16;
			case Uint8Array: return Matrix.uint8;
			case Uint8ClampedArray: return Matrix.uint8clamped;
		}
	}
    
    function dtypeFromString(str) {
		switch (str) {
			case "float64": return Matrix.float64;
			case "float32": return Matrix.float32;
			case "int32": return Matrix.int32;
			case "int16": return Matrix.int16;
			case "int8": return Matrix.int8;
			case "uint32": return Matrix.uint32;
			case "uint16": return Matrix.uint16;
			case "uint8": return Matrix.uint8;
			case Matrix.uint8clamped: return Matrix.uint8clamped;
		}
    }
    
    function handleDTypeArg(dtype) {
        if (typeof dtype === "number") {
            return dtype;
        }
        if (typeof dtype === "string") {
            return dtypeFromString(dtype);
        }
        return Matrix.float64;
    }

    function Matrix(arr, dtype) { //accepts (plainArray, type) and (typedArray, shape)
        if (isArray(arr)) {
            var type = handleDTypeArg(dtype);
            var len = countLength(arr);
            this._shape = checkShape(arr);
            this._typedArray = createTypedArray(type, len);
            this._dtype = type;
            var filledLen = fillTypedArray(arr, this._typedArray, 0);
        } else {
            this._typedArray = arguments[0];
            this._shape = arguments[1];
            this._dtype = dtypeOf(this._typedArray);
        }
        for (var i = 0; i < this._shape.length; i++) {
            if (typeof this._shape[i] !== "number") {
                throw new Error("Illegal matrix shape");
            }
        }
    }
    
    Matrix.zeros = function(shape, dtype) {
        dtype = handleDTypeArg(dtype);
        var length = shape.length ? 1 : 0;
        for (var i = 0; i < shape.length; i++) {
            length *= shape[i];
        }
        return new Matrix(createTypedArray(dtype, length), shape);
    }
    
    Matrix.I = function(n, dtype) {
        dtype = handleDTypeArg(dtype);
        var matrix = Matrix.zeros([n, n], dtype);
        for (var i = 0; i < n; i++) {
            matrix.set(i, i, 1);
        }
        return matrix;
    }
    
    //don't change the order of these
    Matrix.float32 = 0;
    Matrix.float64 = 1;
    Matrix.int16 = 2;
    Matrix.int32 = 3;
    Matrix.int8 = 4;
    Matrix.uint16 = 5;
    Matrix.uint32 = 6; 
    Matrix.uint8 = 7;
    Matrix.uint8clamped = 8;
    
    Matrix.prototype = {
        toString: function() {
            //This one blows up on large matrices.
            if (this._shape.length === 1) {
                return "[" + toArray(this._typedArray).join(", ") + "]";
            } else if (this._shape.length === 2) {
                var rows = this._shape[0], 
                    cols = this._shape[1],
                    rowStrs = [];
                for (var i = 0; i < rows; i++) {
                    var row = [];
                    for (var j = 0; j < cols; j++) {
                        row.push(this._at(i, j));
                    }
                    rowStrs.push(row.join(", "));
                }
                return "[[" + rowStrs.join("]\n [") + "]]";
            } else {
                return "Matrix of shape " + this._shape;
            }
        },
        
        shape: function() {
            return this._shape.slice();
        },
        
        at: function(row, col) {
            //TODO: Define for n-dimensions
            if (row >= this._shape[0] || col >= this._shape[1]) {
                throw new Error("Index is out of range");
            }
            return this._at(row, col);
        },
        
        _at: function(row, col) {
            //TODO: Define for n-dimensions
            var numColumns = this._shape[1];
            var offset = row*numColumns + col;
            return this._typedArray[offset];
        },
        
        _at1d: function(i) {
            return this._typedArray[i];
        },
        
        set: function(row, col, value) {
            //TODO: Define for n-dimensions
            if (row >= this._shape[0] || col >= this._shape[1]) {
                throw new Error("Index is out of range");
            }
            this._set(row, col, value);
        },
        
        _set: function(row, col, value) {
            var numColumns = this._shape[1];
            var offset = row*numColumns + col;
            this._typedArray[offset] = value;
        },
        
        copy: function() {
            var typedArray = new (typedArrayConstructor(this._dtype))(this._typedArray);
            return new Matrix(typedArray, this._shape);
        },
        
        sameShape: function(matrix) {
            if (this._shape.length !== matrix._shape.length) {
                return false;
            }
            for (var i = 0; i < this._shape.length; i++) {
                if (this._shape[i] !== matrix._shape[i]) {
                    return false;
                }
            }
            return true;
        },
        
        equals: function(other) {
            if (!this.sameShape(other)) {
                return false;
            }
            var rows = this._shape[0],
                cols = this._shape[1];
            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    if (this._at(row, col) !== other._at(row, col)) {
                        return false;
                    }
                }
            }
            return true;
        },
        
        allClose: function(other, rtol, atol) {
            rtol = rtol || 1e-05; //relative tolerance
            atol = atol || 1e-08; //absolute tolerance
            if (!this.sameShape(other)) {
                throw new Error("Incompatible shapes");
            }
            for (var i = 0; i < this._typedArray.length; i++) {
                var a = this._typedArray[i],
                    b = other._typedArray[i],
                    aIsNaN = isNaN(a),
                    bIsNaN = isNaN(b);
                if ((aIsNaN && !bIsNaN) || (!aIsNaN && bIsNaN)) {
                    return false;
                }
                 //formula taken from numpy
                if (Math.abs(a - b) > (atol + rtol * Math.abs(b))) {
                    return false;
                }
            }
            return true;
        },
        
        plus: function(other) {
            if (!this.sameShape(other)) {
                throw new Error("Incompatible shapes");
            }
            var dtype = commonType(this._dtype, other._dtype);
            var result = Matrix.zeros(this._shape, dtype);
            for (var i = 0; i < this._typedArray.length; i++) {
                result._typedArray[i] = this._typedArray[i] + other._typedArray[i];
            }
            return result;
        },
        
        minus: function(other) {
            if (!this.sameShape(other)) {
                throw new Error("Incompatible shapes");
            }
            var dtype = commonType(this._dtype, other._dtype);
            var result = Matrix.zeros(this._shape, dtype);
            for (var i = 0; i < this._typedArray.length; i++) {
                result._typedArray[i] = this._typedArray[i] - other._typedArray[i];
            }
            return result;
        },
                        
        multElems: function(other) {
            if (arguments.length === 0) {
                return this.elemProduct();
            }
            if (!this.sameShape(other)) {
                throw new Error("Incompatible shapes");
            }
            var dtype = commonType(this._dtype, other._dtype);
            var result = Matrix.zeros(this._shape, dtype);
            for (var i = 0; i < this._typedArray.length; i++) {
                result._typedArray[i] = this._typedArray[i] * other._typedArray[i];
            }
            return result;
        },
        
        
        divElems: function(other) {
            if (!this.sameShape(other)) {
                throw new Error("Incompatible shapes");
            }
            var dtype = commonType(this._dtype, other._dtype);
            var result = Matrix.zeros(this._shape, dtype);
            for (var i = 0; i < this._typedArray.length; i++) {
                result._typedArray[i] = this._typedArray[i] / other._typedArray[i];
            }
            return result;
        },
        
        
        mult: function(other) {
            if (arguments.length === 0) {
                return this.elemProduct();
            }
            //TODO: Define for n-dimensions
            if (this._shape[1] !== other._shape[0]) {
                throw new Error("Incompatible shapes");
            }
            var m = this._shape[0],
                n = other._shape[1],
                o = other._shape[0],
                result = Matrix.zeros([m, n], commonType(this._dtype, other._dtype));
            
            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    var sum = 0;
                    for (var k = 0; k < o; k++) {
                        sum += this._at(i, k) * other._at(k, j);
                    }
                    result._set(i, j, sum);
                }
            }
            
            return result;
        },
        
        inverse: function() {
            if (!this.isSquare()) {
                throw new Error("Must be a square matrix");
            }
            return linalg.solve(this, Matrix.I(this._shape[0], this._dtype))
        },
        
        leftDiv: function(other) {
        
        },
        
        rightDiv: function(other) {
        
        },
        
        isSquare: function() {
            return this._shape.length === 2 || (this._shape[0] === this._shape[1]);
        },
        
        determinant: function(inplace) {
            if (!this.isSquare()) {
                throw new Error("Must be a square matrix");
            }
            
            var mat = inplace ? this : this.copy();
            linalg.forwardElimination(mat)
            var n = mat._shape[0],
                determinant = 1;
            for (var i = 0; i < n; i++) {
                determinant *= mat._at(i, i);
            }
            return determinant;
        },
        
        diag: function() {
            var n = Math.min.apply(Math, this._shape);
            var arr = createTypedArray(this._dtype, n);
            for (var i = 0; i < n; i++) {
                arr[i] = this._at(i, i);
            }
            return new Matrix(arr, [n]);
        },
        
        rlDiag: function() {
            var n = Math.min.apply(Math, this._shape);
            var arr = createTypedArray(this._dtype, n);
            for (var i = 0; i < n; i++) {
                arr[i] = this._at(i, this._shape[1]-i-1);
            }
            return new Matrix(arr, [n]);
        }, 
        
        sum: function() {
            var sum = 0;
            for (var i = 0; i < this._typedArray.length; i++) {
                sum += this._typedArray[i];
            }
            return sum;
        },
        
        elemProduct: function() {
            var product = 1;
            for (var i = 0; i < this._typedArray.length; i++) {
                product *= this._typedArray[i];
            }
            return product;
        },
        
        LU: function(inplace) {
            if (!this.isSquare()) {
                throw new Error("Must be a square matrix");
            }
            
            var n = this._shape[0];
            var L = Matrix.I(n, this._dtype);
            var U = inplace ? this : this.copy(); //TODO: need a float datatype here
            
            for (var ocol = 0; ocol < n-1; ocol++) {
                for (var row = ocol+1; row < n; row++) {
                    var multiplier = U._at(row, ocol) / U._at(ocol, ocol);
                    L._set(row, ocol, multiplier);
                    for (var col = 0; col < n; col++) {
                        //U[row, col] -= U[ocol, col] * multiplier
                        var val = U._at(row, col) - (U._at(ocol, col) * multiplier);
                        U._set(row, col, val);
                    }
                }
            }
            
            return [L, U];
        },
        
        column: function(col) {
            if (this._shape.length !== 2 || col > this._shape[1] - 1) {
                throw new Error("Illegal index")
            }
            var typedArray = createTypedArray(this._dtype, this._shape[0]);
            for (var row = 0; row < this._shape[0]; row++) {
                typedArray[row] = this._at(row, col);
            }
            return new Matrix(typedArray, [this._shape[0]]);
        },
        
        norm: function() {
            var norm = 1;
            for (var i = 0; i < this._typedArray.length; i++) {
                norm += this._typedArray[i] * this._typedArray[i];
            }
            return Math.sqrt(norm);
        },
        
        transpose: function() {
            return new MatrixTranspose(this);
        }
    }
    
    
    function $extend(a, b) {
        var obj = {};
        for (var prop in a) {
            obj[prop] = a[prop];
        }
        for (var prop in b) {
            obj[prop] = b[prop];
        }
        return obj;
    }
    
    
    
    //view that allows for constant time transpose.
    function MatrixTranspose(matrix) {
        this._shape = Array.prototype.slice.call(matrix._shape).reverse();
        this._typedArray = matrix._typedArray;
        this._dtype = matrix._dtype;
    }
    
    MatrixTranspose.prototype = $extend(Matrix.prototype, {
    
        _at: function(row, col) {
            //TODO: Define for n-dimensions
            var numColumns = this._shape[0];
            var offset = col*numColumns + row;
            return this._typedArray[offset];
        },
            
        _set: function(row, col, value) {
            var numColumns = this._shape[0];
            var offset = col*numColumns + row;
            this._typedArray[offset] = value;
        }
    });
    
    
    
    function validateSubstitutionArgs(A, b) {
        //Validates that A is square, and that b is a row or column vector of the same rows/columns of b
        if (!A.isSquare()) {
            throw new Error("Matrix A must be square");
        }
        if ((b._shape.length === 1 && A._shape[0] !== b._shape[0]) ||
            (b._shape.length === 2 && (A._shape[0] !== b._shape[0] || b._shape[1] !== 1)) ||
            (b._shape.length > 2)) {
            throw new Error("Matrices have an incompatible shape");
        }
    }
    
    var linalg = {

        forwardElimination: function(C, ys) {
            //Returns the upper triangular matrix that results 
            //from a forward elimination on the coefficient matrix.
            //TODO: Row exchanges            
            var n = C._shape[0];
        
            for (var ocol = 0; ocol < n-1; ocol++) {
                for (var row = ocol+1; row < n; row++) {
                    var multiplier = C._at(row, ocol) / C._at(ocol, ocol);
                    for (var col = 0; col < n; col++) {
                        //C[row, col] -= C[ocol, col] * multiplier
                        var val = C._at(row, col) - (C._at(ocol, col) * multiplier);
                        C._set(row, col, val);
                    }
                    if (ys) {
                        var val = ys._at(row, 0) - (ys._at(ocol, 0) * multiplier);
                        ys._set(row, 0, val);
                    }
                }
            }
        },
        
        forwardSubstitution: function(A, b, inplace) {
            //Finds the x such that Ax = b , where A is a lower triangular matrix. 
            //b is a column vector, but can be passed as a row vector (i.e. it can have shape=[n] or shape=[n, 1])
            validateSubstitutionArgs(A, b);
            var x = inplace ? b : Matrix.zeros(b._shape, commonType(A._dtype, b._dtype));
            
            var n = A._shape[0];
            for (var row = 0; row < n; row++) {
                var sum = 0;
                for (var col = 0; col < row; col++) {
                    sum += A._at(row, col) * x._typedArray[col];
                }
                x._typedArray[row] = (b._typedArray[row] - sum) / A._at(row, row);
            }
            return x;
        },
        
        backwardSubstitution: function(A, b, inplace) {
            //Finds the x such that Ax = b , where A is a upper triangular matrix. 
            //b is a column vector, but can be passed as a row vector (i.e. it can have shape=[n] or shape=[n, 1])
            validateSubstitutionArgs(A, b);
            var x = inplace ? b : Matrix.zeros(b._shape, commonType(A._dtype, b._dtype));
            
            var n = A._shape[0];
            for (var row = n-1; row >= 0; row--) {
                var sum = 0;
                for (var col = n-1; col > row; col--) {
                    sum += A._at(row, col) * x._typedArray[col];
                }
                x._typedArray[row] = (b._typedArray[row] - sum) / A._at(row, row);
            }
            return x;
        },

        solve: function(A, B) {
            //finds the X such that AX = B
            
            if (!A.isSquare() || !B.isSquare()) {
                throw new Error("Arguments must be square matrices.");
            }
            
            var lu = A.LU(),
                L = lu[0],
                U = lu[1],
                n = B._shape[1],
                X = Matrix.zeros(A._shape, commonType(A._dtype, B._dtype));
                
            for (var col = 0; col < n; col++) {
                //TODO: This can be optimized so it doesn't use the extra space
                var z = linalg.forwardSubstitution(L, B.column(col));
                var x = linalg.backwardSubstitution(U, z);
                for (var row = 0; row < n; row++) {
                    X._set(row, col, x._at1d(row));
                }
            }
            return X;
        }, 
        
        Matrix: Matrix
    }
        
    return linalg;
})();

var Matrix = linalg.Matrix;


