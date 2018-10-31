import { Component, Input, OnInit , OnDestroy} from '@angular/core';
import { User } from '../../../models/user/user';
import { UserService } from '../../../providers/user/user.service';
import { ChatService } from '../../../providers/chat/chat.service';
import { DialogService } from '../../../providers/dialog/dialog.service';

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

  handleRefreshChat: any;

  isLoading: boolean;

  constructor(private userService: UserService,
              private chatService: ChatService,
              private dialogService: DialogService) {
      try {
        this.chatService.loginChat();
      } catch (e) {
        console.error('list chating  error', e);
        this.chatService.loginChat();
      }
  }

  async ngOnDestroy() {
    if (this.handleRefreshChat !== undefined ) {
      clearInterval(this.handleRefreshChat);
    }
  }

  async ngOnInit() {
    // console.log('adUser', this.adUserId);
    // console.log('anotherUser', this.anotherUserId);
    this.adUser = await this.userService.getDetail({ userid: this.adUserId });
    this.anotherUser = await this.userService.getDetail({ userid: this.anotherUserId });
    // console.log('adUser', this.adUser);
    // console.log('anotherUser', this.anotherUser);

    // this.chatService.receive = () => {
    //   this._updateScroll();
    // };

    // setTimeout(() => {
    //   this.refreshchatlist();
    // }, 1000);

    this.isLoading = true;
    this.handleRefreshChat = setInterval( () => { this.refreshchatlist(); }, 500);

  }

  async refreshchatlist() {
    if (this.chatingList) {
      const tempList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId, this.orderId);
      this.isLoading = false;
      if (this.chatingList.length != tempList.length) {
       // console.log('chatingList updateScroll');
        this.chatingList = tempList;
        this._updateScroll();
      } else {
       // console.log('chatingList updateScroll nonononono');
      }
    } else {
      this.chatingList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId, this.orderId);
      this.isLoading = false;
      this._updateScroll();
    }

    // this.chatingList = await this.chatService.updateChatList(this.adId, this.adUserId, this.anotherUserId, this.orderId);
    // this._updateScroll();

    // console.log('chatingList', this.chatingList);
  }


  async send(message) {
    try {
      // this.chatingList = await this.chatService.send(this.adId, this.adUserId, this.anotherUserId, message);
      // this._updateScroll();
      this.chatService.send(this.adId, this.adUserId, this.anotherUserId, this.orderId, message,
        this.adUser.username, this.anotherUser.username)
      .then(async (data) => {
       // console.error('---------------------ok_send: ', data);
       // this.chatingList = data;
       // this._updateScroll();
      }, error => {
        console.error('---------------------error_send: ', error);
        this.dialogService.alert(error.message);
      });
    } catch (e) {
      console.error(e);
    }
  }

  private _updateScroll() {
    if ( document.querySelector('.gz-chat-list').scrollHeight ) {
    document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      // document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 100;

      setTimeout(() => {
        document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      }, 1000);
    }
  }
}

