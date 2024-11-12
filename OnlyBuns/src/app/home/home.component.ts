import { Component, OnInit } from '@angular/core';
import {FooService} from '../service/foo.service';
import {UserService} from '../service/user.service';
import {ConfigService} from '../service/config.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  

  constructor(
    public authService:AuthService
  ) {
  }

  ngOnInit() {
  }


}
