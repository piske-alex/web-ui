import { Component, Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/element/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../components/element/alert-dialog/alert-dialog.component';
import { Observable, Subject } from 'rxjs/index';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor( @Inject(MatDialog) public _confirmDialog: MatDialog
  , @Inject(DOCUMENT) doc: any) {

    // 打开dialog，body添加no-scroll样式
    _confirmDialog.afterOpen.subscribe((ref: MatDialogRef<any>) => {
        // if (!doc.body.classList.contains('no-scroll')) {
        //     doc.body.classList.add('no-scroll');
        // }
    });
    // 关闭dialog，body移除no-scroll样式
    _confirmDialog.afterAllClosed.subscribe(() => {
        // doc.body.classList.remove('no-scroll');
    });
}

public confirm(contentOrConfig: any, title?: string): Observable<any> {
    // console.log('confirm---enter---111');
    // 设置dialog的属性，宽度，高度，内容等。
    let config = new MatDialogConfig();
    config = {
        width: '400px'// ,
       // height: '200px'
       , disableClose: true   // 点击对话框外不消失
       , hasBackdrop: true
    };
    if (contentOrConfig instanceof Object) {
        config.data = contentOrConfig;
    } else if ((typeof contentOrConfig) === 'string') {
        config.data = {
            content: contentOrConfig,
            title: title
        };
    }

    return this._confirmDialog.open(ConfirmDialogComponent, config).afterClosed();
}


public alert(contentOrConfig: any, title?: string): Observable<any> {
    // 设置dialog的属性，宽度，高度，内容等。
    let config = new MatDialogConfig();
    config = {
        width: '400px' // ,
       // height: '200px'
       , disableClose: true   // 点击对话框外不消失
       , hasBackdrop: true
    };
    if (contentOrConfig instanceof Object) {
        config.data = contentOrConfig;
    } else if ((typeof contentOrConfig) === 'string') {
        config.data = {
            content: contentOrConfig,
            title:  title
        };
    }

    return this._confirmDialog.open(AlertDialogComponent, config).afterClosed();
}


}
