import { Component, OnInit } from '@angular/core';
import { UserService } from '../../providers/user/user.service';
import { userCollectInfo } from '../../models/user/userCollectInfo';
import { LanguageService } from '../../providers/language/language.service';
import { Router,ActivatedRoute,Params  } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from '../../providers/dialog/dialog.service';


@Component({
  selector: 'gz-collection-info-detail',
  templateUrl: './collection-info-detail.component.html',
  styleUrls: ['./collection-info-detail.component.scss']
})
export class CollectionInfoDetailComponent implements OnInit {

  aliAccount: string = "";
  aliUserName: string = "";
  wxAccount: string = "";
  wxUserName: string = "";
  ebankName: string = "";
  ebankBranch: string = "";
  ebankAccount: string = "";
  ebankUserName: string = "";

  ercodePicUrl:string = "";
  ercodeInfo:string = "";

  userId: string = "";
  collectionInfo: userCollectInfo = new userCollectInfo();
  settype: string = "";

  aliImg: any = {};
  wxImg: any = {};

  i18ns: any = {};
  loading:boolean = false;
  showTip:boolean = false;
  constructor(private router: Router,
              private activeRoute : ActivatedRoute,
              private location: Location,
              private languageService: LanguageService,
              private userService: UserService,
              private dialogService: DialogService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.settype = params['settype'];
    });
    
    this.ercodePicUrl = "";

    this.showTip = false;
    this.collectionInfo = await this.userService.getCollectionInfoByUserId({ userid: this.userId });
    this.showTip = true;
    console.log(this.collectionInfo)
    this.i18ns.account = await this.languageService.get('user_collection.account');
    this.i18ns.username = await this.languageService.get('user_collection.username');
    this.i18ns.QRCode = await this.languageService.get('user_collection.QRCode');

    this.i18ns.bank = await this.languageService.get('user_collection.bank');
    this.i18ns.subbranch = await this.languageService.get('user_collection.subbranch');
    this.i18ns.collectname = await this.languageService.get('user_collection.collectname');
    this.i18ns.QRCode = await this.languageService.get('user_collection.QRCode');

    this.i18ns.tip_input = await this.languageService.get('user_collection.tip_input');
    this.i18ns.tip_upload = await this.languageService.get('user_collection.tip_upload');
    this.i18ns.input_right_image = await this.languageService.get('user_real_cert.input_right_image');
    this.i18ns.input_max_size = await this.languageService.get('user_real_cert.input_max_size');
    this.i18ns.aliacct = await this.languageService.get('user_collection.aliacct');
    this.i18ns.aliacctname = await this.languageService.get('user_collection.aliacctname');
    this.i18ns.paypic = await this.languageService.get('user_collection.paypic');
    this.i18ns.wechatacct = await this.languageService.get('user_collection.wechatacct');
    this.i18ns.wechatacctname = await this.languageService.get('user_collection.wechatacctname');
    this.i18ns.bankname = await this.languageService.get('user_collection.bankname');
    this.i18ns.branchname = await this.languageService.get('user_collection.branchname');
    this.i18ns.acctno = await this.languageService.get('user_collection.acctno');
    this.i18ns.acctname = await this.languageService.get('user_collection.acctname');
    this.i18ns.common_error = await this.languageService.get('otc.common_error');

    if(this.settype == "ali" && this.collectionInfo.alipay_qrcode_url != ""){
      this.aliImg.src = this.collectionInfo.minio_url_prefix + this.collectionInfo.alipay_qrcode_url;
      this.aliUserName = this.collectionInfo.alipay_name;
      this.aliAccount = this.collectionInfo.alipay_account;
      this.ercodePicUrl = this.collectionInfo.alipay_qrcode_url;
      this.aliImg.name = this.collectionInfo.alipay_qrcode_url;
    }else if(this.settype == "wx" && this.collectionInfo.wxpay_qrcode_url != ""){
      this.wxImg.src = this.collectionInfo.minio_url_prefix + this.collectionInfo.wxpay_qrcode_url;
      this.wxAccount = this.collectionInfo.wxpay_account;
      this.wxUserName = this.collectionInfo.wxpay_name;
      this.ercodePicUrl = this.collectionInfo.wxpay_qrcode_url;
      this.wxImg.name = this.collectionInfo.wxpay_qrcode_url;
    }else if(this.settype == "ebank"){
      this.ebankName = this.collectionInfo.ebank_bank;
      this.ebankBranch = this.collectionInfo.ebank_branch;
      this.ebankAccount = this.collectionInfo.ebank_account;
      this.ebankUserName = this.collectionInfo.ebank_name;
    }

    
    //this.ercodeInfo = "";
  }

  async submit(event) {
    
    if(this.settype == "ali"){
      if (!this.aliAccount || this.aliAccount.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.account);
      }
      if (!this.aliUserName || this.aliUserName.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.username);
      }
      if (!this.ercodePicUrl || this.ercodePicUrl == '') {
        return this.dialogService.alert(this.i18ns.tip_upload + this.i18ns.QRCode);
      }
    }
    if(this.settype == "wx"){
      if (!this.wxAccount || this.wxAccount.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.account);
      }
      if (!this.wxUserName || this.wxUserName.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.username);
      }
      if (!this.ercodePicUrl || this.ercodePicUrl == '') {
        return this.dialogService.alert(this.i18ns.tip_upload + this.i18ns.QRCode);
      }
    }
    if(this.settype == "ebank"){
      if (!this.ebankName || this.ebankName.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.bank);
      }
      if (!this.ebankBranch || this.ebankBranch.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.subbranch);
      }
      if (!this.ebankAccount || this.ebankAccount.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.account);
      }
      if (!this.ebankUserName || this.ebankUserName.trim() == '') {
        return this.dialogService.alert(this.i18ns.tip_input + this.i18ns.username);
      }
    }
    console.log('this.ercodeInfo:', this.ercodeInfo);
    let _params = {
      userid: this.userId,
      settype: this.settype,
      alipay_qrcode_url: this.settype == "ali"? this.ercodePicUrl : "" ,
      alipay_qrcode_info: this.ercodeInfo,
      alipay_account: this.encode(this.aliAccount) ,
      alipay_name: this.encode(this.aliUserName),
  
      wxpay_qrcode_url: this.settype == "wx"? this.ercodePicUrl : "",
      wxpay_qrcode_info: this.ercodeInfo,
      wxpay_account: this.encode(this.wxAccount),
      wxpay_name: this.encode(this.wxUserName),

      ebank_bank: this.encode(this.ebankName),
      ebank_branch: this.encode(this.ebankBranch),
      ebank_account: this.encode(this.ebankAccount),
      ebank_name: this.encode(this.ebankUserName),
    };

    console.log('para', _params);
    this.loading = true;
    try {
      this.userService.addOrUpdateCollectionInfo(_params).then( data => {
        this.loading = false;
        //console.log("http")
        //event.next(2000);
        this.router.navigate(['/collectionInfo']);
      }, error => {
        this.dialogService.alert(this.i18ns.submit_fail);
        this.loading = false;
        console.error(error);
      });
    } catch (e) {
      this.loading = false;
      console.error(e);
      let error = e.error && e.error != "" ? e.error: this.i18ns.submit_fail;
      this.dialogService.alert(e.error);
    }
    
  }

  private encode(param:string){
    if(param == "")
      return "";
    return param;
    //return encodeURI(param);
  }

  private getObjectURL (file) {
    return window.URL.createObjectURL(file);
  }

  private _toUploadB64(b64img) {
    if (b64img.indexOf(';base64,') != -1) {
      b64img = b64img.split(';base64,')[1];
    }
    return b64img;
  }

  private _getImgB64(file: any) {
    var reader = new FileReader();
    var fileInfo = {
      lastModified: file.lastModified,
      name: file.name,
      size: file.size,
      type: file.type,
      action: file.action,
      width: file.width,
      height: file.height
    };
    return new Promise((resolve, reject) => {
      reader.onload = function (re) {
        resolve({
          b64img: (<any>re.target).result,
          fileInfo: fileInfo,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  selectImg(img) {
    img.click();
  }

  async imgChange(event, imgObj) {
    const files = event && event.target && event.target.files;
    if (files) {
      const fileType = files[0].type.toUpperCase();

      const size = files[0].size;
      if (size > 10 * 1024 * 1024) {
        return this.dialogService.alert(this.i18ns.input_max_size);
      }

      if (fileType.indexOf('IMAGE') == -1) {
        return this.dialogService.alert(this.i18ns.input_right_image);
      }

      try {
        let _result: any = await this._getImgB64(files[0]);

        let _fileInfo = _result.fileInfo;
        
        /*console.log(this.getObjectURL(files[0]));// newfile[0]是通过input file上传的二维码图片文件
        qrcode.decode(this.getObjectURL(files[0]));
        qrcode.callback = function (imgMsg) {
            this.ercodeInfo = imgMsg
            console.log("二维码解析：" + this.ercodeInfo);
        }*/
        let _b64img = _result.b64img;
        if (_b64img.indexOf(';base64,') != -1) {
          _b64img = _b64img.split(';base64,')[1];
        }

        this.loading = true;
        let _pic_params = {
          file: _b64img,
          fileName: _fileInfo.name,
          oldfileName: this.ercodePicUrl
        };
        this.ercodePicUrl = await this.userService.postUploadCollectionInfoPicture(_pic_params);
        imgObj.src = _result.b64img;
        imgObj.name = _fileInfo.name;
        this.loading = false;

        console.log(this.ercodePicUrl);
      } catch (e) {
        this.dialogService.alert("Upload picture fail");
        console.error(e);
      }
    }
  } 

  //formatChar(event){
    //event.target.value = event.target.value.replace(/[^\w\u4e00-\u9fa5\s\-,。,]/gi, '');
  //}
  formatCharCommon(value){
    return value.replace(/[^\w\u4e00-\u9fa5\s\-,。,#@]/gi, '');
  }
  formatCharebankUserName(value){
    this.ebankUserName = this.formatCharCommon(value);
  }
  formatCharebankAccount(value){
    this.ebankAccount = this.formatCharCommon(value);
  }
  formatCharebankBranch(value){
    this.ebankBranch = this.formatCharCommon(value);
  }
  formatCharebankName(value){
    this.ebankName = this.formatCharCommon(value);
  }

  formatCharwxAccount(value){
    this.wxAccount = this.formatCharCommon(value);
  }
  formatCharwxUserName(value){
    this.wxUserName = this.formatCharCommon(value);
  }
  formatCharaliAccount(value){
    this.aliAccount = this.formatCharCommon(value);
  }
  formatCharaliUserName(value){
    this.aliUserName = this.formatCharCommon(value);
  }
  goBack() {
    this.router.navigate(['/collectionInfo']);
  }
}
