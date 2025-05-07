import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {TicketApiService} from './ticket-api.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil, tap} from 'rxjs';
import {AssistantRequest, AssistantResponse, IssueDescriptorForm} from './app.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatList, MatListItem} from '@angular/material/list';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButton, MatProgressSpinnerModule, ReactiveFormsModule, MatExpansionModule, MatList, MatListItem, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  private service:TicketApiService = inject(TicketApiService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private initialResponse: AssistantResponse = {
    ticket: {
      tenant: '',
      matchedProperty: '',
      landlord: '',
      category: '',
      issue: '',
      likelyCause: ''
    },
    leaseAgreementReview: {
      importantContractObligations: '',
      resolutionResponsibility: ''
    },
    recommendedSolution: '',
    recommendedSuppliers: [],
    insufficientInformation: false
  };

  readonly panelOpenState = signal(false);
  issueDescriptorForm: FormGroup<IssueDescriptorForm>;
  response = signal<AssistantResponse>(this.initialResponse);
  isLoadingAnswer = signal<boolean>(false);
  showErrorInForm = signal<boolean>(false);

  constructor() {
    this.issueDescriptorForm = this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {}
  title = 'admin';

  processIssue() {

    if (!this.issueDescriptorForm.valid) {
      this.showErrorInForm.update(() => true);
      return;
    } else {
      this.showErrorInForm.update(() => false);
    }

    this.isLoadingAnswer.update(() => true);

    const request: AssistantRequest = {
      user: this.issueDescriptorForm.controls.user.value,
      issueDescription: this.issueDescriptorForm.controls.issue.value,
    }

    this.service
      .reportIssue(request)
      .pipe(
        takeUntil(this.destroy$),
        tap((result: AssistantResponse) => {
          this.response.update(() => result);
        })
      )
      .subscribe({
        complete: () => this.isLoadingAnswer.update(() => false),
        error: () => this.isLoadingAnswer.update(() => false)
      });
  }

  private createForm() {
    return this.formBuilder.group<IssueDescriptorForm>({
      user: this.formBuilder.nonNullable.control('', Validators.required),
      issue: this.formBuilder.nonNullable.control('', Validators.required),
    });
  }
}
