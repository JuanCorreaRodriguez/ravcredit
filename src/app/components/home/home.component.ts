import {AfterViewInit, Component, input, OnDestroy, signal} from '@angular/core';
import {MatProgressSpinner, ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {MatCard} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {oClient} from '../../core/interfaces/oClient';
import {oContract} from '../../core/interfaces/oContract';
import {DashboardService} from '../../core/services/dashboard.service';
import {TitleCasePipe} from '@angular/common';
import {eClientStatus} from '../../core/interfaces/oGlobal';
import {ObservablesService} from '../../core/services/observables.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    MatProgressSpinner,
    MatCard,
    MatDivider,
    TitleCasePipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../dashboard/dashboard.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  client = input.required<oClient>();
  contract = input.required<oContract>()
  progress = input.required<number>()
  count = input.required<number>()
  isLate = signal<boolean>(false)

  mode: ProgressSpinnerMode = 'determinate';
  lastPayment = signal("")
  nextPayment = signal("");
  subsLate = new Subscription()
  protected readonly eClientStatus = eClientStatus;

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly observables: ObservablesService
  ) {
  }

  ngAfterViewInit(): void {
    this.setTimes()

    this.subsLate = this.observables.isLate.subscribe((isLate) => {
      this.isLate.set(isLate);
      this.setTimes()
    })
  }

  setTimes() {
    this.lastPayment.set(this.dashboardService.GetLastPayment(this.contract().financial.provider))
    this.nextPayment.set(this.dashboardService.GetNextPayment(this.contract()))
  }

  ngOnDestroy(): void {
    this.subsLate.unsubscribe()
  }

  progressRound = (progress: number) => Math.trunc(progress);
}
