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

export const defaultDataZh: DataModule = {
  navs: navZH.nav,
  follow: {
    qr: {
      imgs: [
        {
          img: 'https://bbs.deepin.org/assets/contact/wx.png',
          text: '关注社区微信公众号',
        },
        {
          img: 'https://bbs.deepin.org/assets/contact/qq.png',
          text: '加入社区QQ交流群',
        },
      ],
    },
  },
};

export const defaultDataEn: DataModule = {
  navs: navEN.nav,
  follow: {
    icon: {
      title: 'Join Us',
      imgs: [
        {
          url: 'https://github.com/linuxdeepin',
          img: 'https://bbs.deepin.org/assets/contact/github2.png',
          text: 'GitHub',
        },
        {
          url: 'https://t.me/deepin',
          img: 'https://bbs.deepin.org/assets/contact/telegram.png',
          text: 'Telegram',
        },
        {
          url: 'https://www.facebook.com/deepinlinux',
          img: 'https://bbs.deepin.org/assets/contact/facebook.png',
          text: 'Facebook',
        },
        {
          url: 'https://twitter.com/linux_deepin',
          img: 'https://bbs.deepin.org/assets/contact/twitter.png',
          text: 'Twitter',
        },
        {
          url: 'https://www.reddit.com/r/deepin/',
          img: 'https://bbs.deepin.org/assets/contact/reddit.png',
          text: 'Reddit',
        },
        {
          url: 'https://discord.gg/xjjkcp6H2P',
          img: 'https://bbs.deepin.org/assets/contact/discord.png',
          text: 'Discord',
        },
      ],
    },
  },
};

export interface DataModule {
  navs: Nav[];
  follow: {
    qr?: { title?: string; imgs: qrImg[] };
    icon?: { title: string; imgs: iconLink[] };
  };
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
