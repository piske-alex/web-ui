import { Component, OnInit,Input } from '@angular/core';
import { UserService } from '../../../providers/user/user.service';
import { LanguageService } from '../../../providers/language/language.service';
import { Router,ActivatedRoute,Params  } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from '../../../providers/dialog/dialog.service';
import { PaymentCertification } from '../../../models/ad/PaymentCertification';
import { AdService } from '../../../providers/ad/ad.service';

@Component({
  selector: 'gz-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {

  @Input()
  public orderid: string = "";
  @Input()
  public adid: string = "";

  certImg:any = {};
  userId: string = "";
  i18ns: any = {};
  loading:boolean = false;
  ercodePicUrl:string = "";
  itemList: PaymentCertification[];

  constructor(private router: Router,
    private activeRoute : ActivatedRoute,
    private location: Location,
    private languageService: LanguageService,
    private userService: UserService,
    private adService: AdService,
    private dialogService: DialogService) { }

  async ngOnInit() {
    this.i18ns.delete = await this.languageService.get('paymentCertification.delete');
    this.i18ns.upload = await this.languageService.get('user_collection.upload');


    this.userId = localStorage.getItem('user_id');
    this.freshList();
  }

  private async freshList(){
    this.itemList = await this.adService.getPaymentCertList({userid:this.userId , orderid:this.orderid, adid:this.adid});
  }

  async DeleteItem(id:number){
    this.adService.postPaymentCert({id: id, action:"del"}).then(async (data) => {
      this.freshList();
    }, error => {
      console.error('---------------------error: ', error);
      this.dialogService.alert("delete fail.");
    });
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

  async imgChange(event) {
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
        
        let _b64img = _result.b64img;
        if (_b64img.indexOf(';base64,') != -1) {
          _b64img = _b64img.split(';base64,')[1];
        }

        this.loading = true;
        let _pic_params = {
          file: _b64img,
          fileName: _fileInfo.name
        };
        let certFile = await this.userService.postUploadPaymentCertPicture(_pic_params);
        console.log(certFile);

        if(certFile == "" || certFile == undefined){
          this.dialogService.alert("upload cert image fail.");
          this.loading = false;
          return;
        }

        this.adService.postPaymentCert({userid:this.userId , orderid:this.orderid, adid:this.adid ,certificate_url: certFile , action:"add"}).then(async (data) => {
          this.freshList();
        }, error => {
          console.error('---------------------error: ', error);
          this.dialogService.alert("upload cert fail.");
        });

        //certImg.name = _fileInfo.name;
        //imgObj.src = _result.b64img;
        //imgObj.name = _fileInfo.name;
        this.loading = false;

        
      } catch (e) {
        console.error(e);
      }
    }
  } 



}
