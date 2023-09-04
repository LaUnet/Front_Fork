import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from '../login/token';


@Component({
  selector: 'articulo-header',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent {
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


  async crearArticulo() {
    const url = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles';

    const body = {
      codigo: this.nuevoArticulo.codigo.substring(0, 10),
      descripcion: this.nuevoArticulo.descripcion,
      unidadMedida: this.nuevoArticulo.unidadMedida,
      documentoProveedor: this.nuevoArticulo.documentoProveedor,
      codigoUbicacion: this.nuevoArticulo.codigoUbicacion,
      estadoActivo: this.nuevoArticulo.estadoActivo
    };
    console.log("estado activo ", this.nuevoArticulo.estadoActivo);

    const token = this.tokenService.token;
    console.log("el body es ", body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    try {
      const response = await this.http.post(url, body, httpOptions).toPromise();
      this.successMesssage = 'Articulo creado correctamente';
      console.log('Respuesta del servidor:', response);
      this.resetNuevoArticulo();
      this.mensajeExitoso = 'Operación exitosa: El artículo se ha creado correctamente.';
      
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.errorMessage = 'Error al crear el Articulo. Por favor, inténtelo nuevamente.';
      this.mensajeFallido = 'Error: El artículo no se ha creado ';
    }
  }

  isGuardarHabilitado() {
    return this.nuevoArticulo.codigo.length === 10;
  }

  limitarLongitudCodigo(event: any) {
    const maxCaracteres = 10;
    const inputElement = event.target;
    if (inputElement.value.length > maxCaracteres) {
      inputElement.value = inputElement.value.slice(0, maxCaracteres);
    }
  }


  cancelarCreacion() {
    this.mostrarFormulario = false;
    this.resetNuevoArticulo();
  }

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.cargarProveedores();
  }

  cargarUbicaciones() {
    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/locations', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.ubicaciones = response.Data;
        }
      });
  }

  cargarProveedores() {
    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/providers', httpOptions)
      .subscribe(response => {
        if (response.Status) {
          this.proveedores = response.Data;
        }
      });
  }

  resetNuevoArticulo() {
    this.nuevoArticulo = {
      codigo: '',
      descripcion: '',
      unidadMedida: '',
      documentoProveedor: [],
      codigoUbicacion: '',
      estadoActivo: false
    };
  }


  async buscarArticulo() {

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
      })
    };

    if (!this.codigoArticuloBusqueda) {
      this.mostrarResultados = true;
      const response = await this.http.get<any>('https://p02--node-launet--m5lw8pzgzy2k.code.run/api/articles', httpOptions).toPromise();
      this.articulosEncontrados = response.Data;
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
      this.articulosEncontrados = response.Data;
      console.log("encontro articulo ", this.articulosEncontrados);
    }
    
  }


  borrarArticulo(articuloId: string) {

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
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

    const token = this.tokenService.token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': `${token}`
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
