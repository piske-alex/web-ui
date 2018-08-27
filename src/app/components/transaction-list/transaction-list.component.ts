import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { WalletService } from "../../providers/wallet/wallet.service";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'gz-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  monthDates: string[] = [];
  transactions: any = {};

  coinType: string;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private walletService: WalletService) {
  }

  async ngOnInit() {
    this.coinType = this.route.snapshot.paramMap.get('coinType');

    let _transactions = await this.walletService.walletTransaction({
      accountType: 'otc',
      coin: this.coinType,
      // type: 'receive',
      offset: 0,
      limit: 1000,
    });

    this.monthDates = [];
    this.transactions = [];
    _transactions.forEach(_data => {
      let _date = moment(_data.confirmTime).format('YYYY-MM');
      _data.confirmTime = moment(_data.confirmTime).format('YYYY-MM-DD HH:mm');
      this.transactions[_date] = this.transactions[_date] || [];
      this.transactions[_date].push(_data);
    });
    this.monthDates = Object.keys(this.transactions);

  }

  goBack() {
    this.location.back();
  }

}
