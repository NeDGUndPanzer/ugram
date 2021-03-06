import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { base64imgdefault1 } from '../singup/base64imgdefault1';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {

  namesToDisplay:any;
  biosToDisplay:any;
  isCollapsed = true;
	imageError:any;
	isImageSaved:any;
  imagedefault_:base64imgdefault1 = new base64imgdefault1();
  cardImageBase64:any = '';

  user: any = {
    username: '',
    nombre: '',
    password: '',
    repassword: '',
    foto: ''
  };

  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService)
  { 
    //this.cardImageBase64 = this.imagedefault_.cardImageBase64_riley;
    //this.user.foto = this.imagedefault_.cardImageBase64_riley;
    this.getSesionVariables();
  }

  ngOnInit(): void {
  }

  getSesionVariables()
  {
    let sesion:any = JSON.parse(localStorage.getItem("currentUser") || '{}');
    console.log(sesion.username);
    this.user.username = sesion.username;
    this.user.password = sesion.password;
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

  /* SOPORTE PARA CARGA DE IMAGENES */

  fileChangeEvent(fileInput: any) 
  {
		this.imageError = null;

		if (fileInput.target.files && fileInput.target.files[0]) 
    {
		  // Size Filter Bytes
		  const max_size = 20971520;
		  const allowed_types = ['image/png', 'image/jpeg'];
		  const max_height = 15200;
		  const max_width = 25600;
	
		  if (fileInput.target.files[0].size > max_size) 
      {
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
        return false;
		  }
	
		  if (!allowed_types.includes(fileInput.target.files[0].type)) 
      {
        this.imageError = 'Solo se aceptan imágenes ( JPG | PNG | JPEG )';
        return false;
		  }

		  const reader = new FileReader();
		  reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => 
        {
          const imgBase64Path = e.target.result;
          this.cardImageBase64 = imgBase64Path;
          this.isImageSaved = true;
          //console.log(this.cardImageBase64)
        };
		  };
	
		  reader.readAsDataURL(fileInput.target.files[0]);
		}

    return true;
	}

  /* SOPORTE PARA CREACION DE USUARIOS */
  
  editar()
  {
    this.user.foto = this.cardImageBase64;
    console.log(this.user);

    /*****************************************************
     * subir imagen
    */

   let fotoaux = this.cardImageBase64;
   let foto_ = fotoaux.replace("data:image/jpeg;base64,", "");
   
   // primer paso: subir foto a S3
   let fotografia = { foto: foto_ };
   this.fotografiaService.service_upload_singup(fotografia).subscribe(
     res => {
       console.log(res);
       const foto_aux:any = res;
       let foto_aux_:any = 'https://practica1-g21-imagenes.s3.us-east-2.amazonaws.com/Fotos_Perfil/';
       foto_aux_ = foto_aux_ + foto_aux.idfoto + '.jpg';
       console.log(foto_aux_)
       this.user.foto = foto_aux_;
       console.log(this.user)
     },
     error =>{ console.log(error) 
   });

    /*****************************************************
     * modificar
    */

    console.log('Antes de update:')
    console.log(this.user)
   this.authService.updateUser(this.user).subscribe(
    res => {
      console.log(res);
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
