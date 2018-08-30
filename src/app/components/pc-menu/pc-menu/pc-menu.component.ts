import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'gz-pc-menu',
  templateUrl: './pc-menu.component.html',
  styleUrls: ['./pc-menu.component.scss']
})
export class PcMenuComponent implements OnInit {

  @Input()
  activeNavName = 'home';

  constructor() {
  }

  ngOnInit() {
  }

  navTo(navName: string) {
    this.activeNavName = navName;
  }

  isActiveNav(navName: string) {
    return this.activeNavName === navName ? 'active' : '';
  }

}
