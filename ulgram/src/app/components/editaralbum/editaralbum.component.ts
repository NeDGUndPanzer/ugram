import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { base64imgdefault1 } from '../singup/base64imgdefault1';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editaralbum',
  templateUrl: './editaralbum.component.html',
  styleUrls: ['./editaralbum.component.css']
})
export class EditaralbumComponent implements OnInit {

  cardImageBase64:any = '';
  imagedefault_:base64imgdefault1 = new base64imgdefault1();
  user: any = {
    username: '  username',
    nombre: '  nombre',
    password: 'password',
    repassword: 'repassword',
    foto: ''
  };

  lista_deAlbumnes:any = { "almunes": [ "Ford", "BMW", "Fiat" ] };

  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService) 
  { 
    // ノート：　ここに　codigo que se debe remplazar por codigo de servicios
    // --> obtencion de datos de usuario
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
  
  /*****************************************************************************
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

}
