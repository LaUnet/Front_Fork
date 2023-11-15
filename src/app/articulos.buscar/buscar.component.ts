import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';


@Component({
  selector: 'app-buscarArticulo',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class buscarArticuloComponent {
  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService) { }
  ubicaciones: any[] = [];
  proveedores: any[] = [];

  codigoArticuloBusqueda: string = '';
  articulosEncontrados: any[] = [];
  mostrarResultados: boolean = false;

  errorMessage: string = '';
  successMesssage: String = '';

  articuloEditando: any = null;

  mensajeExitoso: string = '';
  mensajeFallido: string = '';

  filtroDescripcion: string = '';

  mostrarCampoFiltrar: boolean = false;
  manualToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTYxMmRiZTI3MzI1MjZiYjYzMmQ4YyIsImlhdCI6MTY5OTkyMzE1MiwiZXhwIjoxNzAwMDA5NTUyfQ.rwRiN0DoyGLjEJNTRAxpeGK0pONqBX-bn9Z57JBLu_M"

  mostrarFormulario = false;
  mostrarFormularioBuscar = false;
  nuevoArticulo = {
    codigo: '',
    descripcion: '',
    unidadMedida: '',
    documentoProveedor: [],
    codigoUbicacion: '',
    estadoActivo: false
  };

  mostrarFormularioCrearArticulo(event: Event) {
    event.preventDefault();
    this.mostrarFormulario = true;
    this.mostrarFormularioBuscar = false;
    this.mostrarResultados = false;
  }

  mostrarFormularioBuscarArticulo(event: Event) {
    event.preventDefault();
    this.mostrarFormulario = false;
    this.mostrarFormularioBuscar = true;
    
  }

  limitarLongitudCodigo(event: any) {
    const maxCaracteres = 10;
    const inputElement = event.target;
    if (inputElement.value.length > maxCaracteres) {
      inputElement.value = inputElement.value.slice(0, maxCaracteres);
    }
  }

  ngOnInit(): void {
    this.cargarUbicaciones();
  }

  cargarUbicaciones() {
    //const token = this.tokenService.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //'x-access-token': `${token}`
        'x-access-token': this.manualToken
      })
    };

    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.ubicaciones = response.Data.docs;
        }
      });
  }

  async buscarArticulo() {

    //const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //'x-access-token': `${token}`
        'x-access-token': this.manualToken
      })
    };

    if (!this.codigoArticuloBusqueda) {
      this.mostrarResultados = true;
      const response = await this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles', httpOptions).toPromise();
      this.articulosEncontrados = response.Data.docs;
      console.log("encontro articulos ", this.articulosEncontrados);
      this.mensajeExitoso = 'Búsqueda exitosa';
      this.mostrarCampoFiltrar = true;

    if (this.filtroDescripcion) {
      console.log("entre a filtro descripcion")
      this.articulosEncontrados = this.articulosEncontrados.filter((articulo) => {
        return articulo.descripcion.toLowerCase().includes(this.filtroDescripcion.toLowerCase());
      });
    }

      setTimeout(() => {
        this.mensajeExitoso = '';
      }, 5000);
    } else {
      this.mostrarResultados = true;
      const response = await this.http.get<any>(`https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${this.codigoArticuloBusqueda}`, httpOptions).toPromise();
      this.articulosEncontrados = response.Data.docs;
      console.log("encontro articulo ", this.articulosEncontrados);
    }
    
  }


  borrarArticulo(articuloId: string) {

    //const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //'x-access-token': `${token}`
        'x-access-token': this.manualToken
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${articuloId}`;

    this.http.delete(url, httpOptions).subscribe(
      (response) => {
        console.log('Artículo borrado exitosamente');
        this.mensajeExitoso = 'Operación exitosa: El artículo se ha eliminado correctamente.';
        setTimeout(() => {
          this.refreshPage();
        }, 3000);


        setTimeout(() => {
          this.mensajeExitoso = '';
        }, 5000);
      },
      (error) => {
        console.error('Error al borrar el artículo', error);
        this.mensajeFallido = 'Error: El artículo no se ha podido eliminar ';
      }
    );
  }

  editarArticulo(articulo: any) {
    this.articuloEditando = { ...articulo };
  }

  cancelarEdicion() {
    this.articuloEditando = null;
  }




  guardarEdicionArticulo() {

    //const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //'x-access-token': `${token}`
        'x-access-token': this.manualToken
      })
    };

    const url = `https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles/${this.articuloEditando._id}`;
    const payload = {
      descripcion: this.articuloEditando.descripcion,
      unidadMedida: this.articuloEditando.unidadMedida,
      documentoProveedor: this.articuloEditando.documentoProveedor,
      codigoUbicacion: this.articuloEditando.codigoUbicacion,
      estadoActivo: this.articuloEditando.estadoActivo,
    };

    console.log("el body es ", payload);

    this.http.patch(url, payload, httpOptions).subscribe(
      (response) => {
        console.log('Artículo editado exitosamente');
        this.mensajeExitoso = 'Operación exitosa: El artículo se ha actualizado correctamente.';
        setTimeout(() => {
          this.refreshPage();
        }, 3000);


        setTimeout(() => {
          this.mensajeExitoso = '';
        }, 5000);

      },
      (error) => {
        this.mensajeFallido = 'Error: El artículo no se ha podido actualizar ';
        console.error('Error al editar el artículo', error);
      }
    );
  }

  refreshPage() {
    window.location.reload();
  }
  
}
