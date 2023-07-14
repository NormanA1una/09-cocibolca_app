import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorDetalleComponent } from './pages/proveedor-detalle/proveedor-detalle.component';
import { AgregarProductoComponent } from './pages/agregar-producto/agregar-producto.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { SingUpComponent } from './pages/sing-up/sing-up.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: 'proveedores',
    component: ProveedoresComponent,
    canActivate: [authGuard],
  },
  {
    path: 'proveedor/:id',
    component: ProveedorComponent,
    canActivate: [authGuard],
  },
  {
    path: 'productos',
    component: ProveedorDetalleComponent,
    canActivate: [authGuard],
  },
  {
    path: 'agregarProducto/:id',
    component: AgregarProductoComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'logIn',
    component: LogInComponent,
  },
  { path: 'singUp', component: SingUpComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'logIn' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
