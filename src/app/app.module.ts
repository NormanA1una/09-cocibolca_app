import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Componentes
import { AppComponent } from './app.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorDetalleComponent } from './pages/proveedor-detalle/proveedor-detalle.component';
import { AgregarProductoComponent } from './pages/agregar-producto/agregar-producto.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LogInComponent } from './pages/log-in/log-in.component';
import { SingUpComponent } from './pages/sing-up/sing-up.component';
import { HomeComponent } from './pages/home/home.component';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { ProductHistoryComponent } from './pages/product-history/product-history.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    ProveedorComponent,
    ProveedoresComponent,
    ProveedorDetalleComponent,
    AgregarProductoComponent,
    LogInComponent,
    SingUpComponent,
    HomeComponent,
    ListaUsuariosComponent,
    CapitalizarPipe,
    ProductHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
