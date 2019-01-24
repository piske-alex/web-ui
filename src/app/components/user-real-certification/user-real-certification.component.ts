import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectCountryComponent } from '../element/select-country/select-country.component';
import { Country } from '../../models/common/Country';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from '../../providers/dialog/dialog.service';

@Component({
  selector: 'gz-user-real-certification',
  templateUrl: './user-real-certification.component.html',
  styleUrls: ['./user-real-certification.component.scss']
})
export class UserRealCertificationComponent implements OnInit {

  countryCode: string = 'CN';
  realName: string;
  realCardNo: string;
  isSelectPromise: boolean;
  frontImg: any = {};
  backImg: any = {};
  halfImg: any = {};
  credType: string = '1';

  country: Country = new Country();
  isSubmit: boolean = false;

  i18ns: any = {};
  loading:boolean = false;
  fontloading:boolean = false;
  backloading:boolean = false;
  halfloading:boolean = false;

  @ViewChild(SelectCountryComponent)
  private selectCountryComponent;

  constructor(private router: Router,
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

    this.i18ns.input_name = await this.languageService.get('user_real_cert.input_name');
    this.i18ns.input_cardno = await this.languageService.get('user_real_cert.input_cardno');
    this.i18ns.card_front = await this.languageService.get('user_real_cert.card_front');
    this.i18ns.card_back = await this.languageService.get('user_real_cert.card_back');
    this.i18ns.bust = await this.languageService.get('user_real_cert.bust');
    this.i18ns.input_card_front = await this.languageService.get('user_real_cert.input_card_front');
    this.i18ns.input_card_back = await this.languageService.get('user_real_cert.input_card_back');
    this.i18ns.input_bust = await this.languageService.get('user_real_cert.input_bust');
    this.i18ns.checked_promise = await this.languageService.get('user_real_cert.checked_promise');
    this.i18ns.input_right_image = await this.languageService.get('user_real_cert.input_right_image');
    this.i18ns.input_max_size = await this.languageService.get('user_real_cert.input_max_size');
    this.i18ns.submit_fail = await this.languageService.get('user_real_cert.submit_fail');
    this.i18ns.upload = await this.languageService.get("user_collection.upload");

    this.frontImg.isLoadShow = false;
    this.backImg.isLoadShow = false;
    this.frontImg.isLoadShow = false;

  }

  goBack() {
    this.location.back();
  }

  toSelectCountry() {
    this.selectCountryComponent.toSelectCountry();
  }

  selectCountry(data) {
    if (data) {
      this.country = data;
      this.countryCode = data.code;
    }
  }

  async submit() {
    if(this.isSubmit){
      return;
    }

    if (!this.realName || this.realName.trim() == '') {
      return this.dialogService.alert(this.i18ns.input_name);
    }
    if (!this.realCardNo || this.realCardNo.trim() == '') {
      return this.dialogService.alert(this.i18ns.input_cardno);
    }
    if (!this.frontImg.name) {
      return this.dialogService.alert(this.i18ns.input_card_front);
    }
    if (!this.backImg.name) {
      return this.dialogService.alert(this.i18ns.input_card_back);
    }
    if (!this.halfImg.name) {
      return this.dialogService.alert(this.i18ns.input_bust);
    }
    if (!this.isSelectPromise) {
      return this.dialogService.alert(this.i18ns.checked_promise);
    }

    let _params = {
      realName: this.realName,
      idNumber: this.realCardNo,
      agree: this.isSelectPromise,
      // countryCode: this.countryCode,
      frontPhotoName: this.frontImg.name,
      backPhotoName: this.backImg.name,
      halfPhotoName: this.halfImg.name,
      //frontPhoto: this._toUploadB64(this.frontImg.src),
      //backPhoto: this._toUploadB64(this.backImg.src),
      //halfPhoto: this._toUploadB64(this.halfImg.src),
    };

    console.log('real-cert para', _params);
    this.isSubmit = true;

    this.loading = true;
    try {

      this.userService.realCertifiation(_params).then( data => {
        this.isSubmit = false;
        this.loading = false;
        // this.goBack();
      this.router.navigate(['/userSetting']);
      }, error => {
        this.isSubmit = false;
        this.loading = false;
        this.dialogService.alert(this.i18ns.submit_fail);
        console.error(error);
      });
    } catch (e) {
      this.isSubmit = false;
      this.loading = false;
      console.error(e);
      this.dialogService.alert(e.error);
    }
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

      this.loading = true;
      imgObj.isLoadShow = true;

      try {
        let _result: any = await this._getImgB64(files[0]);
        let _fileInfo = _result.fileInfo;
        let _b64img = _result.b64img;
        if (_b64img.indexOf(';base64,') != -1) {
          _b64img = _b64img.split(';base64,')[1];
        }

        let _pic_params = {
          file: _b64img,
          fileName: _fileInfo.name
        };
        let usercertpic = await this.userService.postUploadUserCertPicture(_pic_params);
        imgObj.src = _result.b64img;
        imgObj.name = usercertpic; //数据库存的名称
        this.loading = false;
        imgObj.isLoadShow = this.loading;

      } catch (e) {
        this.loading = false;
        imgObj.isLoadShow = this.loading;
        this.dialogService.alert("Upload picture fail");
        console.error(e);
      }
    }
  }

}
