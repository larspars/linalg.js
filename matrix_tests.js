
function AssertionError(msg) {
    this.message = msg;
    this.name = "AssertionError";
}
AssertionError.prototype = new Error();
function assert(bool) {
    if (!bool) {
        throw new AssertionError("Assertion failed");
    }
}


var tests = {
    testIndexes: function() {
        var m = new Matrix([[1,2,3], 
                            [4,5,6]]);
        assert(m.at(0, 0) == 1);
        assert(m.at(0, 1) == 2);
        assert(m.at(0, 2) == 3);
        assert(m.at(1, 0) == 4);
        assert(m.at(1, 1) == 5);
        assert(m.at(1, 2) == 6);
    },

    testShapes_shouldThrowOnIllegalShape: function() {
        var threw = false;
        try { new Matrix([[3,3,3], [3,3,3] [4,4,4,4]]); }
        catch (e) { threw = true; }
        assert(threw);
    },

    testShapes_shouldAcceptSimple3d: function() {
        new Matrix([[[1,2], [3,4], [5,6]], [[1,2], [3,4], [5,6]]]);
    },
    
    testEquals: function() {
        var m = new Matrix([[1,2,3], 
                            [4,5,6]]);
        var n = new Matrix([[1,2,3], 
                            [4,5,6]]);
                            
        assert(m.equals(n));
    },
    
    testNotEquals: function() {
        var m = new Matrix([[1,2,3], 
                            [4,5,6]]);
        var n = new Matrix([[6,5,4], 
                            [3,2,1]]);
        assert(!m.equals(n));
    },

    testPlus: function() {
        var m = new Matrix([[1,2,3], 
                            [4,5,6]]);
        var n = new Matrix([[6,5,4], 
                            [3,2,1]]);
        assert(m.plus(n).equals(new Matrix([[7,7,7], 
                                           [7,7,7]])));
    }, 
    
    testZeros: function() {
        assert(Matrix.zeros([1,2]).equals(new Matrix([[0, 0]])));
        
        assert(Matrix.zeros([5,2]).equals(new Matrix([[0., 0.],
                                                       [0., 0.],
                                                       [0., 0.],
                                                       [0., 0.],
                                                       [0., 0.]])));
    },
    
    testTypeConversions: function() {
        function sum(typeA, typeB) {
            return new Matrix([1], typeA).plus(new Matrix([1], typeB));
        }
        assert(sum(Matrix.float32, Matrix.int16)._dtype === Matrix.float32);
        assert(sum(Matrix.float32, Matrix.int32)._dtype === Matrix.float64);
        assert(sum(Matrix.float32, Matrix.int8)._dtype === Matrix.float32);
        assert(sum(Matrix.float32, Matrix.uint16)._dtype === Matrix.float32);
        assert(sum(Matrix.float32, Matrix.uint32)._dtype === Matrix.float64);
        assert(sum(Matrix.float32, Matrix.uint8)._dtype === Matrix.float32);
        assert(sum(Matrix.float64, Matrix.float32)._dtype === Matrix.float64);
        assert(sum(Matrix.float64, Matrix.int16)._dtype === Matrix.float64);
        assert(sum(Matrix.float64, Matrix.int32)._dtype === Matrix.float64);
        assert(sum(Matrix.float64, Matrix.int8)._dtype === Matrix.float64);
        assert(sum(Matrix.float64, Matrix.uint16)._dtype === Matrix.float64);
        assert(sum(Matrix.float64, Matrix.uint32)._dtype === Matrix.float64);
        assert(sum(Matrix.float64, Matrix.uint8)._dtype === Matrix.float64);
        assert(sum(Matrix.int16, Matrix.float32)._dtype === Matrix.float32);
        assert(sum(Matrix.int16, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.int16, Matrix.int32)._dtype === Matrix.int32);
        assert(sum(Matrix.int16, Matrix.int8)._dtype === Matrix.int16);
        assert(sum(Matrix.int16, Matrix.uint16)._dtype === Matrix.int32);
        assert(sum(Matrix.int16, Matrix.uint32)._dtype === Matrix.float64);
        assert(sum(Matrix.int16, Matrix.uint8)._dtype === Matrix.int16);
        assert(sum(Matrix.int32, Matrix.float32)._dtype === Matrix.float64);
        assert(sum(Matrix.int32, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.int32, Matrix.int16)._dtype === Matrix.int32);
        assert(sum(Matrix.int32, Matrix.int8)._dtype === Matrix.int32);
        assert(sum(Matrix.int32, Matrix.uint16)._dtype === Matrix.int32);
        assert(sum(Matrix.int32, Matrix.uint32)._dtype === Matrix.float64);
        assert(sum(Matrix.int32, Matrix.uint8)._dtype === Matrix.int32);
        assert(sum(Matrix.int8, Matrix.float32)._dtype === Matrix.float32);
        assert(sum(Matrix.int8, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.int8, Matrix.int16)._dtype === Matrix.int16);
        assert(sum(Matrix.int8, Matrix.int32)._dtype === Matrix.int32);
        assert(sum(Matrix.int8, Matrix.uint16)._dtype === Matrix.int32);
        assert(sum(Matrix.int8, Matrix.uint32)._dtype === Matrix.float64);
        assert(sum(Matrix.int8, Matrix.uint8)._dtype === Matrix.int16);
        assert(sum(Matrix.uint16, Matrix.float32)._dtype === Matrix.float32);
        assert(sum(Matrix.uint16, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.uint16, Matrix.int16)._dtype === Matrix.int32);
        assert(sum(Matrix.uint16, Matrix.int32)._dtype === Matrix.int32);
        assert(sum(Matrix.uint16, Matrix.int8)._dtype === Matrix.int32);
        assert(sum(Matrix.uint16, Matrix.uint32)._dtype === Matrix.uint32);
        assert(sum(Matrix.uint16, Matrix.uint8)._dtype === Matrix.uint16);
        assert(sum(Matrix.uint32, Matrix.float32)._dtype === Matrix.float64);
        assert(sum(Matrix.uint32, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.uint32, Matrix.int16)._dtype === Matrix.float64);
        assert(sum(Matrix.uint32, Matrix.int32)._dtype === Matrix.float64);
        assert(sum(Matrix.uint32, Matrix.int8)._dtype === Matrix.float64);
        assert(sum(Matrix.uint32, Matrix.uint16)._dtype === Matrix.uint32);
        assert(sum(Matrix.uint32, Matrix.uint8)._dtype === Matrix.uint32);
        assert(sum(Matrix.uint8, Matrix.float32)._dtype === Matrix.float32);
        assert(sum(Matrix.uint8, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.uint8, Matrix.int16)._dtype === Matrix.int16);
        assert(sum(Matrix.uint8, Matrix.int32)._dtype === Matrix.int32);
        assert(sum(Matrix.uint8, Matrix.int8)._dtype === Matrix.int16);
        assert(sum(Matrix.uint8, Matrix.uint16)._dtype === Matrix.uint16);
        assert(sum(Matrix.uint8, Matrix.uint32)._dtype === Matrix.uint32);
        assert(sum(Matrix.uint8clamped, Matrix.float32)._dtype === Matrix.float32);
        assert(sum(Matrix.uint8clamped, Matrix.float64)._dtype === Matrix.float64);
        assert(sum(Matrix.uint8clamped, Matrix.int16)._dtype === Matrix.int16);
        assert(sum(Matrix.uint8clamped, Matrix.int32)._dtype === Matrix.int32);
        assert(sum(Matrix.uint8clamped, Matrix.int8)._dtype === Matrix.int8);
        assert(sum(Matrix.uint8clamped, Matrix.uint8)._dtype === Matrix.uint8);
        assert(sum(Matrix.uint8clamped, Matrix.uint16)._dtype === Matrix.uint16);
        assert(sum(Matrix.uint8clamped, Matrix.uint32)._dtype === Matrix.uint32);
        assert(sum(Matrix.float32, Matrix.uint8clamped)._dtype === Matrix.float32);
        assert(sum(Matrix.float64, Matrix.uint8clamped)._dtype === Matrix.float64);
        assert(sum(Matrix.int16, Matrix.uint8clamped)._dtype === Matrix.int16);
        assert(sum(Matrix.int32, Matrix.uint8clamped)._dtype === Matrix.int32);
        assert(sum(Matrix.int8, Matrix.uint8clamped)._dtype === Matrix.int8);
        assert(sum(Matrix.uint8, Matrix.uint8clamped)._dtype === Matrix.uint8);
        assert(sum(Matrix.uint16, Matrix.uint8clamped)._dtype === Matrix.uint16);
        assert(sum(Matrix.uint32, Matrix.uint8clamped)._dtype === Matrix.uint32);
        assert(sum(Matrix.uint8clamped, Matrix.uint8clamped)._dtype === Matrix.uint8clamped);
    },
    
    testMultElems: function() {
        assert(new Matrix([1,2,3,4,5])
         .multElems(new Matrix([9,8,7,6,5]))
         .equals(new Matrix([ 9, 16, 21, 24, 25])));
         
         
        assert(new Matrix([1,2,3,4,5])
         .multElems(new Matrix([9.3,8.1,7.2,6,5]))
         .equals(new Matrix([ 9.3, 16.2, 21.6, 24, 25])));
         
    },
    
    testDiv: function() {
        assert(new Matrix([2, 3])
         .divElems(new Matrix([8, 6]))
         .equals(new Matrix([0.25, 0.5])));
    },
    
    testMinus: function() {
        assert(new Matrix([1,2,3,4,5])
         .minus(new Matrix([9,8,7,6,5]))
         .equals(new Matrix([-8, -6, -4, -2, 0])));
    },
    
    testMult: function() {
        var a = new Matrix([[1,2,3],[2,3,4]]);
        var b = new Matrix([[1,2],[3,4],[5,6]]);
        var ab = new Matrix([[22,28],
                             [31,40]]);
        var ba = new Matrix(([[ 5,  8, 11],
                              [11, 18, 25],
                              [17, 28, 39]]));
        assert(a.mult(b).equals(ab));
        assert(b.mult(a).equals(ba));
    },
    
    testMult_2d_times_1d: function() {
        var a = new Matrix([[0,3,5],[5,5,2]]);
        var b = new Matrix([[3],[4],[3]]);
        var ab = new Matrix([[27],
                             [41]]);
        assert(a.mult(b).equals(ab));
    },
    
    testSum: function() {
        assert(new Matrix([[1,2,3],[2,3,4]]).sum() === 15);
        assert(new Matrix([[1,2],[3,4],[5,6]]).sum() === 21);
    },
    
    testMultSelf: function() {
        assert(new Matrix([[1,2,3],[2,3,4]]).mult() === 1*2*3*2*3*4);
        assert(new Matrix([[1,2],[3,4],[5,6]]).multElems() === 1*2*3*4*5*6);
    },
    
    testDiag: function() {
        assert(new Matrix([[1, 0, 0],
                           [0, 2, 0],
                           [0, 0, 3]]).diag().equals(new Matrix([1,2,3])));
                           
        assert(new Matrix([[1, 0, 0],
                           [0, 2, 0],
                           [0, 0, 3],
                           [0, 0, 0]]).diag().equals(new Matrix([1,2,3])));
        assert(new Matrix([[1, 0, 0, 0],
                           [0, 2, 0, 0],
                           [0, 0, 3, 0]]).diag().equals(new Matrix([1,2,3])));
    },
    
    testRlDiag: function() {
        assert(new Matrix([[0, 0, 1],
                           [0, 2, 0],
                           [3, 0, 0]]).rlDiag().equals(new Matrix([1,2,3])));
                           
        assert(new Matrix([[0, 0, 1],
                           [0, 2, 0],
                           [3, 0, 0],
                           [0, 0, 0]]).rlDiag().equals(new Matrix([1,2,3])));
        assert(new Matrix([[0, 0, 0, 1],
                           [0, 0, 2, 0],
                           [0, 3, 0, 0]]).rlDiag().equals(new Matrix([1,2,3])));
    },
    
    testI: function() {
        assert(Matrix.I(3).equals(new Matrix([[1, 0, 0],
                                              [0, 1, 0],
                                              [0, 0, 1]])));
        assert(Matrix.I(4).equals(new Matrix([[1, 0, 0, 0],
                                              [0, 1, 0, 0],
                                              [0, 0, 1, 0],
                                              [0, 0, 0, 1]])));
    },
    
    testCopy: function() {
        var a = new Matrix([[1,2],[3,4]]);
        var b = a.copy();
        assert(a.equals(b));
        a.set(1,1,0);
        assert(!a.equals(b));
    },
    testLU: function() {
        //example from http://www.youtube.com/watch?v=wTlAUfv_O4s
        var matrix = new Matrix([[25, 5, 1], 
                                 [64, 8, 1], 
                                 [144, 12, 1]]);
        var expectedL = new Matrix([[1, 0, 0],
                                    [2.56, 1, 0],
                                    [5.76, 3.5, 1]]);
        var expectedU = new Matrix([[25, 5, 1],
                                    [0, -4.8, -1.56],
                                    [0, 0, 0.7]]);
        var res = matrix.LU(),
            L = res[0],
            U = res[1];
            
        /*
        console.log("L:")
        console.log(L.toString());
        console.log("L expected:")
        console.log(expectedL.toString())
        
        console.log("U:")
        console.log(U.toString());
        console.log("U expected:")
        console.log(expectedU.toString())
        */
        
        assert(expectedL.allClose(L));
        assert(expectedU.allClose(U));
    },
    
    testLU_inplace: function() {
        //example from http://www.youtube.com/watch?v=wTlAUfv_O4s
        var matrix = new Matrix([[25, 5, 1], 
                                 [64, 8, 1], 
                                 [144, 12, 1]]);
        var expectedL = new Matrix([[1, 0, 0],
                                    [2.56, 1, 0],
                                    [5.76, 3.5, 1]]);
        var expectedU = new Matrix([[25, 5, 1],
                                    [0, -4.8, -1.56],
                                    [0, 0, 0.7]]);
        var res = matrix.LU(true),
            L = res[0],
            U = res[1];
        assert(expectedL.allClose(L));
        assert(expectedU.allClose(U));
        assert(matrix === U);
    },
    
    testLU2: function() {
        var matrix = new Matrix([[7, 3, -1, 2], 
                                 [3, 8, 1, -4], 
                                 [-1, 1, 4, -1], 
                                 [2, -4, -1, 6]]);
        var expectedL = new Matrix([[ 1.        ,  0.        ,  0.        ,  0.        ],
                                    [ 0.42857143,  1.        ,  0.        ,  0.        ],
                                    [-0.14285714,  0.21276596,  1.        ,  0.        ],
                                    [ 0.28571429, -0.72340426,  0.08982036,  1.        ]]);
        var expectedU = new Matrix([[ 7.        ,  3.        , -1.        ,  2.        ],
                                    [ 0.        ,  6.71428571,  1.42857143, -4.85714286],
                                    [ 0.        ,  0.        ,  3.55319149,  0.31914894],
                                    [ 0.        ,  0.        ,  0.        ,  1.88622754]]);
        var res = matrix.LU(),
            L = res[0],
            U = res[1];
            
        /*   
        console.log("L:")
        console.log(L.toString());
        console.log("L expected:")
        console.log(expectedL.toString())
        
        console.log("U:")
        console.log(U.toString());
        console.log("U expected:")
        console.log(expectedU.toString())
        */
        
        assert(expectedL.allClose(L));
        assert(expectedU.allClose(U));
    },
    
    testForwardElimination: function() {
        var coeffs = new Matrix([[25, 5, 1], 
                                 [64, 8, 1], 
                                 [144, 12, 1]]);
        var ys = new Matrix([[106.8], [177.2], [279.2]]);
        
        linalg.forwardElimination(coeffs, ys);
        
        var expectedCoeffs = new Matrix([[25, 5, 1],
                                         [0, -4.8, -1.56],
                                         [0, 0, 0.7]]);
        var expectedYs = new Matrix([[106.8], [-96.208], [0.76]]);
        
        assert(expectedCoeffs.allClose(coeffs));
        assert(expectedYs.allClose(ys));
    },
    
    testForwardSubstitution: function() {
        var coeffs = new Matrix([[1,    0,   0], 
                                 [2.56, 1,   0], 
                                 [5.76, 3.5, 1]]);
        var ys = new Matrix([[1], [0], [0]]);
        
        var x = linalg.forwardSubstitution(coeffs, ys);
        
        var expectedXs = new Matrix([[1], [-2.56], [3.2]]);
        
        assert(expectedXs.allClose(x));
    },
    
    testForwardSubstitutionInplace: function() {
        var coeffs = new Matrix([[1,    0,   0], 
                                 [2.56, 1,   0], 
                                 [5.76, 3.5, 1]]);
        var ys = new Matrix([[1], [0], [0]]);
        
        var x = linalg.forwardSubstitution(coeffs, ys, true);
        
        var expectedXs = new Matrix([[1], [-2.56], [3.2]]);
        
        assert(expectedXs.allClose(x));
        assert(x === ys);
    },
    
    testBackwardSubstitution: function() {
        var coeffs = new Matrix([[25,   5,     1], 
                                 [0, -4.8, -1.56], 
                                 [0,    0,   0.7]]);
        var ys = new Matrix([[106.8], [-96.208], [0.76]]);
        
        var x = linalg.backwardSubstitution(coeffs, ys);
        
        var expectedXs = new Matrix([[0.2904761904761904],
                                     [19.69047619047619],
                                     [1.0857142857142859]])
        
        assert(expectedXs.allClose(x));
    },
    testBackwardSubstitutionInplace: function() {
        var coeffs = new Matrix([[25,   5,     1], 
                                 [0, -4.8, -1.56], 
                                 [0,    0,   0.7]]);
        var ys = new Matrix([[106.8], [-96.208], [0.76]]);
        
        var x = linalg.backwardSubstitution(coeffs, ys, true);
        
        var expectedXs = new Matrix([[0.2904761904761904],
                                     [19.69047619047619],
                                     [1.0857142857142859]])
        
        assert(expectedXs.allClose(x));
        assert(x === ys);
    },
    
    testColumn: function() {
        var m = new Matrix([[1, 5, 9],
                            [2, 6, 8],
                            [3, 7, 7],
                            [4, 8, 6]]);
        assert(m.column(0).equals(new Matrix([1,2,3,4])));
        assert(m.column(1).equals(new Matrix([5,6,7,8])));
        assert(m.column(2).equals(new Matrix([9,8,7,6])));    
                                 
    },
    
    testInverse: function() {
        var matrix = new Matrix([[25, 5, 1], 
                                 [64, 8, 1], 
                                 [144, 12, 1]]);
                                 
        var expectedInverse = new Matrix([[ 0.04761905, -0.08333333,  0.03571429],
                                          [-0.95238095,  1.41666667, -0.46428571],
                                          [ 4.57142857, -5.        ,  1.42857143]]);
         
        console.log(expectedInverse.toString());
        console.log(matrix.inverse().toString());
        assert(matrix.inverse().allClose(expectedInverse));
    },
    testInverseOfSingular: function() {
        var matrix = new Matrix([[1, 1, 1], 
                                 [2, 2, 2], 
                                 [3, 3, 3]]);
        var res = matrix.inverse();
        try {
            matrix.inverse(); //should throw a meaningful exception
            assert(false); //shouldn't get here
        } catch (e) {
            if (e instanceof AssertionError) throw e;
        }
    },
    testInverseRequiringRowSubstitution: function() {
        var matrix = new Matrix([[1, 1, 1], 
                                 [0, 0, 7], 
                                 [4, 3, 3]]);
       var expectedInverse = new Matrix([[-3.,  0.        ,  1.],
                                         [ 4., -0.14285714, -1.],
                                         [ 0.,  0.14285714,  0.]])
                                         
        console.log(expectedInverse.toString());
        console.log(matrix.inverse().toString());
        assert(matrix.inverse().allClose(expectedInverse));
    },
    testAllCloseWithInfinities: function() {
        var matrix = new Matrix([[1, 1], 
                                 [Infinity, -Infinity]]);
        var matrix2 = new Matrix([[1, 1], 
                                 [-Infinity, -Infinity]]);
        assert(!matrix.allClose(matrix2))
    },
    testAllCloseWithNaNs: function() {
        var matrix = new Matrix([[1, 1], 
                                 [NaN, 0]]);
        var matrix2 = new Matrix([[1, 1], 
                                 [1, 0]]);
        assert(!matrix.allClose(matrix2))
    },
    testDeterminant: function() {
        var arr = new Matrix([[100, 80, 60, 40], 
                              [80, 40, 30, 20], 
                              [60, 20, 0, 0], 
                              [40, 30, 20, 0]]);
                              
        assert(arr.determinant() === -480000)
        
        assert(new Matrix([[ 5, 3],
                           [-1, 4,]]).determinant() === 23);        
    },
    testDeterminant2: function() {
        var arr = new Matrix([[100, 80, 60, 40], 
                              [80, 40, 30, 20], 
                              [60, 20, 0, 0], 
                              [0, 0, 0, 0]]);
                              
        assert(arr.determinant() === 0)    
    },
    testFrobeniusNorm: function() {
        var arr = new Matrix([[100, 80, 60, 40], 
                              [80, 40, 30, 20], 
                              [60, 20, 0, 0], 
                              [40, 30, 20, 0]]);
                              
        assert(arr.norm() === 194.4247926577266534); 
    },
    testTranspose: function() {
        var a = new Matrix([[1, 2, 3, 4, 5],
                            [2, 3, 4, 5, 6],
                            [7, 8, 9, 1, 2],
                            [8, 9, 1, 2, 3]]);
                            
        var t = new Matrix([[1, 2, 7, 8],
                            [2, 3, 8, 9],
                            [3, 4, 9, 1],
                            [4, 5, 1, 2],
                            [5, 6, 2, 3]])
        assert(a.transpose().equals(t));
    }
}

for (var test in tests) {
    try {
        tests[test]();
        console.log("Passed " + test);
    } catch (e) {
        console.error("Failed " + test, e.stack || e);
    }
}