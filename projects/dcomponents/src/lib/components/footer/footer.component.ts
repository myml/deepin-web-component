import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

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

function mingdaoMenuToJSON(menuStr: string) {
  const menuRaw = menuStr;
  // parse csv
  const arr = menuRaw
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => line.split(','))
    .map((arr) => {
      const [id, title, sort, link, parent] = arr;
      return { id, title, sort: Number(sort), url: link ? link : null, parent };
    });
  // Sort and group
  return arr
    .filter((item) => !item.parent)
    .sort((a, b) => a.sort - b.sort)
    .map((item) => {
      // find children and sort
      const links = arr
        .filter((child) => child.parent === item.title)
        .sort((a, b) => a.sort - b.sort)
        .map((child) => {
          return { text: child.title, url: child.url };
        });

      return { title: item.title, links: links } as Nav;
    });
}

// 明道云 export csv
const footerMD = `
记录ID,显示名称,位置排序,链接,父
07e46d8f-9b19-4110-bfa7-4e0ee975035e,Ventoy,10,https://www.ventoy.net,友情链接
b9cd3f41-507e-4f32-99f9-e3ae279039ae,uTools,20,https://www.u.tools,友情链接
e13d1417-822f-4dee-89ca-df57f0f25470,巴西,40,https://deepinbrasil.github.io/,海外社区
ecfd7408-12f6-48a3-8d20-374c76d299bc,土耳其,30,https://deepintr.js.org/,海外社区
3d8a6a2b-cee7-4205-968f-4e5af688eefd,斯洛伐克,20,https://deepin.sk/,海外社区
6f62d20f-4228-49ff-80da-6f47521b7386,西班牙,10,https://deepinenespañol.org/,海外社区
66115879-aaee-4ab5-9116-b5bf1e86b802,条款协议,30,https://www.deepin.org/zh/agreement,关于Deepin
c8e9e657-e1ef-4616-9f47-4abfb45b8064,联系我们,20,https://www.deepin.org/zh/contactus/,关于Deepin
1c635a9e-1e3e-40fd-930f-9e70e288c4eb,关于我们,10,https://www.deepin.org/zh/aboutus/,关于Deepin
c7930df7-2e1f-4a8c-9dc4-fe8badc7168a,友情链接,30,,
cafbdfe8-6d73-443b-b289-72f38854a805,海外社区,20,,
3ffb4db9-7c95-4291-aa34-bbbf988d14f5,关于Deepin,10,,
`;

export const defaultDataZh: DataModule = {
  navs: mingdaoMenuToJSON(footerMD),
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
  navs: [
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
