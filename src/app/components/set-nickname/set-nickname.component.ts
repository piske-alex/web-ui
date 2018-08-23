import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { UserService } from "../../providers/user/user.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'gz-set-nickname',
  templateUrl: './set-nickname.component.html',
  styleUrls: ['./set-nickname.component.scss']
})
export class SetNicknameComponent implements OnInit {

  focusInput: string;

  userId: string;
  nickname: string;

  constructor(private location: Location,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  goBack() {
    this.location.back();
  }

  focus(inputName: string) {
    this.focusInput = inputName;
  }

  blur(inputName: string) {
    if (this.focusInput === inputName) {
      this.focusInput = '';
    }
  }

  isFocus(inputName: string): string {
    return this.focusInput === inputName ? 'active' : '';
  }

  async submit() {
    try {
      await this.userService.setNickname({username: this.nickname});
      this.router.navigate(['/my', {userId: this.userId}]);
    } catch (e) {
      console.error(e);
    }

    // // TODO delete
    // this.router.navigate(['/my', {userId: this.userId}]);
    // // TODO delete end.
  }
}
