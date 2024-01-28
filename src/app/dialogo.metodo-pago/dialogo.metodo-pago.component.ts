
import { Component } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { LocalStorageService } from '../local-storage.service';
import { UtilsService } from '../utils.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenService } from '../login/token';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-dialogo.metodo-pago',
  templateUrl: './dialogo.metodo-pago.component.html',
  styleUrls: ['./dialogo.metodo-pago.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class DialogoMetodoPagoComponent {

  constructor(private http: HttpClient, private tokenService: TokenService, public utilsService: UtilsService) { }

  /**
 * Control Error Textfields Pasarela
 */
  firstFormControl = new FormControl('');
  secondFormControl = new FormControl('');

  dataSourceUsuarios: any = [];
  dataSourceSellers: any = [];
  //matcher = new MyErrorStateMatcher();
  isLoadingResults: boolean = false;
  mensajeFallido: string = '';
  pasarela = {
    tipoPago: '',
    efectivo: '',
    transferencia: '',
    facturaElectronica: '',
    vendedor: '',
  };


  ngOnInit(): void {
    this.setState(this.firstFormControl, 1);
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    const rolName = 'seller'
    const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };
    this.isLoadingResults = true;
    try {
      this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/users', httpOptions)
        .subscribe(response => {
          if (response.Status) {
            this.dataSourceUsuarios = response.Data.docs;
            for (let i = 0; i < this.dataSourceUsuarios.length; i++) {
              if (this.dataSourceUsuarios[i].rolName[0].name === rolName) {
                this.dataSourceSellers = [...this.dataSourceSellers, this.dataSourceUsuarios[i]]
              }
            }
          }
          this.isLoadingResults = false;
        }, error => {
          this.isLoadingResults = false;
          this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nue{vamente.';
          console.error('Error en la solicitud:', error);
        });
    } catch (error) {
      this.isLoadingResults = false;
      this.mensajeFallido = 'Error al consultar Ubicaciones. Por favor, inténtelo nuevamente.';
      console.error('Error en la solicitud:', error);
    }
  }

  setState(control: FormControl, process: number) {
    control.setErrors({ 'incorrect': true })
    if (process === 1) {
      if (this.pasarela.tipoPago === 'EFE' && this.utilsService.numeros(this.pasarela.efectivo) > 0) {
        control.setErrors(null)
        this.secondFormControl.setErrors({ 'incorrect': true });
      }
      if (this.pasarela.tipoPago === 'TRA' && this.utilsService.numeros(this.pasarela.transferencia) > 0) {
        control.setErrors(null)
        this.secondFormControl.setErrors({ 'incorrect': true });
      }
      if (this.pasarela.tipoPago === 'MIX' && (this.utilsService.numeros(this.pasarela.efectivo) > 0 && this.utilsService.numeros(this.pasarela.transferencia) > 0)) {
        control.setErrors(null)
        this.secondFormControl.setErrors({ 'incorrect': true });
      }
    }
    if (process === 2) {
      if (this.pasarela.facturaElectronica !== "" && this.pasarela.vendedor !== "") {
        control.setErrors(null)
      }
    }
  }

  confirmarVenta() {
    alert("Ya casi HP")
  }
}
