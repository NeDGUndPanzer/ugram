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
    return this.http.post(ip + 'iniciarSesion', usuario);  
  }

  registrar(foto_data: any)
  {
    return this.http.post(ip + 'registrar', foto_data); 
  }

  getuserData(foto_data: any)
  {
    return this.http.post(ip + 'getuserdata', foto_data); 
  }

  updateUser(data: any)
  {
    return this.http.post(ip + 'update', data); 
  }


}
