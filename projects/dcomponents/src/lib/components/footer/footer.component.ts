import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'd-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor() {}
  @Input() lang: 'zh' | 'en' = 'zh';
  @Input()
  data: DataModule = defaultDataZh;
  @Input()
  copyright = `© 2011-${new Date().getFullYear()} Wuhan Deepin Technology Co., Ltd.`;
  ngOnInit(): void {
    if (this.lang.startsWith('en')) {
      this.data = defaultDataEn;
    }
  }
}

export const defaultDataZh: DataModule = {
  nav: [
    {
      title: '关于Deepin',
      links: [
        { text: ' 关于我们', url: 'https://www.deepin.org/zh/aboutus/' },
        { text: ' 联系我们', url: 'https://www.deepin.org/zh/agreement' },
        { text: ' 条款协议', url: 'https://www.deepin.org/zh/agreement' },
      ],
    },
    {
      title: '海外社区',
      links: [
        {
          text: '西班牙',
          url: 'https://deepinenespañol.org/',
        },
        {
          text: '斯洛伐克',
          url: 'https://deepin.sk/',
        },
        {
          text: '土耳其',
          url: 'https://deepintr.js.org/',
        },
        {
          text: '巴西',
          url: 'https://deepinbrasil.github.io/',
        },
      ],
    },
    {
      title: '友情链接',
      links: [
        { text: 'Ventoy', url: 'https://www.deepin.org/zh/aboutus/' },
        { text: 'uTools', url: 'https://www.deepin.org/zh/agreement' },
      ],
    },
  ],
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
  nav: [
    {
      title: 'About Deepin',
      links: [
        { text: 'About Us', url: 'https://www.deepin.org/zh/aboutus/' },
        { text: 'Contact Us', url: 'https://www.deepin.org/zh/contactus/' },
        {
          text: 'Terms of Service',
          url: 'https://www.deepin.org/zh/agreement',
        },
      ],
    },
    {
      title: 'Communities',
      links: [
        {
          text: 'Spanish',
          url: 'https://deepinenespañol.org/',
        },
        {
          text: 'Slovak',
          url: 'https://deepin.sk/',
        },
        {
          text: 'Turkish',
          url: 'https://deepintr.js.org/',
        },
        {
          text: 'Brazilian',
          url: 'https://deepinbrasil.github.io/',
        },
      ],
    },
    {
      title: 'Links',
      links: [
        { text: 'Ventoy', url: 'https://www.ventoy.net/' },
        { text: 'uTools', url: 'https://www.u.tools/' },
      ],
    },
  ],
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
  nav: { title: string; links: link[] }[];
  follow: {
    qr?: { title?: string; imgs: qrImg[] };
    icon?: { title: string; imgs: iconLink[] };
  };
}

interface link {
  text: string;
  url: string;
  alt?: string;
}
interface qrImg {
  img: string;
  text: string;
  alt?: string;
}
interface iconLink extends link {
  img: string;
}
