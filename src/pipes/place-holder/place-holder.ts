import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeHolder',
})

export class PlaceHolderPipe implements PipeTransform {
  transform(value: string, _default:string = "Write a Title:") {

    return (value) ? value : _default
  }
}
