import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // ulgramgif.gif
  user: any = {
    email: '',
    password: '',
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
