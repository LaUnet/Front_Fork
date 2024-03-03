import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user_key';

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  set token(value: string | null) {
    if (value) {
      localStorage.setItem(this.TOKEN_KEY, value);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  get user(): string | null {
    return JSON.parse(localStorage.getItem(this.USER_KEY)!);
  }

  set user(value: string | null) {
    if (value) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(this.USER_KEY);
    }
  }

}
