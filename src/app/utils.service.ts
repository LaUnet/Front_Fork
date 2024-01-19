import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  //Formateo Fechas
  getDate() {
    try {
      return Intl.DateTimeFormat('es-CO', { dateStyle: "short", timeStyle: "short" }).format(new Date());
    } catch {
      return false;
    }
  };


  //Formateo Monedas
  getCurrency(value: number) {
    try {
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(+(value));
    } catch {
      return false;
    }
  };

  //Sumar valores
  sumarNumeros(a: number, b:number) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    return (a+b);
  }

    //Restar valores
    restarNumeros(a: number, b:number) {
      a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
      b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
      return (a-b);
    }

    //Convertir valores
    Numeros(a: any) {
      a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
      console.log(a);
      return (a);
    }

}
