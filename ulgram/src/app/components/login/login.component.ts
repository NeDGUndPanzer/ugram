import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild("video")
  public video: any ;

  @ViewChild("canvas")
  public canvas: any;

  public captures: Array<any>;

  // ulgramgif.gif
  user: any = {
    username: '',
    password: '',
    nombre: '',
    foto: ''
  };
  
  constructor(private router: Router, private fotografiaService: FotografiaService, private authService: AuthService)  {
    this.captures = [];
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

 public ngAfterViewInit() {
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.nativeElement.src = window.URL.createObjectURL(stream);
          this.video.nativeElement.play();
      });
  }
}

public capture() {
  var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
  this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  console.log(this.canvas.nativeElement.toDataURL("image/png"))
}

}
