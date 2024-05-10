import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  //Formateo Fechas
  getDate(date: any) {
    try {
      if (date !== null){
        return new Intl.DateTimeFormat("az", {year: "numeric", month: "2-digit",  day: "2-digit" }).format(new Date(date));
      }else{
      return Intl.DateTimeFormat('es-CO', { dateStyle: "medium", timeStyle: "short" }).format(new Date());
      }
    } catch {
      return false;
    }
  };

  //Formateo Monedas
  getCurrency(value: any) {
    try {
      return new Intl.NumberFormat("en-ES", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(+(value));
    } catch {
      return false;
    }
  };

  //Sumar valores
  sumarNumeros(a: number, b: number) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    return (a + b);
  }

  //Multiplicar valores
  multiplicarNumero(a: number, b: number) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    return (a * b);
  }

  //Restar valores
  restarNumeros(a: number, b: number) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    return (a - b);
  }

  //Convertir valores
  numeros(a: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    return (a);
  }

  // Percentage
  percent(a: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    if (a === 1) { a = 19 }
    return Intl.NumberFormat("en-US", { style: "percent", }).format(a / 100);
  }

  calcularImpuesto(a: any, b: any, c: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    c = !isNaN(c) && typeof c !== 'boolean' ? +c : 0;
    c = c !== 0 ? c / 100 : 1
    let valorXcantidad = a * b;
    let valorImpuesto = c !== 1 ? valorXcantidad * c : 0;
    return valorImpuesto;
  }

  calcularDescuento(a: any, b: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    let descuento = b !== 0 ? (a * (b / 100)) : 0
    return descuento;
  }

  calcularDescuentoMayoreoInterno(a: any, b: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    let descuento = a - b;
    return descuento;
  }

  calculartotal(a: any, b: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    let descuento = b !== 0 ? a * (b / 100) : 0
    let total = a - descuento
    return total;
  }

  calcularSubtotal(a: any, b: any, c: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    c = !isNaN(c) && typeof c !== 'boolean' ? +c : 0;
    c = c !== 0 ? c / 100 : 1
    let valorXcantidad = a * b;
    let valorImpuesto = c !== 1 ? valorXcantidad * c : 0;
    let subtotal = +valorXcantidad + valorImpuesto;
    return subtotal;
  }

  calcularUnitario(a: any, b: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    let descuentoIva = a / ((b / 100) + 1);
    descuentoIva = Number(descuentoIva.toFixed(2));
    return descuentoIva;
  }

  calcularInterno(a: any, b: any) {
    a = !isNaN(a) && typeof a !== 'boolean' ? +a : 0;
    b = !isNaN(b) && typeof b !== 'boolean' ? +b : 0;
    let precioInterno = a + ((b / 100)* a);
    precioInterno = Number(precioInterno.toFixed(2));
    return precioInterno;
  }

}
