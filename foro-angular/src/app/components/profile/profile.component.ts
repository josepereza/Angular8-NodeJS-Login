import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TopicService } from '../../services/topic.service';
import { global } from '../../services/global';
import { User } from '../../models/user';
import { Topic } from 'src/app/models/topic';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, TopicService]
})
export class ProfileComponent implements OnInit {
public url:string;

public user:User;
public topics:Topic[];
  constructor(
    private _userService: UserService,
    private _topicService: TopicService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {

    this.url=global.url;
   }

  ngOnInit() {
    this._route.params.subscribe(params=>{
      var userId= params['id'];
      this.getUser(userId);
      this.getTopics(userId);
    });
    
  }

  getUser(userId){
    this._userService.getUser(userId).subscribe(
      response=>{
        if(response.user){
          this.user=response.user;
        }else{
          
        }
      },
      error=>{
        console.log(error);
      });

  }
  getTopics(userId){

    this._topicService.getTopicsByUser(userId).subscribe(
      response=>{
        if(response.topics){
          this.topics=response.topics;
        }
      },
      error =>{
        console.log(error);
      });
  }

}
