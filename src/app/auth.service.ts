import { Injectable } from '@angular/core';
import { User } from './user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  public Connect(user: User){
    localStorage.setItem("connectedUser", JSON.stringify(user));
  }

  public isConnected(){
    return localStorage.getItem("connectedUser") !== null;
  }

  public disConnect(){
    if(this.isConnected()){
      localStorage.removeItem("connectedUser");
      this.router.navigateByUrl('/login');
    }
  }
}
