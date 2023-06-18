import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

const routes: Routes = [
  {
    path: 'proveedores',
    component: ProveedoresComponent,
  },
  { path: 'proveedor/:id', component: ProveedorComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'proveedores' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
