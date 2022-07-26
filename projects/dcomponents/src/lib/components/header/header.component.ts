import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  firstValueFrom,
  fromEvent,
  map,
  startWith,
} from 'rxjs';

@Component({
  selector: 'd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  animations: [
    trigger('subMenu', [
      state('hide', style({ display: 'none' })),
      state('show', style({ display: 'block' })),
      transition('hide => show', [
        style({ height: '0', display: 'block', overflow: 'hidden' }),
        animate('300ms ease', style({ height: '*', overflow: 'hidden' })),
      ]),
      transition('show => hide', [
        style({ height: '*', overflow: 'hidden' }),
        animate('300ms ease', style({ height: '0', overflow: 'hidden' })),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnChanges {
  constructor(private el: ElementRef<HTMLElement>) {}
  phone_show = false;
  icon = 'https://bbs.deepin.org/assets/image/pc/deepin-logo.svg';
  @Input() lang = 'zh';
  @Input() menu?: string;
  @Input() blend = false;
  @HostBinding('class') class = 'd-header top';
  showSubMenuIndex$ = new BehaviorSubject(-1);
  phoneMenuShow$ = new BehaviorSubject(false);
  _menu?: Menu[];
  top$ = fromEvent(window, 'scroll').pipe(
    debounceTime(50),
    map(() => {
      const top = document.documentElement.scrollTop < 80;
      if (top) {
        this.el.nativeElement.classList.add('top');
      } else {
        this.el.nativeElement.classList.remove('top');
      }
      return top;
    }),
    startWith(true)
  );
  ngOnInit(): void {
    this.initMenu();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initMenu();
  }
  initMenu() {
    if (this.menu) {
      this._menu = JSON.parse(this.menu);
      return;
    }
    if (this.lang.startsWith('zh')) {
      this._menu = mingdaoMenuToJSON(menuZHMD);
    } else {
      this._menu = mingdaoMenuToJSON(menuENMD);
    }
  }
  menuMouseenter(i: number) {
    this.showSubMenuIndex$.next(i);
  }
  async phoneShowMenu() {
    const show = await firstValueFrom(this.phoneMenuShow$);
    this.phoneMenuShow$.next(!show);
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
      const children = arr
        .filter((child) => child.parent === item.title)
        .sort((a, b) => a.sort - b.sort)
        .map((child) => {
          return { name: child.title, url: child.url, children: [] };
        });

      return { name: item.title, url: item.url, children } as Menu;
    });
}

function wordpressMenuToJSON(menuStr: string) {
  const menuRaw = JSON.parse(menuStr.replace(/"(\d+":)/g, '"_$1')) as {
    [key: string]: { name: string; url: string; children: Menu[] };
  };
  Object.values(menuRaw).forEach(
    (obj: any) => (obj['children'] = Object.values(obj['children']))
  );
  const menu: Menu[] = Object.values(menuRaw);
  return menu;
}
export interface Menu {
  name: string;
  url: string;
  children: Menu[];
}

const menuZHMD = `
记录ID,显示名称,位置排序,链接地址,父
0d5ddaae-2de5-435e-9cb4-baaafd172fc6,隐私政策,30,https://www.deepin.org/zh/agreement/privacy/,关于
8a5ccdd2-71f1-489d-adf3-d8bbde3e3158,联系我们,20,https://www.deepin.org/zh/contactus/,关于
4149a0e1-2858-427b-8ae8-f96349cd0a4d,关于我们,10,https://www.deepin.org/zh/aboutus/,关于
08c70855-293f-4084-9be8-4ced85037af5,关于,55,,
bb102f83-0ca1-48ae-b921-53f8f0766edd,创建和管理指南,10,https://www.deepin.org/index/docs/zh/sig/sig/README,SIG
32d09eec-597c-4085-b930-9dd6a0e8006e,SIG,50,,
f9b15508-799e-496d-a40b-c8a8cc07afe5,deepin wiki,40,https://wiki.deepin.org/zh/home,下载和帮助
b3aa32cb-51ff-4944-8ad6-370d0477302e,发行注记,20,https://www.deepin.org/zh/release-notes/,下载和帮助
a30f1931-50d9-45b6-923a-1be08cf2be89,镜像下载,10,https://www.deepin.org/zh/download/,下载和帮助
da8c5ea8-c406-4908-8a3b-6f5d02193040,论坛,60,https://bbs.deepin.org,
3e1f55ef-c804-43a9-95be-8288d6da6571,开发者,40,https://docs.deepin.org,
7493e4a8-f0a8-4d90-aa7e-b27d4c39a393,下载和帮助,30,,
666fdc4c-c6d2-43a3-8fa0-c4c11e1a71e3,新闻,20,https://www.deepin.org/zh/community-news/,
e7743474-1ecf-406a-a2e5-1af17826a781,首页,1,https://www.deepin.org,
`;
const menuENMD = `
记录ID,显示名称,位置排序,链接地址,父
65be81c1-e9fb-4bd3-b1b2-fc085c3b74de,HOME,1,/,
72f9849a-f624-4790-9f44-fecfff8142ea,NEWS,20,https://www.deepin.org/en/community-news/,
87c18421-40c5-4dc5-bac6-1ec96c60a013,DOWNLOAD&HELP,30,,
07dd7a70-6da6-4458-ac38-5f01c8c33172,DEVELOPER,40,https://docs.deepin.org,
7bf44d90-b6e8-46e5-91d0-9ededde8158c,FORUM,60,https://bbs.deepin.org,
5ccba596-ee65-4fb1-823a-023b8a7132f9,ISO Download,10,https://www.deepin.org/en/download/,DOWNLOAD&HELP
35a038c5-2992-4ac8-88de-66926b4ce947,Release Notes,20,https://www.deepin.org/en/release-notes/,DOWNLOAD&HELP
80f3add8-284d-4e9c-8444-5f449aa7320e,deepin wiki,40,https://wiki.deepin.org/en/home,DOWNLOAD&HELP
0cbd511b-9dc9-4d32-aead-2a616a94b7aa,ABOUT,55,,
78e914d8-bb6f-4885-9b53-e5a94dddc628,About Us,10,https://www.deepin.org/en/aboutus/,ABOUT
7ff4a54c-ae68-489d-831a-31b41d690d8f,Contact Us,20,https://www.deepin.org/en/contactus/,ABOUT
eabe1290-1177-41a1-a5a6-d2edc172f97f,Privacy Policy,30,https://www.deepin.org/en/agreement/privacy/,ABOUT
`;
