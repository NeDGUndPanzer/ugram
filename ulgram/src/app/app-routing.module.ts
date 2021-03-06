import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { PaginaInicioComponent } from './components/pagina-inicio/pagina-inicio.component';
import { EditaralbumComponent } from './components/editaralbum/editaralbum.component';
import { UploadComponent } from './components/upload/upload.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'singup', component: SingupComponent},
  {path: 'editarperfil', component: EditarPerfilComponent},
  {path: 'inicio', component: PaginaInicioComponent},
  {path: 'editaralbum', component: EditaralbumComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'catologo', component: CatalogoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
