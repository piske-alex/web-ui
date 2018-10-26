import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../providers/user/user.service';
import { User } from '../../models/user/user';
import { LanguageService } from '../../providers/language/language.service';
import { AdService } from '../../providers/ad/ad.service';
import { Deal } from '../../models/ad/Deal';
import { TransactionListItem } from '../../models/ad/TransactionListItem';
import { TradeItem } from 'src/app/models/common/TradeItem';

@Component({
  selector: 'gz-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userId: string;
  coinType: string;
  data: User = new User();

  publishList: TransactionListItem[] = [];
  dealWithMeList: TradeItem[] = [];

  total: number;
  isLoading: boolean;
  isShowLoadMore:boolean;

  i18ns: any = {};

  isSelectPublish = true;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private languageService: LanguageService,
              private adService: AdService,
              private userService: UserService) {
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.coinType = this.route.snapshot.paramMap.get('coinType');

    this.i18ns.hisPublishAd = await this.languageService.get('user.hisPublishAd');
    this.i18ns.iDealWithHim = await this.languageService.get('user.iDealWithHim');
    this.isLoading = true;
    this.loadPublishList();
    this.isLoading = false;
  }

  goBack() {
    this.location.back();
  }

  private async loadPublishList() {
    try {
      let _params = {
        type: '',
        country: '',
        coin: '',
        currency: '',
        payment: '',
        offset: 0,
        limit: 15,
        userid: this.userId,
      };
      this.isLoading = true;
      let _result = await this.adService.listTransactionList(_params);
      this.isLoading = false;
      this.publishList = _result.list;
      this.total = _result.total;
    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }

  }

  private async loadMorePublishList() {
    let currentListLength = 0;
      if (this.publishList) {
        currentListLength = this.publishList.length;
      }
    try {
      let _params = {
        type: '',
        country: '',
        coin: '',
        currency: '',
        payment: '',
        offset: currentListLength,
        limit: 100,
        userid: this.userId,
      };
      this.isLoading = true;
      let _result = await this.adService.listTransactionList(_params);
      this.isLoading = false;

      if (this.publishList) {
        const tempList = this.publishList.concat(_result.list);
        this.publishList = tempList;
      } else {
        this.publishList = _result.list;
      }
      this.total = _result.total;
      
      if (_result.total > this.publishList.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }
    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }

  }

  private async loadDealList() {
    try {
      this.isLoading = true;
      const _result = await this.adService.listDealList2({otherUserId: this.userId, offset: 0 , limit: 10});
      this.dealWithMeList = _result.list;
      this.total = _result.total;
      this.isLoading = false;
      if (_result.total > this.dealWithMeList.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }
    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }
  }

  private async loadMoreDealList() {
    try {
      let currentListLength = 0;
      if (this.dealWithMeList) {
        currentListLength = this.dealWithMeList.length;
      }

      this.isLoading = true;
      const _result = await this.adService.listDealList2({otherUserId: this.userId, offset: currentListLength , limit: 1000});
      this.isLoading = false;

      if (this.dealWithMeList) {
        const tempList = this.dealWithMeList.concat(_result.list);
        this.dealWithMeList = tempList;
      } else {
        this.dealWithMeList = _result.list;
      }
      this.total = _result.total;

      if (_result.total > this.dealWithMeList.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }

    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }
  }

  loadUserPageList(isSelectPublish:boolean){
    if(isSelectPublish)
      this.loadMorePublishList()
    else
      this.loadMoreDealList()
  }

  selectPublish() {
    this.isSelectPublish = true;
    this.loadPublishList();
  }

  selectDeal() {
    this.isSelectPublish = false;
    this.loadDealList();
  }
}
