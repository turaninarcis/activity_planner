import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IMAGE_CONFIG} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, // Disable NG0913
        disableImageLazyLoadWarning: true // Disable lazy loading warning
      }
    }
  ]
};
