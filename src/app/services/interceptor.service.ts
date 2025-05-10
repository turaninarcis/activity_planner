import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private router:Router
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 403) {
          // Redirect to 403 page when a 403 error occurs
          this.router.navigate(['/unauthorized']);
          return of();
        }
        if(error.status==404){
          this.router.navigate(['/404'])
          return of();
        }
        // You can handle other error statuses (like 500, etc.) here as well
        return of();  // Re-throw the error if you want it to propagate
      })
    );
  }
}
