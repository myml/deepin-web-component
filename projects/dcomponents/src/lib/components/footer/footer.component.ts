import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  BehaviorSubject,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import navEN from './nav_en.json';
import navZH from './nav_zh.json';

@Component({
  selector: 'd-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnChanges {
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
  @HostBinding('class') class = 'd-footer';
  @Input() lang: 'zh' | 'en' = 'zh';
  @Input() data!: string;
  @Input()
  copyright = `© 2011-${new Date().getFullYear()} Wuhan Deepin Technology Co., Ltd.`;
  refreshData$ = new BehaviorSubject('');
  data$ = this.createDataObs();

  remoteZh$ = this.remoteData('zh');
  remoteEn$ = this.remoteData('en');

  ngOnInit(): void {
    this.refreshData$.next('');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.refreshData$.next('');
  }
  get isZH() {
    return this.lang.startsWith('zh');
  }
  get defaultData(): DataModule {
    return this.isZH ? navZH : navEN;
  }
  createDataObs() {
    return this.refreshData$.pipe(
      switchMap(() => {
        // 如果传入了data，使用传入的值，
        if (this.data) {
          return of(JSON.parse(this.data) as DataModule).pipe(
            startWith(this.defaultData)
          );
        }
        // 使用远程的值
        return (this.isZH ? this.remoteZh$ : this.remoteEn$).pipe(
          map((data) => {
            return data?.navs?.length ? data : this.defaultData;
          }),
          // 最开始显示默认的值
          startWith(this.defaultData)
        );
      }),
      tap(() => {
        setTimeout(() => this.cdr.detectChanges());
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }
  remoteData(lang: string) {
    const url = `https://www.deepin.org/index/src/assets/docs/${lang}/deepin-web-component/footer/nav_${lang}.json`;
    return this.http.get<DataModule>(url);
  }
}

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
