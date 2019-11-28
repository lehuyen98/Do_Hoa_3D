var txtTransOy;
var txtTransOx;
var txtTransOz;
var angle_input;
var txtScaleX;
var txtScaleY;
var txtScaleZ;
function changeRotateSpeed(angleStep1) {
    angleStep = parseFloat(angleStep1);
}

function changeRotate(angle1){
    angle = angle1;
    reload();
}

function changeRotate0x(x){
    rotateCordinate[0] = x;
    reload();
}

function changeRotate0y(y){
    rotateCordinate[1] = y;
    reload();
}

function changeRotate0z(z){
    rotateCordinate[2] = z;
    reload();
}

function rotateContinuesly(isRotate){
    var rotateAnimate = document.getElementById('rotateAnimate');
    if(isRotate){
        angle_input.value = "This is disabled";
        angleStep = 0.1;
        rotateAnimate.style.display = "block";
    }
    else{
        angle_input.value = "";
        angleStep = 0.0;
        rotateAnimate.style.display = "none";
    }
    angle_input.disabled = isRotate;
}

function changeStatus(isChecked){
    var hiddenAnimate = document.getElementById('hiddenAnimate');
    
    if(isChecked){
        console.log("The cubic rotate continuesly");
        tick();
        hiddenAnimate.style.display = "inline-block";
    }
    else{
        console.log("The cubic rotate normaly");
        cancelAnimationFrame(requestAnimationFrameID);
        hiddenAnimate.style.display = "none";
    }
    
}

function changeTxValue(Tx){
    trans[0] = Tx ;
    reload();
}

function changeTyValue(Ty){
    trans[1] = Ty;
    reload();
}

function changeTzValue(Tz){
    trans[2] = Tz;
    reload();
}

function changeSxValue(Sx){
    scale[0] = Sx;
    if(scale[0]==0) scale[0] = 1;
    reload();
}

function changeSyValue(Sy){
    scale[1] = Sy;
    if(scale[1]==0) scale[1] = 1;
    reload();
}

function changeSzValue(Sz){
    scale[2] = Sz;
    if(scale[2]==0) scale[2] = 1;
    reload();
}

function changeExValue(ex){
    eye[0] = ex;
    reload();
}

function changeEyValue(ey){
    eye[1] = ey;
    reload();
}

function changeEzValue(ez){
    eye[2] = ez;
    reload();
}

function changeAxValue(ax){
    at[0] = ax;
    reload();
}

function changeAyValue(ay){
    at[1] = ay;
    reload();
}

function changeAzValue(az){
    at[2] = az;
    reload();
}

function changeUxValue(ux){
    up[0] = ux;
    reload();
}

function changeUyValue(uy){
    up[1] = uy;
    reload();
}

function changeUzValue(uz){
    up[2] = uz;
    reload();
}

function transContinuesly(isTrans){
    var transAnimate = document.getElementById('transAnimate');
    if(isTrans){
        trans_step[0] = 0.01;
        txtTransOx.value = trans[0];
        txtTransOy.value = trans[1];
        txtTransOz.value = trans[2];
        transAnimate.style.display = "block";
    }
    else{
        trans_step[0] = 0.0;
        trans_step[1] = 0.0;
        trans_step[2] = 0.0;
        transAnimate.style.display = "none";
    }
    txtTransOx.disabled = isTrans;
    txtTransOy.disabled = isTrans;
    txtTransOz.disabled = isTrans;
}

function transCorX(transX){
    trans_step[0] = parseFloat(transX);
}

function transCorY(transY){
    trans_step[1] = parseFloat(transY);
}

function transCorZ(transZ){
    
    trans_step[2] = parseFloat(transZ);
}

function changeScaleMax(max){
    scale_max = max;
}

function changeScaleMin(min){
    scale_min = min;
}

function scaleContinuesly(isScale){
    var scaleAnimate = document.getElementById('scaleAnimate');
    if(isScale){
        scale_step[0] = -0.01;
        scale_step[1] = -0.01;
        scale_step[2] = -0.01;
        scaleAnimate.style.display = "block";
    }
    else{
        scale_step[0] = 0;
        scale_step[1] = 0;
        scale_step[2] = 0;
        scale[0] = 1.0;
        scale[1] = 1.0;
        scale[2] = 1.0;
        scaleAnimate.style.display = "none";
    }
    txtScaleX.disabled = isScale;
    txtScaleY.disabled = isScale;
    txtScaleZ.disabled = isScale;

}

function changeFovValue(f){
    fov = parseInt(f);
    reload();
}

function changeAspectValue(a){
    aspect = parseInt(a);
    reload();
}

function changeNearValue(n){
    near = parseInt(n);
    reload();
}

function changeFarValue(f){
    far = parseInt(f);
    reload();
}

function reload(){
    var mtrx_mvp = new Matrix4();
    mtrx_mvp.setPerspective(fov, aspect, near, far);
    mtrx_mvp.lookAt(eye[0], eye[1], eye[2], at[0], at[1], at[2], up[0], up[1], up[2]);
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    gl.uniformMatrix4fv(u_MvpMatrix, false, mtrx_mvp.elements);

    var u_Change = gl.getUniformLocation(gl.program, 'u_Change');
    var mtrx_Change1 = new Matrix4();
    mtrx_Change1.setTranslate(trans[0], trans[1], trans[2]);
    mtrx_Change1.rotate(angle,rotateCordinate[0], rotateCordinate[1], rotateCordinate[2]);
    mtrx_Change1.scale(scale[0], scale[1], scale[2]);
    gl.uniformMatrix4fv(u_Change, false, mtrx_Change1.elements);
    
    //Thiet lap mau nen 
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}