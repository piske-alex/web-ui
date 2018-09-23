import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../providers/user/user.service';
import { User } from '../../models/user/user';
import { ChatService } from '../../providers/chat/chat.service';

@Component({
  selector: 'gz-my',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent implements OnInit {

  user: any = new User();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private userService: UserService) {
  }

  async ngOnInit() {

    const _accessToken = localStorage.getItem('access_token');
    const _loginTimestamp = localStorage.getItem('login_timestamp');

    try {
      const _user = localStorage.getItem('user');
      if (_user) {
        this.user = JSON.parse(_user);
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('user');

    if (_accessToken && Date.now() - +_loginTimestamp < 1000 * 60 * 30) {
      this.user = await this.userService.getDetail({});
      localStorage.setItem('user_id', this.user.id);
      localStorage.setItem('user', JSON.stringify(this.user));
      this.chatService.loginChat();
    }

  }

  goToSetting() {
    this.router.navigate(['/userSetting']);
  }

  async logout() {
    if (confirm('确定要退出吗？')) {
      await this.userService.logout();
      localStorage.removeItem('user_id');
      localStorage.removeItem('user');
      localStorage.removeItem('login_timestamp');
      localStorage.removeItem('access_token');

      this.router.navigate(['/home']);
    }
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
