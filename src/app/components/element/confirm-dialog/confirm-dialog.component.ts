import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'gz-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  i18ns: any = {};

  config: any;

    constructor(public matDialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) data: any
    , private languageService: LanguageService) {
        this.config = data;
    }

    async ngOnInit() {
    this.i18ns.confirm_title = await this.languageService.get('common.confirm_title');
    this.i18ns.confirm =  await this.languageService.get('common.confirm');
    this.i18ns.cancel =  await this.languageService.get('common.cancel');
  }

  close() {
    this.matDialogRef.close();
  }

}
