import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user/user";
import { UserService } from "../../../providers/user/user.service";
import { ChatService } from "../../../providers/chat/chat.service";

@Component({
  selector: 'gz-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {

  chatList: any[] = [];

  user: User;
  otherUser: User;

  @Input()
  adUserId;

  @Input()
  chatTitle;

  @Input()
  adId;

  constructor(private userService: UserService,
              private chatService: ChatService) {
  }

  async ngOnInit() {

    this.user = await this.userService.getDetail({});
    this.otherUser = await this.userService.getDetail({userid: this.adUserId});

    this.chatService.initChat();
    this.chatService.loginChat();

    this.chatService.receive = () => {
      this._updateScroll();
    };

    this.chatList = await this.chatService.updateChatList(this.adId, this.adUserId);
    this._updateScroll();
  }


  async send(message) {
    try {
      this.chatList = await this.chatService.send(this.adId, this.adUserId, message);
      this._updateScroll();
    } catch (e) {
      console.error(e);
    }
  }

  private _updateScroll() {
    document.querySelector('body').scrollTop = document.querySelector('body').scrollHeight;
    setTimeout(() => {
      document.querySelector('body').scrollTop = document.querySelector('body').scrollHeight;
    }, 1000);
  }
}
