import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { base64imgdefault1 } from '../singup/base64imgdefault1';
import { FotografiaService } from '../../services/fotografia.service';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent implements OnInit {

  cardImageBase64:any = '';
  imagedefault_:base64imgdefault1 = new base64imgdefault1();
  user: any = {
    username: '  username',
    nombre: '  nombre',
    password: 'password',
    repassword: 'repassword',
    foto: ''
  };

  constructor(private router: Router, private fotografiaService: FotografiaService) 
  { 
    // ノート：　ここに　codigo que se debe remplazar por codigo de servicios
    // --> obtencion de datos de usuario
    // this.user.foto = this.imagedefault_.cardImageBase64_riley;
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

  ngOnInit(): void {
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

}
