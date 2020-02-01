import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [UserService, TopicService]
})
export class ListComponent implements OnInit {
  public page_title:string;
  public topics: Array<Topic>;
  public identity;
  public token;
  public status;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _topicService: TopicService

  ) {
    this.page_title = 'Mis temas';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    
  }
  ngOnInit() {
    this.getTopics();
  }
  getTopics(){
    var userId=this.identity._id;
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
  deleteTopic(id){
    this._topicService.deleteTopic(this.token, id).subscribe(
    response=>{
      this.getTopics();
    },
    error=>{
      console.log(error);
    });
  }
}
