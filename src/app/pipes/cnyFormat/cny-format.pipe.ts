import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnyFormat'
})
export class CnyFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    console.log('aaaa', value);
    let x = value;
    let x0 = x.toFixed(2);
    let x0Str = x0.toString();
    let i = x0Str.indexOf('.');
    let x1 = x0Str.substr(0, i);
    let x2 = x0Str.substr(i + 1);

    const reg1 = /\B(?=(\d{3})+(?!\d))/g; // 12,345,678
    let xNew = (x1).replace(reg1, '$&,') + '.' + (x2);

    // const reg2 = /\d{1,4}(?=(\d{4})+$)/g; // 1234 5678
    // let xNew = (x1).replace(reg1, '$&,') + '.' + (x2).replace(reg2, '$& ');
    return xNew;
  }

}
