import { HttpClient } from '@angular/common/http';
import {
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
} from 'rxjs';

import navEN from './nav_en.json';
import navZH from './nav_zh.json';

@Component({
  selector: 'd-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnChanges {
  constructor(private http: HttpClient) {}
  @HostBinding('class') class = 'd-footer';
  @Input() lang: 'zh' | 'en' = 'zh';
  @Input() data!: string;
  @Input()
  copyright = `© 2011-${new Date().getFullYear()} Wuhan Deepin Technology Co., Ltd.`;
  refreshData$ = new BehaviorSubject('');
  data$ = this.createDataObs();

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
        if (this.data) {
          return of(JSON.parse(this.data) as DataModule).pipe(
            startWith(this.defaultData)
          );
        }
        const lang = this.isZH ? 'zh' : 'en';
        const url = `https://www.deepin.org/index/src/assets/docs/${lang}/deepin-web-component/footer/nav_${lang}.json`;
        return this.http.get<DataModule>(url).pipe(
          map((data) => {
            return data?.navs?.length ? data : this.defaultData;
          }),
          startWith(this.defaultData)
        );
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
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
