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
  firstValueFrom,
  fromEvent,
  map,
  startWith,
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
      this._menu = menuZH.menu;
    } else {
      this._menu = menuEN.menuEN;
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

export interface Menu {
  name: string;
  url: string;
  children: Menu[];
}
