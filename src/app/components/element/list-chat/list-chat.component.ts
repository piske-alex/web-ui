import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../../models/user/user";
import { UserService } from "../../../providers/user/user.service";

const AV = (<any>window).AV;

@Component({
  selector: 'gz-list-chat',
  templateUrl: './list-chat.component.html',
  styleUrls: ['./list-chat.component.scss']
})
export class ListChatComponent implements OnInit {

  chatList: any[] = [];

  user: User;
  otherUser: User;

  realtime: any;
  conversation: any;

  @Input()
  otherUserId;

  @Input()
  chatTitle;

  @Input()
  adId;

  constructor(private userService: UserService) {
  }

  async ngOnInit() {

    this.realtime = new AV.Realtime({
      appId: 'SLDdimkCsvFh1R5xlreorNl0-gzGzoHsz',
      appKey: 'Pd10DELIIqFQkIkNJdv490IW',
      region: 'cn', // 美国节点为 "us"
    });

    this.user = await this.userService.getDetail({});
    this.otherUser = await this.userService.getDetail({userid: this.otherUserId});

    this._login();

    //   {
    //     content: '在，请问现在交易吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: false,
    //   },
    // ];
  }

  private _login() {
    const _sp = '______';
    console.log('1: ', this.user.id + '');
    this.realtime.createIMClient(this.user.id + '').then(chat => {
      const _adDesc = this.adId + _sp + 'adId';
      console.log('2: ', [this.user.id + '', this.otherUserId + '', _adDesc]);
      console.log('3: ', this.adId);
      this.conversation = chat.createConversation({
        members: [this.user.id + '', this.otherUserId + '', _adDesc],
        name: _adDesc,
        transient: false,
        unique: true,
      }).then(conversation => {
        conversation.queryMessages({
          limit: 1000,
        }).then(messages => {
          console.log('messages: ', messages);
          messages.forEach(_data => {
            // console.log('_data::', _data);
            console.log('_data.from::', _data.from);

            this.chatList.push({
              content: _data._lctext,
              isMe: _data.from == this.user.id,
            });
          });
        }).catch(console.error.bind(console));
        return conversation;
      });
      chat.on(AV.Event.MESSAGE, (message, conversation) => {
        // $('#chat').val($('#chat').val() + "\n" + message.from + ": " + message.text)
        this.chatList.push({
          content: message.text,
          isMe: false,
        });
      });

      return this.conversation;
    }).then(function (conversation) {
      // return conversation.send(new this.TextMessage($('#username').val() + ' online'));
    }).catch(console.error);

  }

  send(message) {
    this.conversation && this.conversation.then((conversation) => {
      conversation.send(new AV.TextMessage(message));
      this.chatList.push({
        content: message,
        isMe: true,
      });
      // $('#chat').val($('#chat').val() + "\n" + $('#username').val() + ": " + $('#message').val())
      return conversation;
    })
  }

}
