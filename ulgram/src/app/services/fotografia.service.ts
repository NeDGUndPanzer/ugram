import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http' 
import ip from './IP';

@Injectable({
  providedIn: 'root'
})
export class FotografiaService {

  constructor(private http: HttpClient) { }

  cargar_foto_directoS3(foto_data: any)
  {
    return this.http.post(ip + 'subirfoto_solos3', foto_data);  
  }

  obtener_foto_directoS3(foto_data: any)
  {
    return this.http.post(ip + 'obtenerfoto_solos3', foto_data);  
  }

}
