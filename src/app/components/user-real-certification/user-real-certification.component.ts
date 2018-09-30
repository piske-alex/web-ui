import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectCountryComponent } from '../element/select-country/select-country.component';
import { Country } from '../../models/common/Country';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  i18ns: any = {};

  @ViewChild(SelectCountryComponent)
  private selectCountryComponent;

  constructor(private router: Router,
              private location: Location,
              private languageService: LanguageService,
              private userService: UserService) {
  }

  async ngOnInit() {
    this.i18ns.input_name = await this.languageService.get('user_real_cert.input_name');
    this.i18ns.input_cardno = await this.languageService.get('user_real_cert.input_cardno');
    this.i18ns.card_front = await this.languageService.get('user_real_cert.card_front');
    this.i18ns.card_back = await this.languageService.get('user_real_cert.card_back');
    this.i18ns.bust = await this.languageService.get('user_real_cert.bust');
    this.i18ns.input_card_front = await this.languageService.get('user_real_cert.input_card_front');
    this.i18ns.input_card_back = await this.languageService.get('user_real_cert.input_card_back');
    this.i18ns.input_bust = await this.languageService.get('user_real_cert.input_bust');
    this.i18ns.checked_promise = await this.languageService.get('user_real_cert.checked_promise');
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
    if (!this.realName) {
      return alert(this.i18ns.input_name);
    }
    if (!this.realCardNo) {
      return alert(this.i18ns.input_cardno);
    }
    if (!this.frontImg.name) {
      return alert(this.i18ns.input_card_front);
    }
    if (!this.backImg.name) {
      return alert(this.i18ns.input_card_back);
    }
    if (!this.halfImg.name) {
      return alert(this.i18ns.input_bust);
    }
    if (!this.isSelectPromise) {
      return alert(this.i18ns.checked_promise);
    }

    let _params = {
      realName: this.realName,
      idNumber: this.realCardNo,
      agree: this.isSelectPromise,
      // countryCode: this.countryCode,
      frontPhotoName: this.frontImg.name,
      backPhotoName: this.backImg.name,
      halfPhotoName: this.halfImg.name,
      frontPhoto: this._toUploadB64(this.frontImg.src),
      backPhoto: this._toUploadB64(this.backImg.src),
      halfPhoto: this._toUploadB64(this.halfImg.src),
    };

    console.log('real-cert para',_params);

    try {
      let _result = await this.userService.realCertifiation(_params);
      this.goBack();
    } catch (e) {
      console.error(e);
      alert(e.error);
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
        })
      };
      reader.readAsDataURL(file);
    });
  }

  selectImg(img) {
    img.click();
  }

  async imgChange(event, imgObj) {
    var files = event && event.target && event.target.files;
    if (files) {
      try {
        let _result: any = await this._getImgB64(files[0]);
        imgObj.src = _result.b64img;
        let _fileInfo = _result.fileInfo;
        imgObj.name = _fileInfo.name;
      } catch (e) {
        console.error(e);
      }
    }
  }

}
