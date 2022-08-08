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
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  debounceTime,
  delay,
  firstValueFrom,
  fromEvent,
  map,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import menuZH from './menu_zh.json';
import menuEN from './menu_en.json';

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
  constructor(private el: ElementRef<HTMLElement>, private http: HttpClient) {}
  phone_show = false;
  icon = 'https://bbs.deepin.org/assets/image/pc/deepin-logo.svg';
  @Input() lang = 'zh';
  @Input() menu?: string;
  @Input() blend = false;
  @HostBinding('class') class = 'd-header top';
  // 菜单是否显示
  phoneMenuShow$ = new BehaviorSubject(false);
  // 子菜单是否显示
  showSubMenuIndex$ = new BehaviorSubject(-1);
  // 滚动条是否在顶部
  top$ = this.isTop();

  refreshMenu$ = new BehaviorSubject('');
  menu$ = this.createMenuObs();
  _menu?: Menu[];
  ngOnInit(): void {
    this.refreshMenu$.next('');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.refreshMenu$.next('');
  }

  createMenuObs() {
    return this.refreshMenu$.pipe(
      debounceTime(100),
      switchMap(() => {
        // 使用Input
        if (this.menu) {
          return of(JSON.parse(this.menu) as Menu[]);
        }
        const url = `https://www.deepin.org/index/src/assets/docs/zh/deepin-web-component/header/menu_${this.lang}.json`;
        return this.http.get<{ menu: Menu[] }>(url).pipe(
          map((data) => {
            return data?.menu?.length ? data.menu : menuZH.menu;
          })
        );
      }),
      startWith(this.lang.startsWith('zh') ? menuZH.menu : menuEN.menu),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  menuMouseenter(i: number) {
    this.showSubMenuIndex$.next(i);
  }

  async phoneShowMenu() {
    const show = await firstValueFrom(this.phoneMenuShow$);
    this.phoneMenuShow$.next(!show);
  }

  // 判断滚动条是否在顶部，并添加class到元素
  // web component的HostBinding有些问题，手动控制class
  isTop() {
    return fromEvent(window, 'scroll').pipe(
      map(() => {
        const top = document.documentElement.scrollTop < 100;
        if (top) {
          this.el.nativeElement.classList.add('top');
          this.el.nativeElement.style.removeProperty('--header-height');
        } else {
          this.el.nativeElement.classList.remove('top');
          this.el.nativeElement.style.setProperty(
            '--header-height',
            'var(--d-header-height, 64px)'
          );
        }
        return top;
      }),
      startWith(true)
    );
  }
}

export interface Menu {
  name: string;
  url: string;
  children: Menu[];
}
