import { Component, HostBinding, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { base64imgdefault1 } from '../singup/base64imgdefault1';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {

  cardImageBase64:any = '';
  imagedefault_:base64imgdefault1 = new base64imgdefault1();
  user: any = {
    username: '',
    nombre: '',
    password: '',
    repassword: '',
    foto: '',
    labels: ''
  };

  theuser:any;

  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService) 
  { 
    // ノート：　ここに　codigo que se debe remplazar por codigo de servicios
    // --> obtencion de datos de usuario
    // this.user.foto = this.imagedefault_.cardImageBase64_riley;
    /*let s3 = { id: "riley_1"};
    this.fotografiaService.obtener_foto_directoS3(s3).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        this.user.foto = "data:image/jpeg;base64," + respuesta.mensaje;
      },
      error =>{ console.log(error) 
    });*/

    this.getSesionVariables();
    this.obtenerFotoPerfil();
  }

  ngOnInit(): void {
  }
  
  getSesionVariables()
  {
    let sesion:any = JSON.parse(localStorage.getItem("currentUser") || '{}');
    console.log(sesion.username);
    this.user.username = sesion.username;
    this.authService.getuserData(this.user).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        this.user.foto = respuesta.foto;
        this.user.nombre = respuesta.name;
      },
      error =>{ console.log(error) 
    });
  }

   /**
  * GOTOs
  */

 goto_paginainicio()
 {
   this.router.navigate(['/inicio']);
 }

 goto_editarperfil()
 {
   this.router.navigate(['/editarperfil']);
 }

 goto_loginl()
 {
   this.router.navigate(['/login']);
 } 

 goto_editaralbum()
 {
   this.router.navigate(['/editaralbum']);
 }

 goto_Catalogo()
 {
   this.router.navigate(['/catologo']);
 }

 goto_upload()
 {
   this.router.navigate(['/upload']);
 }

 goto_texto()
 {
   this.router.navigate(['/texto']);
 }

 /* SEGNDA FASE */

 obtenerFotoPerfil()
  {
    this.authService.getuserData(this.user).subscribe(
      res => {
        //console.log(res);
        let respuesta:any = res;
        this.user.foto = respuesta.foto;
        this.user.nombre = respuesta.name;
        this.getFotoPerfilLabels();
      },
      error =>{ console.log(error) 
    });
  }

 getFotoPerfilLabels()
 {
    let imgurl = {imagen:String(this.user.foto)};
    let img1 = "";
    this.fotografiaService.service_getBASE64(imgurl).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        this.user.fotoperfil64 = respuesta.base64;
        this.getFotoPerfilLabels_();
      },
      error =>{ console.log(error) 
    });
 }

 getFotoPerfilLabels_()
 {
  //service_getLabels
  let imgurl = {imagen:String( this.user.fotoperfil64 )};
  this.fotografiaService.service_getLabels(imgurl).subscribe(
    res => {
      console.log(res);
      let respuesta:any = res;
      console.log(respuesta.etiquetas.length);
      this.user.labels = 'Etiquetas:';
      for (let index = 0; index < respuesta.etiquetas.length; index++) {
        const element = respuesta.etiquetas[index];
        console.log(element.Name);
        this.user.labels = this.user.labels + "\n" + "[" + String(index + 1) + "]" + String(element.Name);
        if(index == 4){ break; }
      }
      
    },
    error =>{ console.log(error) 
  });
 }

}
