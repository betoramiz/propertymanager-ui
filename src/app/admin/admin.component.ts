import { Component, inject, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import { AssistantResponse, Supplier } from '../shared/app.model';
import { ticketFeature } from '../store/tickets/reducers';
import { combineLatest, combineLatestWith, filter, map, tap, withLatestFrom } from 'rxjs';
import { MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatList, MatListItem } from '@angular/material/list';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LocalStorageService } from '../shared/local-storage.service';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

export interface Response {
  code:  string,
  tenant: string,
  issue: string,
  landlord: string,
  property: string,
  solutions: string,
  suppliers: Supplier[]
}
@Component({
  selector: 'app-admin',
  imports: [
    NgOptimizedImage,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatList,
    MatListItem,
    MatToolbar,
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MatIconButton,
    MatIcon,
    CdkCopyToClipboard
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export default class AdminComponent implements OnInit {
  private store: Store<AssistantResponse> = inject(Store);
  private storage: LocalStorageService = inject(LocalStorageService);

  code = signal('');
  readonly panelOpenState = signal(false);
  assistantResponse = signal<Response>({
    code: '',
    tenant: '',
    issue: '',
    landlord: '',
    property: '',
    solutions: '',
    suppliers: []
  });
  private assistantResponseInitialData: AssistantResponse = {
  ticket: {
    tenant: '',
    matchedProperty: '',
    landlord: '',
    category: '',
    issue: '',
    likelyCause: '',
  },
  leaseAgreementReview: {
    importantContractObligations: '',
    resolutionResponsibility: '',
  },
  recommendedSolution: '',
  recommendedSuppliers: [],
  insufficientInformation: false
}

  ngOnInit(): void {

    const fromStore = this.store.select(ticketFeature.selectCurrentTicket)
      .pipe(
        map(result => {
          if(result.isInitialStatus) {
            return null
          } else {
            return result.assistantResponse
          }
        })
      );

    const fromStorage = this.storage.getItem('ticket');

    fromStore.pipe(
      combineLatestWith(fromStorage),
      map(([fromStoreResult, fromStorageResult]: [fromStoreResult: AssistantResponse|null, fromStorageResult: AssistantResponse|null]) => {
        if(fromStoreResult !== null) {
          return fromStoreResult;
        } else if(fromStorageResult !== null) {
          return fromStorageResult;
        } else {
          return this.assistantResponseInitialData;
        }
      }),
      tap((resultCode: AssistantResponse) => {
        this.code.set(JSON.stringify(resultCode));
        this.assistantResponse.set({
          code: JSON.stringify(resultCode.ticket, null, 2),
          tenant: resultCode.ticket.tenant,
          issue: resultCode.ticket.issue,
          landlord: resultCode.ticket.landlord,
          property: resultCode.ticket.matchedProperty,
          solutions: resultCode.recommendedSolution,
          suppliers: resultCode.recommendedSuppliers
        })
      })
    ).subscribe();

    // this.store
    //   .select(ticketFeature.selectCurrentTicket)
    //   .pipe(
    //     filter(tiket => tiket.isInitialStatus === false),
    //     tap(result => {
    //       const resultCode = result.assistantResponse;
    //       this.code.set(JSON.stringify(resultCode));
    //       this.assistantResponse.set({
    //         code: JSON.stringify(resultCode.ticket),
    //         tenant: resultCode.ticket.tenant,
    //         issue: resultCode.ticket.issue,
    //         landlord: resultCode.ticket.landlord,
    //         property: resultCode.ticket.matchedProperty,
    //         solutions: resultCode.recommendedSolution,
    //         suppliers: resultCode.recommendedSuppliers
    //       });
    //     })
    //   )
    //   .subscribe();
  }

}
