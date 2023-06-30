import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedorDetalleComponent } from './pages/proveedor-detalle/proveedor-detalle.component';
import { AgregarProductoComponent } from './pages/agregar-producto/agregar-producto.component';

const routes: Routes = [
  {
    path: 'proveedores',
    component: ProveedoresComponent,
  },
  { path: 'proveedor/:id', component: ProveedorComponent },
  {
    path: 'productos',
    component: ProveedorDetalleComponent,
  },
  { path: 'agregarProducto/:id', component: AgregarProductoComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'proveedores' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
