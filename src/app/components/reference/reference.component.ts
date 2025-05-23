import {AfterViewInit, Component, EnvironmentInjector, inject, input, runInInjectionContext} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {Router} from '@angular/router';
import {oClient} from '../../core/interfaces/oClient';
import {oContract} from '../../core/interfaces/oContract';
import {IDCGeneratedReference} from '../../core/utils/UtilDynamiCore';
import {eProvider} from '../../core/utils/UtilContract';
import {RoutingParams} from '../../core/utils/globals';

@Component({
  selector: 'app-reference',
  imports: [
    MatIcon,
    MatCard
  ],
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css', '../dashboard/dashboard.component.css']
})
export class ReferenceComponent implements AfterViewInit {
  client = input.required<oClient>();
  contract = input.required<oContract>()
  reference = input.required<IDCGeneratedReference | null>();
  injector = inject(EnvironmentInjector)
  protected readonly eProvider = eProvider;

  ngAfterViewInit(): void {
  }

  routing(route: string) {
    runInInjectionContext(this.injector, () => {
      const router = inject(Router);
      const routeParams: RoutingParams = {
        client: this.client(),
        contract: this.contract(),
      }
      router.navigate([route], {
        queryParams: {
          id: this.client().id,
        }
      })
    })

  }
}
