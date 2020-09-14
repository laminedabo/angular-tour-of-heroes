import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit {

  constructor(public authService: AuthService) { }

  deconnexion(){
    this.authService.disConnect();
  }

  ngOnInit(): void {
  }

}
