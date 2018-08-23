import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { AdService } from "../../providers/ad/ad.service";
import { TransactionListItem } from "../../models/ad/TransactionListItem";
import { UserService } from "../../providers/user/user.service";
import { ListChatComponent } from "../element/list-chat/list-chat.component";


@Component({
  selector: 'gz-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  data: TransactionListItem = new TransactionListItem();
  chatTemplates: any[];
  adId: string;

  @ViewChild(ListChatComponent)
  private listChatComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private adService: AdService,
              private userService: UserService,
              private location: Location) {
  }

  async ngOnInit() {

    this.adId = this.route.snapshot.paramMap.get('adId');
    this.data = await this.adService.getOtcAdById({adid: this.adId});

    this.chatTemplates = [
      {id: 1, value: '你好，请问在吗？'},
      {id: 2, value: '你好，请问可以及时付款吗？'},
      {id: 3, value: '你好，请问付款跟实名是一致的吗？'},
      {id: 4, value: '你好，请问可以设置信任进行交易吗？'},
    ]
  }

  goBack() {
    this.location.back();
  }

  goToHelp() {
    this.router.navigate(['/help', {type: 'sell'}])
  }

  getTitle() {
    if (this.data && this.data.transactionCoinType) {
      return `${this.data.transactionCoinType}   ${this.data.adType == '1' ? '出售' : '购买'}  订单(${this.data.username})`;
    } else {
      return '订单';
    }
  }

  sendTemplate(template) {
    this.listChatComponent.send(template.value);
  }

  async transaction() {
    this.location.back();
  }
}
