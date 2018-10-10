import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../../providers/language/language.service';
import { ChatService } from '../../providers/chat/chat.service';
import { DialogService } from '../../providers/dialog/dialog.service';
import { AdService } from '../../providers/ad/ad.service';


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
    this.i18ns.myMsg = await this.languageService.get('otc.myMsg');

    this.getUnReadCount();
  }

  goBack() {
    this.location.back();
  }

  async getUnReadCount() {
    await this.chatService.loginAndGetChatDialogList().then((data) => {
      this.chatDlgList = data;
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
        if (tempOrderId === undefined || tempOrderId === 0) {
          this.router.navigate(['/transaction', { adId: tempAdId || '' }]);
        } else {
          this.router.navigate(['/orderDetail', { orderId: tempOrderId,
            adId: tempAdId, adUserId: tempAdUserId, anotherUserId: tempAnotherUserId }]);
        }
      } else { // buy
        if (tempOrderId === undefined || tempOrderId === 0) {
          this.router.navigate(['/transactionB', { adId: tempAdId || '' }]);
        } else {
          this.router.navigate(['/orderDetailB', { orderId: tempOrderId,
            adId: tempAdId, adUserId: tempAdUserId, anotherUserId: tempAnotherUserId }]);
        }
      }
    });
  }

}
