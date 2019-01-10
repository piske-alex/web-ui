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

    this.collectionInfo = await this.userService.getCollectionInfoByUserId({ userid: this.userId });

    this.i18ns.account = await this.languageService.get('user_collection.account');
    this.i18ns.username = await this.languageService.get('user_collection.username');
    this.i18ns.QRCode = await this.languageService.get('user_collection.QRCode');

    this.i18ns.bank = await this.languageService.get('user_collection.bank');
    this.i18ns.subbranch = await this.languageService.get('user_collection.subbranch');
    this.i18ns.collectname = await this.languageService.get('user_collection.collectname');
    this.i18ns.QRCode = await this.languageService.get('user_collection.QRCode');

    this.i18ns.tip_input = await this.languageService.get('user_collection.tip_input');
    this.i18ns.tip_upload = await this.languageService.get('user_collection.tip_upload');
    
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.settype = params['settype'];
    });
    

    this.ercodePicUrl = "";
    //this.ercodeInfo = "";
  }

  async submit() {

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
      alipay_qrcode_url: this.ercodePicUrl ,
      alipay_qrcode_info: this.ercodeInfo,
      alipay_account: this.encode(this.aliAccount) ,
      alipay_name: this.encode(this.aliUserName),
  
      wxpay_qrcode_url: this.ercodePicUrl,
      wxpay_qrcode_info: this.ercodeInfo,
      wxpay_account: this.encode(this.wxAccount),
      wxpay_name: this.encode(this.wxUserName),

      ebank_bank: this.encode(this.ebankName),
      ebank_branch: this.encode(this.ebankBranch),
      ebank_account: this.encode(this.ebankAccount),
      ebank_name: this.encode(this.ebankUserName),
    };

    console.log('para', _params);
    
    try {
      this.userService.addOrUpdateCollectionInfo(_params).then( data => {
        this.router.navigate(['/collectionInfo']);
      }, error => {
        this.dialogService.alert(this.i18ns.submit_fail);
        console.error(error);
      });
    } catch (e) {
      console.error(e);
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
        
        console.log(this.getObjectURL(files[0]));// newfile[0]是通过input file上传的二维码图片文件
        qrcode.decode(this.getObjectURL(files[0]));
        qrcode.callback = function (imgMsg) {
            this.ercodeInfo = imgMsg
            console.log("二维码解析：" + this.ercodeInfo);
        }

        let _pic_params = {
          file: _result.b64img,
          fileName: _fileInfo.name,
          oldfileName: this.ercodePicUrl
        };
        this.ercodePicUrl = await this.userService.postUploadCollectionInfoPicture(_pic_params);
        imgObj.src = _result.b64img;
        imgObj.name = _fileInfo.name;
        
        console.log(this.ercodePicUrl);
      } catch (e) {
        console.error(e);
      }
    }
  }

  goBack() {
    this.router.navigate(['/collectionInfo']);
  }
}
