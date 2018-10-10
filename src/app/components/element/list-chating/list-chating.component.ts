import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user/user';
import { UserService } from '../../../providers/user/user.service';
import { ChatService } from '../../../providers/chat/chat.service';
import { DialogService } from '../../../providers/dialog/Dialog.service';

const AV = (<any>window).AV;

@Component({
  selector: 'gz-list-chating',
  templateUrl: './list-chating.component.html',
  styleUrls: ['./list-chating.component.scss']
})
export class ListChatingComponent implements OnInit {

  chatingList: any[] = [];

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
              private chatService: ChatService,
              private dialogService: DialogService) {

    this.chatService.loginChat();
    this.chatService.receive = () => {
    this._updateScroll();
    };
  }

  async ngOnInit() {
    console.log('list-chat anotherUserId', this.anotherUserId);
    console.log('list-chat adUserId', this.adUserId);

    setTimeout(() => {
      this.refreshchatlist();
    }, 1000);

  }

  async refreshchatlist() {
    this.chatingList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId, this.orderId);
    this._updateScroll();

    console.log('chatingList', this.chatingList);
  }


  async send(message) {
    try {
      // this.chatingList = await this.chatService.send(this.adId, this.adUserId, this.anotherUserId, message);
      // this._updateScroll();
      this.chatService.send(this.adId, this.adUserId, this.anotherUserId, this.orderId, message)
      .then(async (data) => {
        this.chatingList = data;
        this._updateScroll();
      }, error => {
        console.error('---------------------error_send: ', error);
        this.dialogService.alert(error.message);
      });
    } catch (e) {
      console.error(e);
    }
  }

  private _updateScroll() {
    //  document.querySelector('body').scrollTop = document.querySelector('body').scrollHeight;
    //  setTimeout(() => {
    //    document.querySelector('body').scrollTop = document.querySelector('body').scrollHeight;
    //  }, 1000);
  }
}

