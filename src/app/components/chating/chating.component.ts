import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { LanguageService } from '../../providers/language/language.service';
import { ListChatingComponent } from '../element/list-chating/list-chating.component';


@Component({
  selector: 'app-chating',
  templateUrl: './chating.component.html',
  styleUrls: ['./chating.component.scss']
})
export class ChatingComponent implements OnInit {
  delayDesc: string;
  orderId: string;
  order: any = {};
  i18ns: any = {};
  _ordertimer: any = 1;
  chatmsg: string;
  adId: string;
  adUserId: string;
  anotherUserId: string;
  isAdOwner: boolean;
  timeout: boolean;

  loginUserId: number ;


  @ViewChild(ListChatingComponent)
  private listChatingComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private languageService: LanguageService,
              private adService: AdService) {
  }

  async ngOnInit() {

    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adUserId = this.route.snapshot.paramMap.get('adUserId');

    this.anotherUserId = this.route.snapshot.paramMap.get('anotherUserId');
    this.orderId = this.route.snapshot.paramMap.get('orderId');

    this.loginUserId = 25;
    const currentLoginUserId = '25'; // localStorage.getItem('user_id');
    if (currentLoginUserId === this.adUserId) {
      this.isAdOwner = true;
    } else {
      this.isAdOwner = false;
    }

    this.i18ns.waitPay = await this.languageService.get('otc.waitPay');
    this.i18ns.minute = await this.languageService.get('otc.minute');
    this.i18ns.second = await this.languageService.get('otc.second');
    this.i18ns.pay_timeout = await this.languageService.get('otc.pay_timeout');

    setTimeout(() => {
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 150;
    }, 2000);

  }

  goBack() {
    this.location.back();
  }

  async updateChatList() {
    await this.listChatingComponent.refreshchatlist();
 }

  async sendChatMsg() {
    console.log('chatmsg', this.chatmsg);
    if (!this.chatmsg) {

    } else {
      this.listChatingComponent.send(this.chatmsg);
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      // document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 100;

      setTimeout(() => {
        document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      }, 1000);
      this.chatmsg = '';
    }

  }
}
