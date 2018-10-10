import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { LanguageService } from '../../../providers/language/language.service';


@Component({
  selector: 'gz-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  i18ns: any = {};

  config: any;

  constructor(public matDialogRef: MatDialogRef<AlertDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any
  , private languageService: LanguageService) {
      this.config = data;
  }

  async ngOnInit() {
  this.i18ns.alert_title =  await this.languageService.get('common.alert_title');
  this.i18ns.alert_ok =  await this.languageService.get('common.alert_ok');
}

close() {
  this.matDialogRef.close();
}

}
