import { Component } from '@angular/core';

@Component({
  selector: 'd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'deepin-components';
  lang = location.search ? (location.search.slice(1) as 'zh' | 'en') : 'zh';
}
