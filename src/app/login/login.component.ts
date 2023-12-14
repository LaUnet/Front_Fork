import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TokenService} from './token'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isUsernameValid: boolean = true;
  isPasswordValid: boolean = true;

  authenticationError: boolean = false;

  constructor(private router: Router, private http: HttpClient, private tokenService: TokenService) { }


  onSubmit() {

    this.validateForm();

    if (this.isFormValid()) {
      this.login();
    } else {
      window.location.reload();
    }
  }

  validateForm() {
    this.isUsernameValid = this.isValidEmail(this.username);
    this.isPasswordValid = this.password !== '';
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailPattern.test(email.toLowerCase());
  }

  isFormValid(): boolean {
    return this.isUsernameValid && this.isPasswordValid;
  }

  async login() {
    const loginUrl = 'https://p02--node-launet--m5lw8pzgzy2k.code.run/api/auth/login';

    const body = {
      email: this.username,
      password: this.password
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let responseFromServer: any;


    try {
      responseFromServer = await new Promise((resolve, reject) => {
        this.http.post(loginUrl, body, httpOptions).subscribe(
          result => {
            const jsonResponse = result as any; 
            const token = jsonResponse?.Data;
            this.tokenService.token = token;
            resolve(result);
          },
          err => {
            console.error("entro a error", err);
            reject(err);
          }
        );
      });



      if (responseFromServer) {
        this.router.navigate(['/menu']);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      this.authenticationError = true;
    }
  }
}

