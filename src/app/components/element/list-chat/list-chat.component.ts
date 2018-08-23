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

    // this.chatList = [
    //   {
    //     sendTime: Date.now(),
    //     content: '你好，请问在吗？',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '在，请问现在交易吗？',
    //     headImg: '/favicon.ico',
    //     isMe: false,
    //   },
    //   {
    //     content: '你好，请问在吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '你好，请问在吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '在，请问现在交易吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: false,
    //   },
    //   {
    //     sendTime: Date.now(),
    //     content: '你好，请问在吗？',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     sendTime: Date.now(),
    //     content: '你好，请问在吗？',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '你好，请问在吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     sendTime: Date.now(),
    //     content: '你好，请问在吗？',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '在，请问现在交易吗？',
    //     headImg: '/favicon.ico',
    //     isMe: false,
    //   },
    //   {
    //     content: '你好，请问在吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '你好，请问在吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: true,
    //   },
    //   {
    //     content: '在，请问现在交易吗？我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买我想购买',
    //     headImg: '/favicon.ico',
    //     isMe: false,
    //   },
    // ];
  }

  private _login() {
    this.realtime.createIMClient(this.user.username).then(chat => {
      this.conversation = chat.createConversation({
        members: [this.otherUser.username],
        name: this.chatTitle,
        transient: false,
        unique: true,
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
    this.conversation.then((conversation) => {
      conversation.send(new AV.TextMessage(message));
      console.log('-------------message: ', message);
      this.chatList.push({
        content: message,
        isMe: true,
      });
      // $('#chat').val($('#chat').val() + "\n" + $('#username').val() + ": " + $('#message').val())
    })
  }

}
