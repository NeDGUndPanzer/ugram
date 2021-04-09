import { Component, HostBinding, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { base64imgdefault1 } from '../singup/base64imgdefault1';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  user: any = {
    username: '',
    nombre: '',
    password: '',
    repassword: '',
    foto: ''
  };

  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService)  
  { 
    //this.getmclovin();
    this.getSesionVariables();

    this.getuseralbums();
    
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

  getmclovin()
  {
    let s3 = { username: "mclove", album: "mcalbum1"};
    console.log(s3)
    this.fotografiaService.service_getFotosAlbum(s3).subscribe(
      res => {
        console.log(res);
      },
      error =>{ console.log(error) 
    });
  }

  /**
   *  Algortimo para mostrar el catologo 
   *  01. tener listo el username
   *  02. obtener todos los albumnes a partir del username
   *  03. recorrer los almbunes haceidno match con el username
  */
  
  public catalogo:any = [];
  showCatalog()
  {
    /* 01. tener listo el username */
    console.log("username -> " + this.user.username);

    /* 02. obtener todos los albumnes a partir del username */
    console.log("albunes -> " + this.albunes);
    console.log(this.albunes);

    /* 03. recorrer los almbunes haceidno match con el username */
    for (let i = 0; i < this.albunes.length; i++) 
    {
      const element = this.albunes[i];
      const albumaux = element;
      let s3 = { username: this.user.username, album: element}
      this.fotografiaService.service_getFotosAlbum(s3).subscribe(
        res => {
            let miarray:Array<any> = []; 
            const aux:any = res;
            this.albunes_aux = aux.fotos.toString();
            let cadenaux:any = this.albunes_aux.split("bokunopico");
            for (let index = 0; index < cadenaux.length; index++) {
              const element = cadenaux[index];
              miarray.push(element);
            
              let foto:any = { album:  albumaux, foto: element, id: "idf"+element};
              this.catalogo.push(foto);
            }
            this.catalogo.pop();
        },
        error =>{ console.log(error) 
      }); 
    }

    console.log("el catalogo quedo como: ");
    console.log(this.catalogo);

  }

  public albunes:any;
  public albunes_aux:any;
  public getuseralbums()
  {
    this.fotografiaService.service_getuseralbums(this.user).subscribe(
      res => {
        let miarray:Array<any> = []; 
        const aux:any = res;
        this.albunes_aux = aux.albumnes.toString();
        let cadenaux:any = this.albunes_aux.split("bokunopico");
        for (let index = 0; index < cadenaux.length; index++) {
          const element = cadenaux[index];
          miarray.push(element);
        }
        miarray.pop();
        this.albunes = miarray;
        this.showCatalog();
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
 

}
