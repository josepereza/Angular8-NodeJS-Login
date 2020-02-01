import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';


@Component({
  selector: 'app-edit',
  templateUrl: '../add/add.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [UserService, TopicService]
})
export class EditComponent implements OnInit {
  public page_title: string;
  public topic: Topic;
  public identity;
  public token;
  public status;
  public is_edit;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _topicServie: TopicService

  ) {
    this.page_title = 'Editar tema';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.topic = new Topic('', '', '', '', '', '', this.identity.sub, null);
    this.is_edit= true;
  }
  ngOnInit() {
    this.getTopic();
  }

  getTopic(){
    this._route.params.subscribe(params => {
      let id= params['id'];
      this._topicServie.getTopic(id).subscribe(
        response => {
          if(!response.topic){
            this._router.navigate(['/panel']);

          }else{
            this.topic=response.topic;
          }
        },
        error => {
          console.log(error);
          
        });
    });
  }
  onSubmit(form){
    var id= this.topic._id;
    this._topicServie.update(this.token, id, this.topic).subscribe(
    response=>{
      if(response.topic){
        this.status='success';
        this.topic=response.topic;

      }else{
        this.status='error';
      }
    },
    error=>{
      this.status='error';
      console.log(error);
      
    });
  }

}
