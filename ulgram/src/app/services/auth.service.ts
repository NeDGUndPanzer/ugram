import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import ip from './IP';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(usuario: any)
  {
    return this.http.post(ip + 'users/login', usuario);  
  }

}
