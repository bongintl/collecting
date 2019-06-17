var createBuffer = require('gl-buffer');
var createVAO = require('gl-vao');

module.exports = function fillScreenForever ( gl ) {
    
    var buffer = createBuffer(gl, new Float32Array([-1, -1, -1, 4, 4, -1]))
    
    var vao = createVAO(gl, [
      { buffer,
        type: gl.FLOAT,
        size: 2
      }
    ]);
    
    vao.bind();
    
    return function () {
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    
}

// function createABigTriangle(gl) {
  
//   var triangleVAO = TriangleCache.get(gl)
//   var handle = triangleVAO && (triangleVAO._triangleBuffer.handle || triangleVAO._triangleBuffer.buffer)
//   if(!handle || !gl.isBuffer(handle)) {
//     var buf = createBuffer(gl, new Float32Array([-1, -1, -1, 4, 4, -1]))
//     triangleVAO = createVAO(gl, [
//       { buffer: buf,
//         type: gl.FLOAT,
//         size: 2
//       }
//     ])
//     triangleVAO._triangleBuffer = buf
//     TriangleCache.set(gl, triangleVAO)
//   }
//   triangleVAO.bind()
//   gl.drawArrays(gl.TRIANGLES, 0, 3)
//   triangleVAO.unbind()
// }

// module.exports = createABigTriangle
