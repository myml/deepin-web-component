import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DebounceTimePipe } from './pipes/debounce-time.pipe';
import { PushModule } from '@rx-angular/template';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const privateList = [DebounceTimePipe];
const publicList = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...privateList, ...publicList],
  imports: [
    CommonModule,
    PushModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  exports: [...publicList],
})
export class DcomponentsModule {}
