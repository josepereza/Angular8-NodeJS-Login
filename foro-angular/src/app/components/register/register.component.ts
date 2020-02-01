import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: string;
  constructor(
    private _router: Router,
    private _userService: UserService
  ) { 
    this.page_title= "Registrate";
    this.user= new User('','','','','','','ROLE_USER');
  }

  ngOnInit() {
    console.log(this._userService.test());
  }

  onSubmit(form){
    this._userService.register(this.user).subscribe(
      response =>{
        if(response.user && response.user._id){
          this.status='success';
          this._router.navigate(['/inicio']);
          form.reset();

        }else{
          this.status='error';
        }

      },
      err=>{
        console.log(err)
      }
    );
  }

  

}
