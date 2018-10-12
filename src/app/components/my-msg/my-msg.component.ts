import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../providers/language/language.service';
import { ChatService } from '../../providers/chat/chat.service';
import { DialogService } from '../../providers/dialog/dialog.service';
import { AdService } from '../../providers/ad/ad.service';
import { concat } from 'rxjs';


@Component({
  selector: 'app-my-msg',
  templateUrl: './my-msg.component.html',
  styleUrls: ['./my-msg.component.scss']
})
export class MyMsgComponent implements OnInit {

  chatList: any[] = [];
  chatDlgList: any ;
  i18ns: any = {};

  constructor(private location: Location,
    private router: Router,
    private languageService: LanguageService,
    private chatService: ChatService  ,
    private adService: AdService,
    private dialogService: DialogService
    ) {}

  async ngOnInit() {

    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.i18ns.myMsg = await this.languageService.get('otc.myMsg');
    this.i18ns.chat_with_members = await this.languageService.get('my_msg.chat_with_members');
    this.i18ns.unread_count = await this.languageService.get('my_msg.unread_count');
    this.i18ns.last_msg_time = await this.languageService.get('my_msg.last_msg_time');
    this.i18ns.goto_detail = await this.languageService.get('my_msg.goto_detail');

    this.getUnReadCount();
  }

  goBack() {
    this.location.back();
  }

  async getUnReadCount() {
    await this.chatService.loginAndGetChatDialogList().then((data) => {
      let list1: Array<any> = new Array();
      let list2: Array<any> = new Array();
      for (const item of data) {
        if (item.unreadMessagesCount == 0 ) {
          list2.push(item);
        } else {
          list1.push(item);
        }
      }

      list1 = list1.sort((obj1, obj2) => {
        if (obj1.lastMessageAt > obj2.lastMessageAt) {
            return -1;
        }
        if (obj1.lastMessageAt < obj2.lastMessageAt) {
            return 1;
        }
        return 0;
      });

      list2 = list2.sort((obj1, obj2) => {
        if (obj1.lastMessageAt > obj2.lastMessageAt) {
            return -1;
        }
        if (obj1.lastMessageAt < obj2.lastMessageAt) {
            return 1;
        }
        return 0;
      });

      this.chatDlgList = list1.concat(list2);
    });
  }


  async toOrderDetail(chatDlg: any) {

    // console.log('chatDlg detail', chatDlg);
    const tempAdId = chatDlg._lcattrs.for;
    const tempOrderId = chatDlg._lcattrs.orderId;
    const tempAdUserId = chatDlg._lcattrs.adUserId;
    const tempAnotherUserId = chatDlg._lcattrs.anotherUserId;

    await this.adService.getOtcAdById({ adid: tempAdId }).then((adData) => {
      if ( adData.adType === '1') { // sell
        if (tempOrderId == undefined || tempOrderId == 0) {
          // this.router.navigate(['/transaction', { adId: tempAdId || '' }]);
          this.router.navigate(['/chat', { adId: tempAdId,
             adUserId: tempAdUserId, anotherUserId: tempAnotherUserId  }]);
        } else {
          this.router.navigate(['/orderDetail', { orderId: tempOrderId,
            adId: tempAdId, adUserId: tempAdUserId, anotherUserId: tempAnotherUserId }]);
        }
      } else { // buy
        if (tempOrderId == undefined || tempOrderId == 0) {
          // this.router.navigate(['/transactionB', { adId: tempAdId || '' }]);
          this.router.navigate(['/chat', { adId: tempAdId,
            adUserId: tempAdUserId, anotherUserId: tempAnotherUserId }]);
        } else {
          this.router.navigate(['/orderDetailB', { orderId: tempOrderId,
            adId: tempAdId, adUserId: tempAdUserId, anotherUserId: tempAnotherUserId }]);
        }
      }
    });
  }

}
