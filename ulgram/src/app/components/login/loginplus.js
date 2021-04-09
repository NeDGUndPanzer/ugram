const http = new XMLHttpRequest()

var video = document.querySelector("#Camara");
 if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Error:"+err0r);
        });
 }

 function capture() {    
    var resultb64="";    
    var canvas = document.getElementById('canvas');     
    var video = document.getElementById('Camara');
    canvas.width = 500;
    canvas.height = 500;
    canvas.getContext('2d').drawImage(video, 0, 0, 500,500);  
    resultb64=canvas.toDataURL();
    document.getElementById("printresult").innerHTML = canvas.toDataURL();
    document.getElementById("printresult").innerHTML = resultb64;
    var base64 = { foto: resultb64 }
    //localStorage.setItem('loginplus', JSON.stringify(base64));
    console.log(base64);

    localStorage.setItem('loginplus', resultb64);

    var codigoACopiar = resultb64;
    //var seleccion = document.createRange();
    //seleccion.selectNodeContents(codigoACopiar);
    window.getSelection().removeAllRanges();
    //window.getSelection().addRange(seleccion);
    var res = document.execCommand('copy');
    //window.getSelection().removeRange(seleccion);
 }