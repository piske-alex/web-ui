import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'btcFormat'
})
export class BtcFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }

    const x = parseFloat(value); // Number
    const x0 = x.toFixed(8);
    const x0Str = x0.toString();
    const i = x0Str.indexOf('.');
    const x1 = x0Str.substr(0, i);
    const x2 = x0Str.substr(i + 1);

    const reg1 = /\B(?=(\d{3})+(?!\d))/g; // 12,345,678
    const reg2 = /\d{1,4}(?=(\d{4})+$)/g; // 1234 5678

    const xNew = (x1).replace(reg1, '$&,') + '.' + (x2).replace(reg2, '$& ');
    return xNew;

  }

}
