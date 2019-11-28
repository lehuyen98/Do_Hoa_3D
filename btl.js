// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float a_PointSize;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n'+
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_Change;\n' +
  'uniform vec3 u_LightColor;\n' + 
  'uniform vec3 u_LightDirection;\n' + 
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix*u_Change*a_Position;\n' +
  // '  gl_PointSize = 10.0;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  // 'uniform vec4 u_color;\n'+
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';


//Goc xoay
var angle = 0.0;
//Bien dich chuyen
var trans = [0.0, 0.0, 0.0];
//Bien co dan
var scale = [1.0,1.0,1.0];
//Mat nhin
var eye = [3, 3, 7];
//Diem nhin
var at = [0, 0, 0];
//Huong dinh dau
var up = [0, 1, 0];
//Toc do xoay
var angleStep = 0.0;
//Truc xoay
var rotateCordinate = [0.0, 0.0, 1.0];
//Toc do tinh tien
var trans_step = [0.0, 0.0, 0.0];
//Toc do co dan
var scale_step = [0.0, 0.0, 0.0];
scale_max = 1.0;
scale_min = 0.0;
//fov
var fov = 30;
//aspect
var aspect = 1;
//near
var near = 1;
//far
var far = 100;
// id of animation 
var requestAnimationFrameID;

//animation function variable
var tick;

//gl
var gl;

//
var n;

function main() {
  t = document.getElementById("#tx");
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //Value
  txtTransOy = document.getElementById("txtTransOy");
  txtTransOx = document.getElementById("txtTransOx");
  txtTransOz = document.getElementById("txtTransOz");
  angle_input = document.getElementById("angle");
  txtScaleX = document.getElementById("txtScaleX");
  txtScaleY = document.getElementById("txtScaleY");
  txtScaleZ = document.getElementById("txtScaleZ");
  //Buffer 
  n = initVertexBuffers(gl);

  if(n<1){
    console.log('Fail to '+n);
    return;
  }

  //Ma tran dich chuyen, quay , scale
  var u_Change = gl.getUniformLocation(gl.program, 'u_Change');
  var mtrx_Change = new Matrix4();
  mtrx_Change.setTranslate(trans[0], trans[1], trans[2]);
  mtrx_Change.rotate(angle,0.0, 0.0, 1.0);
  mtrx_Change.scale(scale[0], scale[1], scale[2]);
  gl.uniformMatrix4fv(u_Change, false, mtrx_Change.elements);

  //Huong nhin
  var mtrx_mvp = new Matrix4();
  mtrx_mvp.setPerspective(fov, aspect, near, far);
  mtrx_mvp.lookAt(eye[0], eye[1], eye[2], at[0], at[1], at[2], up[0], up[1], up[2]);
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  gl.uniformMatrix4fv(u_MvpMatrix, false, mtrx_mvp.elements);

  //Thiet lap mau nen 
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  //Ve 
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  tick = function() {
    animate();  // Cap nhat 
    draw(gl, n, trans,scale, angle, mtrx_Change, u_Change);   // Draw the triangle
    requestAnimationFrameID = requestAnimationFrame(tick, canvas);   // Request that the browser ?calls tick
  };
  
}

function initVertexBuffers(gl){
  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
    1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
  -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
  -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
    1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
  ]);

  var colors = new Float32Array([     // Colors
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
    0.4, 0.4, 1.0,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
    0.4, 0.4, 1.0,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  0.4, 0.4, 1.0,  // v0-v5-v6-v1 up(red)
    0.4, 0.4, 1.0,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
  ]);


  var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // up
   12,13,14,  12,14,15,    // left
   16,17,18,  16,18,19,    // down
   20,21,22,  20,22,23     // back
  ]);

  var indexBuffer = gl.createBuffer();
  if(!indexBuffer){
    console.log('Failed to create buffer');
    return -1;
  }

  if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')){
    console.log('Failed to create position buffer');    
    return -1;
  }  

  if(!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')){
    console.log('Failed to create color buffer');    
    return -1;
  }  

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, data, n , type, name){
  var buffer = gl.createBuffer();
  if(!buffer) {
    console.log('Failed to create buffer');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  var a_attribute = gl.getAttribLocation(gl.program, name);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of '+name);
    return false;
  }

  gl.vertexAttribPointer(a_attribute, n, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

//Ham ve lien tuc 
function draw(gl, n, trans,scale, angle, mtrx_Change, u_Change) {
  // Set the change matrix
  mtrx_Change.setTranslate(trans[0], trans[1], trans[2]);
  mtrx_Change.rotate(angle, rotateCordinate[0], rotateCordinate[1], rotateCordinate[2]);
  mtrx_Change.scale(scale[0], scale[1], scale[2]);

  // mtrx_Change.setRotate(angle, 0.0, 0.0, 1.0);
  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_Change, false, mtrx_Change.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

// Last time that this function was called
var g_last = Date.now();


var isRight = true;

function animate() {
  angle = (angle + angleStep)%360;
  
  trans[0] = (trans[0]+trans_step[0]);
  trans[1] = (trans[1]+trans_step[1]);
  trans[2] = (trans[2]+trans_step[2]);
  
  scale[0] = scale[0] + scale_step[0];
  scale[1] = scale[1] + scale_step[1];
  scale[2] = scale[2] + scale_step[2];
  
  if(trans[0]>=1 || trans[1]>=1 || trans[2]>=1 ||
    trans[0]<=-1 || trans[1]<=-1 || trans[2]<=-1
    ){
    trans_step[0] = -1 * trans_step[0];
    trans_step[1] = -1 * trans_step[1];
    trans_step[2] = -1 * trans_step[2];
  }
  
  if(scale[0]>=scale_max || scale[0]<=scale_min||
    scale[1]>=scale_max || scale[1]<=scale_min||
    scale[2]>=scale_max || scale[2]<=scale_min){
      scale_step[0] = -1 * scale_step[0];
      scale_step[1] = -1 * scale_step[1];
      scale_step[2] = -1 * scale_step[2];
  }
  updateInfo();
  return;
}

function updateInfo(){
  angle_input.value = angle;
  txtTransOx.value = trans[0];
  txtTransOy.value = trans[1];
  txtTransOz.value = trans[2];
  txtScaleX.value = scale[0];
  txtScaleY.value = scale[1];
  txtScaleZ.value = scale[2];
}
