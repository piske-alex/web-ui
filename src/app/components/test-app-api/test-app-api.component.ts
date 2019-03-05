import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpService } from '../../providers/http/http.service';
import { RouteMap } from '../../models/route-map/route-map.modle';
import { Router } from '@angular/router';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';
import { EnvironmentConstant } from '../../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-test-app-api',
  templateUrl: './test-app-api.component.html',
  styleUrls: ['./test-app-api.component.css']
})
export class TestAppApiComponent implements OnInit {

   API_URL_V1 = EnvironmentConstant.API_URL_V1;

   api2result: any;
   api3result: any;
   api4result: any;
   api5result: any;
   api6result: any;
   api7result: any;
   api8result: any;

   order: any = {};
   paypassword: string;
   old_order_amount: number;
   partfinishamount: number;

  constructor(private location: Location,
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private languageService: LanguageService,
    private commonService: CommonService,
    private dialogService: DialogService) { }

    async ngOnInit() {
      this.paypassword = 'Aa123456';
  }

  clearAllResult() {
    this.api2result = '';
    this.api3result = '';
    this.api4result = '';
    this.api5result = '';
    this.api6result = '';
    this.api7result = '';
    this.api8result = '';

    this.old_order_amount = 0;
    this.partfinishamount = 0;
  }

  // 2.限额
  merchant_a_get_user_remaining_quota() {
    const _params = {
       userid: localStorage.getItem('user_id')
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.GET, this.API_URL_V1,
       '/otc/merchant_a_get_user_remaining_quota'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

  // 3.余额
  merchant_a_get_remaining_balance() {
    const _params = {
       userid: localStorage.getItem('user_id')
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.GET, this.API_URL_V1,
       '/otc/merchant_a_get_remaining_balance'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

  // 4.历史
  merchant_a_get_transaction_history() {
    const _params = {
       userid: localStorage.getItem('user_id'),
       offset: 0,
       limit: 9999
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.GET, this.API_URL_V1,
       '/otc/merchant_a_get_transaction_history'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

  // 5.筹号
  merchant_a_get_standing_no() {
    const _params = {
       userid: localStorage.getItem('user_id')
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.GET, this.API_URL_V1,
       '/otc/merchant_a_get_standing_no'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

  // 6.抢单
  merchant_a_get_order() {
    const _params = {
       userid: localStorage.getItem('user_id')
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.POST, this.API_URL_V1,
       '/otc/merchant_a_get_order'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       if (data.success) {
        this.order = data.data.orderinfo;
        this.old_order_amount = data.data.orderinfo.amount;
       }
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

  // 7.收款
  merchant_a_mark_receipt() {
    const _params = {
       orderid: this.order.id,
       action: 'seller_confirm',
       paypassword: this.paypassword,
       updateTime : this.order.update_time
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.POST, this.API_URL_V1,
       '/otc/merchant_a_mark_receipt'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

  // 8.争议
  merchant_a_mark_dispute() {
    const _params = {
       orderid: this.order.id,
       action: 'dispute_submit',
       paypassword: this.paypassword,
       updateTime : this.order.update_time
    };

    this.httpService.request(new RouteJson(RouteMap.METHODS.POST, this.API_URL_V1,
       '/otc/merchant_a_mark_dispute'), _params).then(async (data) => {
       console.log('order', data);
       this.clearAllResult();
       this.api2result = JSON.stringify(data);
    }, error => {
      console.error('error test app api: ', error);
      this.clearAllResult();
      this.api2result = JSON.stringify(error);
    });
  }

 // 9.部分放币
 merchant_a_mark_partfinish() {
   if (this.partfinishamount <= 0
    || this.partfinishamount >= this.old_order_amount) {
      alert('invalid part finish amount');
      return;
   }

  const _params = {
     orderid: this.order.id,
     action: 'partfinish',
     paypassword: this.paypassword,
     partfinish_amount: this.partfinishamount,
     updateTime : this.order.update_time
  };

  this.httpService.request(new RouteJson(RouteMap.METHODS.POST, this.API_URL_V1,
     '/otc/merchant_a_mark_partfinish'), _params).then(async (data) => {
     console.log('order', data);
     this.clearAllResult();
     this.api2result = JSON.stringify(data);
  }, error => {
    console.error('error test app api: ', error);
    this.clearAllResult();
    this.api2result = JSON.stringify(error);
  });
}


}

export class RouteJson {
  method: string;
  url: string;

  constructor(method, apiUrl, url: string) {
    this.method = method;
    this.url = apiUrl + url;
  }
}
