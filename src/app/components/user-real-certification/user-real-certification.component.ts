import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectCountryComponent } from "../element/select-country/select-country.component";
import { Country } from "../../models/common/Country";
import { UserService } from "../../providers/user/user.service";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

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

  @ViewChild(SelectCountryComponent)
  private selectCountryComponent;

  constructor(private router: Router,
              private location: Location,
              private userService: UserService) {
  }

  ngOnInit() {
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
    let _params = {
      realName: this.realName,
      realCardNo: this.realCardNo,
      agree: this.isSelectPromise,
      // countryCode: this.countryCode,
      frontPhotoName: this.frontImg.name,
      backPhotoName: this.backImg.name,
      halfPhotoName: this.halfImg.name,
      frontPhoto: this._toUploadB64(this.frontImg.src),
      backPhoto: this._toUploadB64(this.backImg.src),
      halfPhoto: this._toUploadB64(this.halfImg.src),
    };

    try {
      let _result = await this.userService.realCertifiation(_params);
      this.goBack();
    } catch (e) {
      console.error(e);
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

        console.log('this.backImg: ', imgObj);
        console.log('this.backImg: ', this.backImg);
      } catch (e) {
        console.error(e);
      }
    }
  }

}
