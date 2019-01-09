import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { HelpCenterService } from "../../../providers/help-center/help-center.service";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

const $ = (<any>window).$;

@Component({
  selector: 'gz-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {

  externalHelpUrl: any;

  constructor(private location: Location,
              private router: Router,
              private helpCenterService: HelpCenterService,
              private domSanitized: DomSanitizer) {
  }

  ngOnInit() {
    this.externalHelpUrl = 'https://koin-exchangehelp.zendesk.com';

     window.location.href = this.externalHelpUrl;

  }

  goBack() {
    this.location.back();
  }

}
