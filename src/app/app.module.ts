import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DcomponentsModule } from 'projects/dcomponents/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DcomponentsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
