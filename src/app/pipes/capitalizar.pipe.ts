import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizar',
})
export class CapitalizarPipe implements PipeTransform {
  transform(value: string, todas: boolean = true): string {
    value = value.toLowerCase();

    let textos = value.split(' ');

    if (todas) {
      textos = textos.map((texto) => {
        return texto[0].toUpperCase() + texto.substring(1);
      });
    } else {
      textos[0] = textos[0][0].toUpperCase() + textos[0].substring(1);
    }

    return textos.join(' ');
  }
}
