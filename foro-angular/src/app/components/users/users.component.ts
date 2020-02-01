import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';
import { User } from '../../models/user';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
public users: User[];
public url:string;
public page_title:string;
  constructor(
    private _userService:UserService
  ) { 
    this.url=global.url;
    this.page_title='Compañeros';
  }

  ngOnInit() {
    this.getUsers();
  }
  getUsers(){
    this._userService.getUsers().subscribe(response=>{
      if (response.users) {
          this.users=response.users
      }
    },
    error=>{
      console.log(error);
    });
  }

}
