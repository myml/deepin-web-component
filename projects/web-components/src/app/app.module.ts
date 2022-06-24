import { ApplicationRef, DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from 'projects/dcomponents/src/lib/components/footer/footer.component';
import { HeaderComponent } from 'projects/dcomponents/src/lib/components/header/header.component';
import { DcomponentsModule } from 'projects/dcomponents/src/public-api';

const components: { [key: string]: any } = {
  'd-header': HeaderComponent,
  'd-footer': FooterComponent,
};

@NgModule({
  declarations: [],
  imports: [BrowserModule, DcomponentsModule],
  providers: [],
  bootstrap: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    Object.keys(components).forEach((name) => {
      const c = createCustomElement(components[name], { injector });
      customElements.define(name, c);
    });
  }
  ngDoBootstrap(appRef: ApplicationRef): void {}
}
