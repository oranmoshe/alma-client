/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  private inactivityTime = 0;
  private TIMER_INTERVAL = 1;
  private MINIMUM_INTERVALS_INACTIVITY = 30000;

  constructor(private analytics: AnalyticsService, private seoService: SeoService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
    this.addUserInactivityTimer();
    this.addUserSessionCheck();
  }

  private addUserInactivityTimer() {
    setInterval(() => this.inactivityTime = this.inactivityTime + 1, this.TIMER_INTERVAL);
    const resetInactivityTime = () => this.inactivityTime = 0;
   window.addEventListener('mousedown', resetInactivityTime, {passive: true});
   window.addEventListener('keydown',  resetInactivityTime, {passive: true});
  }

  private addUserSessionCheck() {
    const checkExpire = () => {
      this.authService.checkSession().subscribe(
        () => {
          console.debug('checking session expired, it did not');
        },
        () => {
          console.debug('session expired');
          this.authService.setShouldCheckSession(false);
        }
      );
    };
    window.addEventListener('mousedown', () => {
      if (this.authService.shouldCheckExpiration && (this.inactivityTime >= this.MINIMUM_INTERVALS_INACTIVITY)) {
        checkExpire();
      }
    }, {passive: true});
  }

}
