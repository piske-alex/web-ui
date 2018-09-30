import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ad-show',
  templateUrl: './ad-show.component.html',
  styleUrls: ['./ad-show.component.scss']
})
export class AdShowComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
