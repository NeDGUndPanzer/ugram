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

  service_upload_singup(foto_data: any)
  {
    return this.http.post(ip + 'upload_singup', foto_data);  
  }

  service_addAlbum(foto_data: any)
  {
    return this.http.post(ip + 'addAlbum', foto_data);  
  }

  service_upload_pic(foto_data: any)
  {
    return this.http.post(ip + 'upload_pic', foto_data);  
  }
  
  service_getuseralbums(foto_data: any)
  {
    return this.http.post(ip + 'getuseralbums', foto_data);  
  }

  service_addFoto(foto_data: any)
  {
    return this.http.post(ip + 'addFoto', foto_data);  
  }

  service_getFotosAlbum(foto_data: any)
  {
    return this.http.post(ip + 'getFotosAlbum', foto_data);  
  }
  
  /** FAse 2 */

  service_compararFotos(foto_data: any)
  {
    return this.http.post(ip + 'compararfotos', foto_data);  
  }

  service_getBASE64(foto_data: any)
  {
    return this.http.post(ip + 'getBASE64_byURL', foto_data);  
  }

  service_getLabels(foto_data: any)
  {
    return this.http.post(ip + 'getLabels', foto_data);  
  }

}
