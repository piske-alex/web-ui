import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { HelpCenterService } from "../../providers/help-center/help-center.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'gz-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  @Input()
  helpId: string;
  help: any = {};

  constructor(private route: ActivatedRoute,
              private location: Location,
              private helpCenterService: HelpCenterService,
              private domSanitized: DomSanitizer) {
  }

  ngOnInit() {
    let _helpId = this.route.snapshot.paramMap.get('id') || this.helpId;
    console.log('############_helpId: ', _helpId);
    if (_helpId) {
      this.help = this.helpCenterService.queryHelpById(_helpId);
    }
    if (this.help) {
      this.help.content = this.domSanitized.bypassSecurityTrustHtml(this.help.content);
    }
  }

  goBack() {
    this.location.back();
  }

}
