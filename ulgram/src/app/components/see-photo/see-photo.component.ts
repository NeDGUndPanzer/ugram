import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FotografiaService } from 'src/app/services/fotografia.service';

@Component({
  selector: 'app-see-photo',
  templateUrl: './see-photo.component.html',
  styleUrls: ['./see-photo.component.css']
})
export class SeePhotoComponent implements OnInit {

  user: any = {
    username: '',
    nombre: '',
    password: '',
    repassword: '',
    foto: ''
  };

  imgurl = "";
  album = "";
  desc = "";
  nombre = "";

  constructor(private activateRoute: ActivatedRoute,private router: Router, private fotografiaService: FotografiaService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getSesionVariables();
    this.cargar();
  }

  cargar(){
    const parametros = this.activateRoute.snapshot.params;
    if(parametros.codigo){
      this.fotografiaService.getImageInfo({url:parametros.codigo.toString().split("idf")[1]}).subscribe(
        res =>{
          let response:any = res;
          this.imgurl = response.imgurl;
          this.album = response.album;
          this.nombre = response.nombre;
          this.desc = response.descripcion;
          
        }, error =>{
          console.log(error);
        });
    }
    else{
      alert('Error al cargar la imagen');
      this.router.navigate(['/catologo']);
    }
  }
  getSesionVariables(){
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
 

}
