export interface ProductoInterface {
  id: string | undefined;
  nombreProducto: string;
  cantidadAMano: number;
  cantidadContada: number;
  presentacion: string;
  fechaDeInventario: Date;
  nombreSupplier: string;
}
