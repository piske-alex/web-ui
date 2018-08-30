import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../providers/common/common.service";
import { Location } from "@angular/common";
import { UserService } from "../../providers/user/user.service";
import { LanguageService } from "../../providers/language/language.service";
import { Router } from "@angular/router";

@Component({
  selector: 'gz-user-language',
  templateUrl: './user-language.component.html',
  styleUrls: ['./user-language.component.scss']
})
export class UserLanguageComponent implements OnInit {

  list: any[];

  constructor(private router: Router,
              private commonService: CommonService,
              private userService: UserService,
              private languageService: LanguageService,
              private location: Location) {
  }

  async ngOnInit() {
    try {
      this.list = await this.commonService.getLanguage();
    } catch (e) {
      console.error(e);
    }
  }

  goBack() {
    this.location.back();
  }

  async submit(data) {
    try {
      this.languageService.initConfig(data.code);
      let _result = await this.userService.setLanguage({code: data.code});
      // this.goBack();
    } catch (e) {
      console.error(e);
    }

    this.languageService.change(data.code);
    localStorage.setItem('language', data.code);

    this.router.navigate(['/my']);
  }


}
