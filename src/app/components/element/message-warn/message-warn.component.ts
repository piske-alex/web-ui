import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../providers/chat/chat.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'app-message-warn',
  templateUrl: './message-warn.component.html',
  styleUrls: ['./message-warn.component.scss']
})
export class MessageWarnComponent implements OnInit {

  isShowNewMessage: boolean;
  unreadCount: number;
  i18ns: any = {};

  constructor(private router: Router,
    private languageService: LanguageService,
    private chatService: ChatService) {

  }

  async ngOnInit() {

    this.chatService.unreadTip = () => {
      this.isShowNewMessage = true;
    };


    let fetchNewMessage = async () => {
      // console.log(this.chatService);
      this.i18ns.newmsgTip = await this.languageService.get('chat.newmsg');
      if (this.chatService.isLogin) {
        this.chatService.getUnreadCount().then((data) => {
          // console.log('warrrrrrrrrrrrrrrrrrrrrrrning  ngOnInit ', data);
          this.unreadCount = data;
          if (data > 0) {
            this.isShowNewMessage = true;

          } else {
            this.isShowNewMessage = false;
          }
        });
      } else {
        this.isShowNewMessage = false;
        this.unreadCount = 0;
      }
    };

    setInterval(fetchNewMessage, 5000); // 10秒刷新一次

    // this.isShowNewMessage = false;
    // if (this.chatService.chat) {
    //   this.chatService.chat.on(AV.UNREAD_MESSAGES_COUNT_UPDATE, function(conversations) {
    //     for (let conv of conversations) {
    //       console.log('warrrrrrrrrrrrrrrrrrrrrrrning');
    //       console.log(conv.id, conv.name, conv.unreadMessagesCount);
    //       this.isShowNewMessage = true;
    //     }
    //   });
    // }


    // let fetchNewMessage = async () => {
    //   this.message = await this.adService.getNewMsg({});
    //   if(this.message.success){
    //     this.isShow = true;
    //   }else{
    //     this.isShow = false;
    //   }
    //   this.isShow = true;
    // }

    // setInterval(fetchNewMessage, 5000); // 10秒刷新一次
  }

  gotoMyMsg() {
    console.log('ssss myMsg');
    this.router.navigate(['/myMsg', {}]);
    this.isShowNewMessage = false;
  }

}

