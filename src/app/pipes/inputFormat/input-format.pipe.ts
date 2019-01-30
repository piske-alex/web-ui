import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputFormat'
})
export class InputFormatPipe implements PipeTransform {

  transform(value: string): string {
    console.log(value)
    let v = value.replace(/\d/ig,"");
    console.log(v)
    return v;
  }

}
