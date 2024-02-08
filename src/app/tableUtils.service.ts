
import { Injectable } from '@angular/core';
import * as XLSX from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class TableUtilsService {

  /** 
  exportToExcel(tableId: string, name?: string) {
    let timeStamp = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeStamp}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  */

  exportToExcel(arr: any[], name?: string) {
    console.log(arr);
    let filter: any = arr;
    if (name === 'ReporteVentas'){
    filter = arr.map(
      x => ({
        NumeroFactura: x.numeroFactura,
        FechaFactura: x.fechaFactura,
        FormaDePago: x.formaDePago,
        CantidadEfectivo: x.cantidadEfectivo,
        CantidadTransferencia: x.cantidadTransferencia,
        Subtotal: x.subtotal,
        Descuento: x.descuento,
        Total: x.total,
        FacturacionElectronica: x.facturacionElectronica,
        Vendedor: x.vendedor,
        NombreCliente: x.cliente.nombreRazonSocial,
        TipoDocumento: x.cliente.tipoDocumento,
        NumeroDocumento: x.cliente.numeroDocumento,
        CorreoElectronico: x.cliente.email

      })
    )
   } 
   if (name === 'ReporteDetalleArticulos'){
    filter = arr.map(
      x => ({
        CodigoBarras: x.codigoBarras,
        Descripcion: x.descripcion,
        Marca: x.marca,
        Ubicacion: x.codigoUbicacion,
        Stock: x.inventarios.stock,
        PrecioVenta: x.precios.precioVenta,
        PrecioMayoreo: x.precios.precioMayoreo,
      })
    )
   } 

    let fileName = this.getFileName(name); 
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(filter);
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  getFileName(name: any) {
    let timeStamp = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeStamp}`;
    return fileName
  }

}