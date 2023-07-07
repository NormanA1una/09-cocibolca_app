export class ProveedorModel {
  id!: string | undefined;
  nombreProveedor!: string;
  tipoDeProducto!: string;
  estado: boolean;
  logo!: string;

  constructor() {
    this.estado = true;
  }
}
