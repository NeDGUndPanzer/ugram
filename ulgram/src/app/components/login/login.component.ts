import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FotografiaService } from '../../services/fotografia.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // ulgramgif.gif
  user: any = {
    username: '',
    password: '',
    nombre: '',
    foto: ''
  };
  
  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService)  { }

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


}
