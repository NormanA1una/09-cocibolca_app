export class ProveedorModel {
  id!: string;
  nombreProveedor!: string;
  tipoDeProducto!: string;
  estado: boolean;
  logo!: string;

  constructor() {
    this.estado = true;
  }
}
