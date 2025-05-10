import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler{

  constructor() { }
  handleError(error: any): void {
    if(error.status === 403 || error.status===404){
      return;
    }
    else{
      console.log(error);
    }
  }
}
