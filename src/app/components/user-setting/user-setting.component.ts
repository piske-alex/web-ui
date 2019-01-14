import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../providers/user/user.service';
import { userCollectInfo } from '../../models/user/userCollectInfo';
import { User } from '../../models/user/user';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';

@Component({
  selector: 'gz-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  userId: string;
  user: User = new User();
  i18ns: any = {};
  collectionInfo: userCollectInfo = new userCollectInfo();
  collectionShowTip:string = "";

  constructor(private location: Location,
    private userService: UserService,
    private router: Router,
    private languageService: LanguageService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.i18ns.set_paypass_first = await this.languageService.get('user_setting.set_paypass_first');

    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    // try {
    //   const _user = localStorage.getItem('user');
    //   if (_user) {
    //     this.user = JSON.parse(_user);
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
    this.user = await this.userService.getDetail({ id: this.userId });
    // console.error(this.user);
    
    this.i18ns.ali = await this.languageService.get('user_collection.ali_short');
    this.i18ns.wx = await this.languageService.get('user_collection.wx_short');
    this.i18ns.ebank = await this.languageService.get('user_collection.ebank_short');
    this.i18ns.notset = await this.languageService.get('user_collection.not_set');
    this.i18ns.set = await this.languageService.get('user_collection.had_set');

    this.collectionInfo = await this.userService.getCollectionInfoByUserId({ userid: this.userId });
    if(this.collectionInfo.alipay_name !="" || this.collectionInfo.wxpay_name !="" || this.collectionInfo.ebank_name !=""){
      this.collectionShowTip = this.i18ns.set + "(";
      console.log(this.collectionInfo)
      if(this.collectionInfo.alipay_name !="")
        this.collectionShowTip = this.collectionShowTip + this.i18ns.ali + ",";
      if(this.collectionInfo.wxpay_name !="")
        this.collectionShowTip = this.collectionShowTip + this.i18ns.wx + ",";
      if(this.collectionInfo.ebank_name !="")
        this.collectionShowTip = this.collectionShowTip + this.i18ns.ebank + ",";
      if(this.collectionShowTip.endsWith(','))
        this.collectionShowTip = this.collectionShowTip.substring(0,this.collectionShowTip.lastIndexOf(","));
      this.collectionShowTip = this.collectionShowTip + ")";
    }else{
      this.collectionShowTip = this.i18ns.notset;
    }

    

  }

  goBack() {
    // this.location.back();
    this.router.navigate(['/my']);
  }

  goToVerify() {
    setTimeout(() => {
      if (!this.user.payPass ) {
        return this.dialogService.alert(this.i18ns.set_paypass_first);
       } else {
        if (!this.user.kycStatus  || this.user.kycStatus === 'unverified' ) {
          this.router.navigate(['/userRealCert']);
         }
       }
    }, 1000);
  }

  goToBindEmail() {
    if (!this.user.emailStatus || this.user.emailStatus === 'unset') {
      this.router.navigate(['/userEmail']);
    }
 }

}
