import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TranslatePipe } from './pipes/translate/translate.pipe';

const privateList = [TranslatePipe];
const publicList = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...privateList, ...publicList],
  imports: [CommonModule],
  exports: [...publicList],
})
export class DcomponentsModule {}
