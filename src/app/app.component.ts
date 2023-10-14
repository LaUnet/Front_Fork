import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //imports: [MatBadgeModule, MatButtonModule, MatIconModule],
})
export class AppComponent {
  title = 'Papeleria PuntoU';
  negocio: string = 'venta de materiales para cosas didacticas';
  hidden = false;
  toggleBadgeVisibility() {this.hidden = !this.hidden;}
}
