
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { LocalStorageService } from '../local-storage.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-dialogo.carItem',
  templateUrl: './dialogo.carItem.component.html',
  styleUrls: ['./dialogo.carItem.component.css']
})
export class DialogoCarItemComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  isVentaUnitaria !: boolean;
  isVentaMayoreo !: boolean;
  disabledButton !: boolean;
  mensajeFallido: string = '';
  /**
   * Control Error Textfields carItem
   */
  descripcionFormControl = new FormControl('');
  cantidadFormControl = new FormControl('');
  precioFormControl = new FormControl('');
  impuestoFormControl = new FormControl('');
  descuentoFormControl = new FormControl('');
  totalFormControl = new FormControl('');

  articuloCarItem = {
    descripcion: '',
    cantidad: 0,
    precioMenudeo: 0,
    precioMayoreo: 0,
    impuesto: 0,
    descuento: 0,
    total: 0,
  };

  constructor(
    public dialogo: MatDialogRef<DialogoCarItemComponent>,
    @Inject(MAT_DIALOG_DATA) public element: any = [], @Inject(MAT_DIALOG_DATA) public index: number,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService, public utilsService: UtilsService) 
    {
    
    this.isVentaUnitaria = element.detalleArticulo[0].mayoreo? false:true;
    this.isVentaMayoreo = element.detalleArticulo[0].mayoreo? true:false;
    this.articuloCarItem.cantidad = this.utilsService.numeros(element.detalleArticulo[0].cantidad);
    this.articuloCarItem.precioMenudeo = this.utilsService.numeros(element.detalleArticulo[0].precioVenta);
    this.articuloCarItem.precioMayoreo = this.utilsService.numeros(element.detalleArticulo[0].precioMayoreo);
    this.articuloCarItem.total = this.utilsService.numeros(element.detalleArticulo[0].total);

  }

  actualizar(): void {
    this.element.detalleArticulo[0].mayoreo = this.isVentaMayoreo? true:false
    this.element.detalleArticulo[0].cantidad = this.articuloCarItem.cantidad;
    this.element.detalleArticulo[0].precioVenta = this.articuloCarItem.precioMenudeo;
    this.element.detalleArticulo[0].precioMayoreo = this.articuloCarItem.precioMayoreo;
    this.element.detalleArticulo[0].total = this.articuloCarItem.total;
    this.dialogo.close(true);
  }

  cerrar(): void {
    this.articuloCarItem.cantidad = this.articuloCarItem.cantidad
    this.articuloCarItem.total = this.articuloCarItem.total;
    this.dialogo.close(false);
  }

  toggleUnitario(estado: any) {
    this.isVentaMayoreo = estado ? false : true;
    if (estado) {
      this.articuloCarItem.total = this.utilsService.multiplicarNumero(this.articuloCarItem.cantidad, this.articuloCarItem.precioMenudeo)
    } else {
      this.toggleMayoreo(this.isVentaMayoreo)
    }
  };

  toggleMayoreo(estado: any) {
    this.isVentaUnitaria = estado ? false : true;
    if (estado) {
      this.articuloCarItem.total = this.utilsService.multiplicarNumero(this.articuloCarItem.cantidad, this.articuloCarItem.precioMayoreo)
      this.isVentaMayoreo = estado;
    } else {
      this.toggleUnitario(this.isVentaUnitaria)
      this.isVentaMayoreo = estado;
    }
  };

  onEnter(valor: any) {
    this.disabledButton = false;
    this.mensajeFallido = "";
    if (this.utilsService.numeros(valor) === 0){
      this.disabledButton = true;
      return;
    }
    if (this.utilsService.numeros(valor) <= this.utilsService.numeros(this.element.stock )) {
      this.articuloCarItem.cantidad = this.utilsService.numeros(valor);
      this.articuloCarItem.total = this.isVentaUnitaria ? this.utilsService.multiplicarNumero(this.articuloCarItem.cantidad, this.articuloCarItem.precioMenudeo) : this.utilsService.multiplicarNumero(this.articuloCarItem.cantidad, this.articuloCarItem.precioMayoreo);
    } else {
      this.disabledButton = true
      this.mensajeFallido = "No hay suficiente Stock " + this.element.stock + " para la cantidad de productos solicitados " + valor;
      this.articuloCarItem.cantidad = this.articuloCarItem.cantidad
      this.articuloCarItem.total = this.articuloCarItem.total;
    }
  }
  
  ngOnInit() {
  }
}
export class Articulo {
  constructor(public codigo: string, public codigoBarras: string, public descripcion: String, public marca: string, public referencia: string,
    public unidadMedida: String, public codigoUbicacion: string, public estadoActivo: boolean, public precioVenta: string,
    public ivaCompra: String, public subtotalCompra: string, public totalCompra: string
  ) { }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}