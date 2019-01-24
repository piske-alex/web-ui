import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'gz-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input()
  activeNavName = 'home';

  constructor(private languageService: LanguageService) {
  }

  ngOnInit() {
  }

  navTo(navName: string) {
    this.activeNavName = navName;
  }

  isActiveNav(navName: string) {
    return this.activeNavName === navName ? 'active' : '';
  }

  getHomeImg(navName) {
    let _img = 'icon-' + navName;
    if (this.activeNavName === navName) {
      _img += '-active';
    }

    switch (this.languageService.language) {
      case 'zh-CN':
        _img += '.zh';
        break;
      case 'en-GB':
        _img += '.en';
        break;
      case 'zh-HK':
        _img += '.hk';
        break;
    }

    _img += '.png';

    return _img;
  }

}
