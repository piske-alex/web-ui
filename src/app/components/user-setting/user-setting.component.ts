import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { UserService } from "../../providers/user/user.service";
import { User } from "../../models/user/user";

@Component({
  selector: 'gz-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  userId: string;
  user: User = new User();

  constructor(private location: Location,
              private userService: UserService,
              private router: Router) {
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    this.user = await this.userService.getDetail({id: this.userId});
  }

  goBack() {
    this.location.back();
  }

  goToVerify() {
    // if (this.user.kycStatus == 'unverified') {
      this.router.navigate(['/userRealCert']);
    // }
  }
}
