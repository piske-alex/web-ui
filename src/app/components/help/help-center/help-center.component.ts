import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { HelpCenterService } from "../../../providers/help-center/help-center.service";
import { Router } from "@angular/router";

@Component({
  selector: 'gz-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {

  helpList: any;

  constructor(private location: Location, private router: Router, private helpCenterService: HelpCenterService) {
  }

  ngOnInit() {
    window.location.href = 'https://kcb.zendesk.com/';
  }

}
