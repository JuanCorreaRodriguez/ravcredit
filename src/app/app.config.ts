import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material/chips';
import {COMMA, SPACE} from '@angular/cdk/keycodes';
import {MAT_BOTTOM_SHEET_DEFAULT_OPTIONS} from '@angular/material/bottom-sheet';
import {IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideAnimationsAsync(),

    {
      provide: IMAGE_CONFIG,
      useValue: {breakpoints: [770, 1500]}
    },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `assets/img/${config.width}/${config.src}?`;
      }
    },
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true}
    },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [COMMA, SPACE]
      }
    },
    {
      provide: LOCALE_ID, useValue: "es-MX"
    },
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
};
