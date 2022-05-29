import { NgModule } from '@angular/core';
import {NbIconLibraries, NbMenuModule} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerSvgPack('social-networks', {
      'facebook': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 424.588 424.588" style="enable-background:new 0 0 424.588 424.588;" xml:space="preserve" fill="gray">\n' +
        '<path d="M424.516,347.866l-13.024-194.953c-1.971-29.509-26.681-52.624-56.256-52.624H301.29V78.835  c0-20.425-16.616-37.042-37.041-37.042H160.341c-20.425,0-37.041,16.617-37.041,37.042v21.453H69.352  c-29.573,0-54.284,23.115-56.256,52.624L0.072,347.866c-0.602,9.01,2.592,17.959,8.76,24.553  c6.169,6.594,14.885,10.375,23.914,10.375h359.098c9.029,0,17.746-3.782,23.914-10.376  C421.926,365.824,425.119,356.875,424.516,347.866z M160.341,60.794h103.907c5.559,0,10.536,2.531,13.848,6.497H146.494  C149.806,63.324,154.782,60.794,160.341,60.794z M142.3,86.29H282.29v13.998H142.3V86.29z M32.053,154.178  c1.308-19.564,17.691-34.89,37.299-34.89h285.884c19.608,0,35.992,15.326,37.299,34.89l4.984,74.597l-141.015,70.333l0.258-1.035  c0.706-2.837,0.066-5.841-1.734-8.145c-1.8-2.303-4.561-3.649-7.484-3.649h-70.496c-2.924,0-5.685,1.346-7.484,3.649  c-1.801,2.303-2.44,5.308-1.734,8.145l0.257,1.034L27.07,228.774L32.053,154.178z M235.389,305.279l-7.962,31.998h-30.266  l-7.962-31.998H235.389z M401.882,359.439c-2.628,2.809-6.193,4.355-10.039,4.355H32.746c-3.846,0-7.411-1.547-10.039-4.355  c-2.627-2.809-3.934-6.47-3.678-10.307l6.668-99.81l148.42,74.026l6.4,25.722c1.054,4.234,4.855,7.206,9.219,7.206h45.117  c4.363,0,8.165-2.972,9.219-7.206l6.4-25.722l148.419-74.025l6.668,99.809C405.815,352.97,404.509,356.63,401.882,359.439z"/></svg>',
    });
  }
}
