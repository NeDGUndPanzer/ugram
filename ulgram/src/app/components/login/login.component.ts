import { Component, OnInit, ViewChild, ElementRef, asNativeElements, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';
import {Subject, Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import html2canvas from "html2canvas";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /*@ViewChild("video") 
  public video: any;

  @ViewChild("canvas")
  public canvas: any;

  public captures: Array<any>;

  // pureba con lo de bito
  video_bito = document.querySelector("#video");
  */

  /********************** */

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  //public webcamImage: WebcamImage = null;
  public pictureTaken = new EventEmitter<WebcamImage>();

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  /********************** */

  // ulgramgif.gif
  user: any = {
    username: '',
    password: '',
    nombre: '',
    foto: '',
    fotoperfil64: '',
    fotocomparativa: ''
  };
  

  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService)  {
    //this.webcamImage = null;
    //let loginplus:any = localStorage.getItem('loginplus') //JSON.parse(localStorage.getItem("loginplus") || '{}');
    //console.log(loginplus);
  }

  ngOnInit(): void {
    
  }

  logear()
  {
    console.log(this.user)
    this.authService.login(this.user).subscribe(
      res => {
        console.log(res);
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        this.router.navigate(['/inicio']);
      },
      error =>{ console.log(error) 
    });
  }

  goto_singup()
 {
   this.router.navigate(['/singup']);
 }


  public handleImage(webcamImage: WebcamImage): void 
  {
  
  console.log('received webcam image', webcamImage);
  //this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void 
  {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public handleInitError(error: WebcamInitError): void 
  {
    this.errors.push(error);
  }

  public triggerSnapshot(): void 
  {
    this.trigger.next();
    this.crearImagen()
  }


  crearImagen() {
    let element = document.getElementById('app');
    /*html2canvas(element).then(canvas => {
 
      console.log(canvas.toDataURL())
 
    });*/
    html2canvas(element || document.body).then(function (canvas) {
      var imgData = canvas.toDataURL("image/png");
      console.log(canvas.toDataURL("image/png"))
      });
  }

  /** ---------------------------------------------------------------------------------------
   * Codigo para login webcam
   * ----------------------------------------------------------------------------------------
   */

  comparar()
  {
    this.authService.getuserData(this.user).subscribe(
      res => {
        //console.log(res);
        let respuesta:any = res;
        this.user.foto = respuesta.foto;
        this.user.nombre = respuesta.name;
        this.comparar_();
      },
      error =>{ console.log(error) 
    });
  }

  comparar_()
  {
    /*console.log(this.user); //fotocomparativa
    console.log('foto de perfil: ' + this.user.foto)
    console.log('foto de comparacion: ' + this.user.fotocomparativa)*/ 

    let imgurl = {imagen:String(this.user.foto)};
    let img1 = "";
    this.fotografiaService.service_getBASE64(imgurl).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        this.user.fotoperfil64 = respuesta.base64;
        this.comparar__();
      },
      error =>{ console.log(error) 
    });

    /*var str_img1 = String(this.user.foto); 
    var splitted_img1 = str_img1.split("data:image/jpeg;base64,"); 

    var str_img2 = String(this.user.fotocomparativa); 
    var splitted_img2 = str_img2.split("data:image/png;base64,"); 
    
    let fotos:any = { imagen1: String(this.user.foto), imagen2: String( splitted_img2[1] )};
    console.log(this.user.foto)
    this.fotografiaService.service_compararFotos(fotos).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        console.log(respuesta.Comparacion[0].Similarity)
      },
      error =>{ console.log(error) 
    });*/
  }

  comparar__()
  {
    var str_img2 = String(this.user.fotocomparativa); 
    var splitted_img2 = str_img2.split("data:image/png;base64,"); 
    
    let fotos:any = { imagen1: String(this.user.fotoperfil64), imagen2: String( splitted_img2[1] )};
    this.fotografiaService.service_compararFotos(fotos).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        try {
          console.log(respuesta.Comparacion[0].Similarity);
          if(Number(respuesta.Comparacion[0].Similarity) > 80)
          {
            // dejar pasar
            localStorage.setItem('currentUser', JSON.stringify(this.user));
            this.router.navigate(['/inicio']);
          }
        } catch (error) {
          alert("No coinciden las fotos, no se puede entrar");
        }
      },
      error =>{ console.log(error) 
    })
  }

  

}
