import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { TransactionListItem } from '../../models/ad/TransactionListItem';
import { UserService } from '../../providers/user/user.service';
import { ListChatingComponent } from '../element/list-chating/list-chating.component';
import { LanguageService } from '../../providers/language/language.service';


@Component({
  selector: 'gz-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  data: TransactionListItem = new TransactionListItem();
  chatTemplates: any[];
  adId: string;
  i18ns: any = {};
  currentLoginUserId: string;

  adUserId: string;
  anotherUserId: string;

  @ViewChild(ListChatingComponent)
  private listChatingComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private adService: AdService,
              private userService: UserService,
              private languageService: LanguageService,
              private location: Location) {
  }

  async ngOnInit() {
    this.currentLoginUserId = localStorage.getItem('user_id');
    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adUserId = this.route.snapshot.paramMap.get('adUserId');
    this.anotherUserId = this.route.snapshot.paramMap.get('anotherUserId');
    this.data = await this.adService.getOtcAdById({adid: this.adId});

    this.i18ns.sell = await this.languageService.get('chat.sell');
    this.i18ns.buy = await this.languageService.get('chat.buy');
    this.i18ns.order = await this.languageService.get('chat.order');
    this.i18ns.chat_template_1 = await this.languageService.get('chat.chat_template_1');
    this.i18ns.chat_template_2 = await this.languageService.get('chat.chat_template_2');
    this.i18ns.chat_template_3 = await this.languageService.get('chat.chat_template_3');
    this.i18ns.chat_template_4 = await this.languageService.get('chat.chat_template_4');

    this.chatTemplates = [
      {id: 1, value: this.i18ns.chat_template_1},
      {id: 2, value: this.i18ns.chat_template_2},
      {id: 3, value: this.i18ns.chat_template_3},
      {id: 4, value: this.i18ns.chat_template_4},
    ];

    setTimeout(() => {
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 150;
    }, 2000);
  }

  goBack() {
    this.location.back();
  }

  goToHelp() {
    this.router.navigate(['/help', {type: 'sell'}]);
  }

  getTitle() {
    if (this.data && this.data.transactionCoinType) {
      let desc = '';
      desc = desc + `${this.data.transactionCoinType} `;
      if (this.data.adType === '2') {
        desc = desc + `${this.i18ns.sell} `;
      } else {
        desc = desc + `${this.i18ns.buy} `;
      }
      desc = desc + `${this.i18ns.order}`;
      desc = desc + `(${this.data.username})`;
      return desc;
      // return `${this.data.transactionCoinType}   ${this.data.adType === '2' ? '出售' : '购买'}  订单(${this.data.username})`;
    } else {
      return this.i18ns.order;
    }
  }

  sendTemplate(template) {
    this.listChatingComponent.send(template.value);
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      // document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 100;

      setTimeout(() => {
        document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      }, 1000);

  }

  async transaction() {
    if (this.data.adType == '1') {
      this.router.navigate(['/transaction', { adId: this.data.adId || '' }]);
    } else if (this.data.adType == '2') {
      this.router.navigate(['/transactionB', { adId: this.data.adId || '' }]);
    }
  }
}
