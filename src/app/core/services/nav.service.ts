import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(private router: Router) {
  }

  routing(to: string) {
    this.router.navigate([to])
  }

  routeParams(data: any) {
    console.log(data)
    this.router.navigate(data)
  }

  routingNewTab(to: string, queryParams: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree([to], {queryParams: queryParams}));
    window.open(url, '_blank');
  }
}
