import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

const publicList = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...publicList],
  imports: [CommonModule, HttpClientModule],
  exports: [...publicList],
})
export class DcomponentsModule {}
