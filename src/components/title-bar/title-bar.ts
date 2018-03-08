import {Component, Input} from '@angular/core';

/**
 * Generated class for the TitleBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {

  @Input() pageTitle: string;

  @Input() isSearch: string;

  constructor() {
    console.log('Hello TitleBarComponent Component');
    this.pageTitle = '植物大全';
    console.log(this.pageTitle);
    console.log(this.isSearch);
  }

}
