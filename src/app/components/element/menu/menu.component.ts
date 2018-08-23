import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gz-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input()
  activeNavName = 'otc';

  constructor() {
  }

  ngOnInit() {
  }

  navTo(navName: string) {
    this.activeNavName = navName;

    console.log(this.activeNavName);
  }

  isActiveNav(navName: string) {
    return this.activeNavName === navName ? 'active' : '';
  }

}
