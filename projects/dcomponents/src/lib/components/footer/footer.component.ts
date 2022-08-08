import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import navEN from './nav_en.json';
import navZH from './nav_zh.json';

@Component({
  selector: 'd-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnChanges {
  constructor() {}
  @HostBinding('class') class = 'd-footer';
  @Input() lang: 'zh' | 'en' = 'zh';
  @Input() data!: string;
  @Input()
  copyright = `© 2011-${new Date().getFullYear()} Wuhan Deepin Technology Co., Ltd.`;

  _data!: DataModule;

  ngOnInit(): void {
    this.init();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  init() {
    if (this.data) {
      this._data = JSON.parse(this.data);
      return;
    }
    if (this.lang.startsWith('zh')) {
      this._data = defaultDataZh;
    } else {
      this._data = defaultDataEn;
    }
  }
}

export const defaultDataZh: DataModule = navZH;
export const defaultDataEn: DataModule = navEN;

export interface DataModule {
  navs: Nav[];
  qr?: { title: string; imgs: qrImg[] };
  icon?: { title: string; imgs: iconLink[] };
}
interface Nav {
  title: string;
  links: link[];
}
interface link {
  text: string;
  url: string;
}
interface qrImg {
  img: string;
  text: string;
  alt?: string;
}
interface iconLink extends link {
  img: string;
  alt?: string;
}
