import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';

import menuZH from './menu_zh.json';
import menuEN from './menu_en.json';

@Component({
  selector: 'd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HeaderComponent implements OnInit, OnChanges {
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
  @Input() home = 'www.deepin.org';
  // Logo旁边的标题
  @Input() subtitle = '';
  // 当前显示语言
  @Input() lang = 'zh';
  // 菜单配置传入，由于web-component无法传递对象，这里接收Menu[]序列化的json字符串
  @Input() menu?: string;
  // 是否将传入的菜单配置追加到内置菜单配置中，默认是覆盖内置的配置
  @Input() append = false;
  @HostBinding('class') class = 'd-header';
  // 菜单是否显示
  phoneMenuShow = false;
  // 菜单配置
  _menu = this.defaultData;
  // 远程菜单配置
  remoteMenuZH = this.http
    .get<{ menu: Menu[] }>(this.getRemoteURL('zh'))
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  remoteMenuEN = this.http
    .get<{ menu: Menu[] }>(this.getRemoteURL('en'))
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  ngOnInit(): void {
    this.updateMenu();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateMenu();
  }

  get isZH() {
    return this.lang.startsWith('zh');
  }
  get defaultData(): Menu[] {
    return this.isZH ? menuZH.menu : menuEN.menu;
  }

  getRemoteURL(lang: string) {
    return `https://www.deepin.org/index/src/assets/docs/${lang}/deepin-web-component/header/menu_${lang}.json`;
  }

  updateMenu() {
    const inputMenu: Menu[] = this.menu ? JSON.parse(this.menu) : [];

    // 使用Input
    if (this.menu && !this.append) {
      this._menu = inputMenu;
      this.cdr.detectChanges();
      return;
    }
    // 使用默认值
    this._menu = [...this.defaultData, ...inputMenu];
    return;
    // 使用远程数据
    const oldMenu = this._menu;
    (this.isZH ? this.remoteMenuZH : this.remoteMenuEN).subscribe((data) => {
      // menu是否已进行了更新
      if (oldMenu != this._menu) {
        return;
      }
      if (data?.menu?.length) {
        this._menu = [...data.menu, ...inputMenu];
      }
      this.cdr.detectChanges();
    });
  }

  // 三级菜单需要鼠标悬浮显示，鼠标离开也不收回
  // 悬浮需要延迟一小段时间，避免鼠标划过也展开
  _hoverCache = new Map<HTMLElement, any>();
  childHover(el: HTMLElement, hover: boolean) {
    if (hover) {
      const interval = setTimeout(() => {
        el.classList.add('hover');
      }, 150);
      this._hoverCache.set(el, interval);
    } else {
      const interval = this._hoverCache.get(el);
      if (interval) {
        clearInterval(interval);
      }
    }
  }
  // 二级菜单收回时，再收回三级菜单
  removeAllHoverClass(el: HTMLElement) {
    setTimeout(() => {
      el.querySelectorAll('.hover').forEach((el) =>
        el.classList.remove('hover')
      );
    }, 300);
  }

  // 手机端需要点击才会显示菜单
  phoneMenuClick() {
    this.phoneMenuShow = !this.phoneMenuShow;
    this.cdr.detectChanges();
  }
}

export interface Menu {
  name: string;
  url: string;
  children?: Menu[];
}
