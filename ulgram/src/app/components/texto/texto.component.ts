import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { base64imgdefault1 } from '../singup/base64imgdefault1';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-texto',
  templateUrl: './texto.component.html',
  styleUrls: ['./texto.component.css']
})
export class TextoComponent implements OnInit {

  namesToDisplay:any;
  biosToDisplay:any;
  isCollapsed = true;
	imageError:any;
	isImageSaved:any;
  cardImageBase64:any = '';
  imagedefault_:base64imgdefault1 = new base64imgdefault1();

  pic: any = {
    base64: '',
    nombre: '',
    album: '',
    username: ''
  };

  user: any = {
    username: '  username',
    nombre: '  nombre',
    password: 'password',
    repassword: 'repassword',
    foto: '',
    descripcion: '',
    texto: ''
  };

  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService) 
  { 
    this.pic.base64 = this.imagedefault_.cardImageBase64;
    //this.prepararHeader();
    this.getSesionVariables();
  }

  ngOnInit(): void {
  }

  prepararHeader()
  {
    // Cargar imagen de perfil flotante
    let s3 = { id: "riley_1"};
    this.fotografiaService.obtener_foto_directoS3(s3).subscribe(
      res => {
        console.log(res);
        let respuesta:any = res;
        this.user.foto = "data:image/jpeg;base64," + respuesta.mensaje;
      },
      error =>{ console.log(error) 
    });
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
        };
		  };
	
		  reader.readAsDataURL(fileInput.target.files[0]);
		}

    return true;
	}

  picfoto: any = {
    username: '',
    albumname: '',
    imgurl: '',
    picname:'',
    lalbumnes: []
  }; //mcalbum1
  subirFoto()
  {
    let fotoaux = this.cardImageBase64;
    let foto_ = fotoaux.replace("data:image/jpeg;base64,", "");
    let fotografia = { foto: foto_ };
    console.log(fotografia)
    this.fotografiaService.service_detectartexto(fotografia).subscribe(
      res => {
        const foto_aux:any = res;
        let respuesta:any = res;
        console.log(foto_aux)
        this.user.texto = 'Texto:';
        for (let index = 0; index < respuesta.texto.length; index++) {
          const element = respuesta.texto[index];
          console.log(element.DetectedText);
          this.user.texto = this.user.texto + "\n" + "[" + String(index + 1) + "]" + String(element.DetectedText);
        }
      },
      error =>{ console.log(error) 
    });
    
  }

  texto()
  {
    //
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
