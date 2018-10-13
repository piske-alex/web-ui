import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user/user';
import { UserService } from '../../../providers/user/user.service';
import { ChatService } from '../../../providers/chat/chat.service';

@Component({
  selector: 'gz-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {

  chatList: any[] = [];

  adUser: User;
  anotherUser: User;

  @Input()
  adUserId;

  @Input()
  chatTitle;

  @Input()
  adId;

  @Input()
  anotherUserId;

  @Input()
  orderId;

  constructor(private userService: UserService,
              private chatService: ChatService) {
  }

  async ngOnInit() {
    // console.log('list-chat anotherUserId', this.anotherUserId);
    // console.log('list-chat adUserId', this.adUserId);
    this.anotherUser = await this.userService.getDetail({userid: this.anotherUserId});
    this.adUser = await this.userService.getDetail({userid: this.adUserId});

    this.orderId = 0;

    // this.chatService.initChat();
    // this.chatService.loginChat();

    // this.chatService.receive = () => {
    //   this._updateScroll();
    // };

    this.chatList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId,this.orderId);
    this._updateScroll();
    // setInterval(() => {
    //   this.refreshchatlist() ;
    // }, 1000);

  }

  async refreshchatlist() {
    this.chatList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId,this.orderId);
      this._updateScroll();
  }


  // async send(message) {
  //   try {
  //     this.chatList = await this.chatService.send(this.adId, this.adUserId, this.anotherUserId,this.orderId, message, this.adId, this.adUserId);
  //     this._updateScroll();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  private _updateScroll() {
    // document.querySelector('body').scrollTop = document.querySelector('body').scrollHeight;
    // setTimeout(() => {
    //   document.querySelector('body').scrollTop = document.querySelector('body').scrollHeight;
    // }, 1000);
  }
}
