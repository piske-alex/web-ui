import { Component, OnInit , OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../providers/user/user.service';
import { User } from '../../models/user/user';
import { ChatService } from '../../providers/chat/chat.service';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';
 // import { * } from '../../../assets/snippet.js';
// import '../../../assets/snippet.js';
 declare var zE: any;

@Component({
  selector: 'gz-my',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent implements OnInit {
  userId: string;
  user: any = new User();
  i18ns: any = {};
  isHadLogin: boolean;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private languageService: LanguageService,
              private userService: UserService,
              private dialogService: DialogService) {
  }

  ngOnDestroy(): void {
    zE(function() {zE.hide(); } );
  }

  async ngOnInit() {

    const _accessToken = localStorage.getItem('access_token');
    const _loginTimestamp = localStorage.getItem('login_timestamp');

    this.i18ns.confirm_logout = await this.languageService.get('user.confirm_logout');
    this.isHadLogin = false;
    // try {
    //   const _user = localStorage.getItem('user');
    //   if (_user) {
    //     this.isHadLogin = true;
    //     this.user = JSON.parse(_user);
    //     this.userId = this.user.id;
    //   } else {
    //     this.isHadLogin = false;
    //     localStorage.removeItem('user_id');
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('login_timestamp');
    //     localStorage.removeItem('access_token');
    //     await this.userService.logout();
    //     return;
    //   }

    // } catch (e) {
    //   console.error(e);
    // }
     localStorage.removeItem('user');

    try {
      if (_accessToken && Date.now() - +_loginTimestamp < 1000 * 60 * 30) {
        this.user = await this.userService.getDetail({});
        this.isHadLogin = true;
        // console.log('user detail: ', this.user);
        localStorage.setItem('user_id', this.user.id);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.chatService.initChat();
        this.chatService.loginChat();
      }

      const _user = localStorage.getItem('user');
      if (_user) {
        this.isHadLogin = true;
        this.user = JSON.parse(_user);
        this.userId = this.user.id;
      } else {
        this.isHadLogin = false;
        localStorage.removeItem('user_id');
        localStorage.removeItem('user');
        localStorage.removeItem('login_timestamp');
        localStorage.removeItem('access_token');
        await this.userService.logout();
        return;
      }

    } catch (e) {
      console.error(e);
      this.isHadLogin = false;
      localStorage.removeItem('user_id');
        localStorage.removeItem('user');
        localStorage.removeItem('login_timestamp');
        localStorage.removeItem('access_token');
        await this.userService.logout();
    }


  }

  goToSetting() {
    this.router.navigate(['/userSetting']);
  }

  async logout() {
    this.dialogService.confirm({ content: this.i18ns.confirm_logout }).subscribe(async res => {
      // 返回结果
      if (res) {
        await this.userService.logout();
        localStorage.removeItem('user_id');
        localStorage.removeItem('user');
        localStorage.removeItem('login_timestamp');
        localStorage.removeItem('access_token');
        this.chatService.closeChatClient();
        this.router.navigate(['/home']);
      } else {
          return;
      }
    });

  }

  showCustomerServiceIcon() {
     zE(function() {zE.show(); } );
  }

  gotohelp() {
     window.location.href = 'https://koin-exchangehelp.zendesk.com/hc/zh-tw';
  }

  setAvatar(avatarFile) {
    if (this.user && this.user.id) {
      avatarFile.click();
    }
  }

  async fileChange(event) {
    var files = event && event.target && event.target.files;
    if (files) {
      try {
        let _result: any = await this._getImgB64(files[0]);
        let _b64img = _result.b64img;
        this.user.avatar = _b64img;
        let _fileInfo = _result.fileInfo;
        if (_b64img.indexOf(';base64,') != -1) {
          _b64img = _b64img.split(';base64,')[1];
        }
        await this.userService.setAvatar({file: _b64img, fileName: _fileInfo.name})
      } catch (e) {
        console.error(e);
      }
    }
  }


  // async fileChange(event) {
  //   const files = event && event.target && event.target.files;
  //   if (files) {
  //     try {
  //       const _result: any = await this._getImgB64(files[0]);
  //       let _b64img = _result.b64img;
  //       this.user.avatar = _b64img;
  //       const _fileInfo = _result.fileInfo;
  //       if (_b64img.indexOf(';base64,') != -1) {
  //         _b64img = _b64img.split(';base64,')[1];
  //       }
  //       await this.userService.setBanner({
  //         file: _b64img,
  //         // oldfileName: 'c47cb23b-0cbc-4bf2-bb56-2db145f86c0c.png',
  //         oldfileName: '',
  //         fileName: _fileInfo.name
  //       }).then(
  //         (res) => {
  //           console.log('res', res);
  //         }, (err) => {

  //         }
  //       );
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  // }

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

}
