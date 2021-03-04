import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { PaginaInicioComponent } from './components/pagina-inicio/pagina-inicio.component';
import { EditaralbumComponent } from './components/editaralbum/editaralbum.component';
import { UploadComponent } from './components/upload/upload.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SingupComponent,
    EditarPerfilComponent,
    PaginaInicioComponent,
    EditaralbumComponent,
    UploadComponent,
    CatalogoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
