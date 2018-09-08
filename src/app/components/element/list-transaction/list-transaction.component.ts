import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionListItem } from '../../../models/ad/TransactionListItem';

@Component({
  selector: 'gz-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {

  @Input()
  public transactionList: TransactionListItem[];

  @Input()
  adType: string;

  userId: string;

  constructor(private router: Router) {
    this.userId = localStorage.getItem('user_id');
  }

  ngOnInit() {

  }

  toTransaction(data: TransactionListItem) {
    this.router.navigate(['/transaction', { adId: data.adId || '' }]);
  }

  toUserDetail() {
    this.router.navigate(['/user', { userId: this.userId, coinType: '' }]);
  }

}
