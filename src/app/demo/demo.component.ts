import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { AppDataService } from '../app-data.service';
import { concatMap, from, tap, timer } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { Example } from './models/example.model';
import { DemoService } from './demo.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Category } from './models/category.example';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-demo',
  imports: [
    MatIconModule,
    MatInput,
    MatFormField,
    MatPaginator,
    MatButton,
    MatRipple,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatProgressSpinner
  ],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export default class DemoComponent implements OnInit {

  private appDataService: AppDataService = inject(AppDataService);
  private demoService: DemoService = inject(DemoService);
  private destroyRef$: DestroyRef = inject(DestroyRef);
  examples: Example[] = [];
  categories: Category[] = [];
  issueControl: FormControl = new FormControl<string>('', Validators.required);

  items = [
    { id: 'log-1', section: 'log' },
    { id: 'log-2', section: 'log' },
    { id: 'tenant-1', section: 'tenant' },
    { id: 'log-3', section: 'log' }, //send message to vendor
    { id: 'vendor-1', section: 'vendor' },
    { id: 'vendor-2', section: 'vendor' },
    { id: 'log-4', section: 'log' },
    { id: 'log-5', section: 'log' },
    { id: 'tenant-2', section: 'tenant' },
    { id: 'vendor-3', section: 'vendor' },
    { id: 'log-6', section: 'log' },
    { id: 'vendor-4', section: 'vendor' },
    { id: 'log-7', section: 'log' },
    { id: 'log-8', section: 'log' },
    { id: 'tenant-3', section: 'tenant' },
    { id: 'tenant-4', section: 'tenant' },
    { id: 'log-9', section: 'log' },
  ]
  typingLog = signal<boolean>(true);
  typingVendor = signal<boolean>(false);
  typingTenant = signal<boolean>(false);
  blockButtons = signal<boolean>(false);

  ngOnInit(): void {
    this.demoService.getCategories().pipe(
      takeUntilDestroyed(this.destroyRef$),
      tap(categories => this.categories = categories)
    ).subscribe();

    this.demoService.getIssues()
      .pipe(
        takeUntilDestroyed(this.destroyRef$),
        tap((result: Example[]) => {
          this.examples = result;
          if(result) {
            this.issueControl.setValue(result[0].issue);
          }
        })
      )
      .subscribe();

    const collection = document.getElementsByClassName('hidden');
    for (let collectionElement of collection) {
      collectionElement.classList.remove('hidden');
    }

    // from(this.items)
    //   .pipe(
    //     concatMap(item =>
    //       timer(2000)
    //       .pipe(
    //         tap(() => {
    //           const tenantElement = document.getElementsByClassName('event-typing');
    //
    //           if(item.section === 'log') {
    //             this.typingLog.update(() => true);
    //             this.typingVendor.update(() => false);
    //             this.typingTenant.update(() => false);
    //           } else if(item.section === 'tenant') {
    //             this.typingLog.update(() => false);
    //             this.typingVendor.update(() => false);
    //             this.typingTenant.update(() => true);
    //           } else if(item.section === 'vendor') {
    //             this.typingLog.update(() => false);
    //             this.typingVendor.update(() => true);
    //             this.typingTenant.update(() => false);
    //           }
    //         }),
    //         tap(() => {
    //           const element = document.getElementById(item.id.toString());
    //           element?.classList.remove('hidden');
    //           element?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    //           // this.scrollToBottom();
    //         })
    //       )
    //   )
    // ).subscribe({
    //   complete: () => {
    //     this.typingLog.update(() => false);
    //     this.typingVendor.update(() => false);
    //     this.typingTenant.update(() => false);
    //   }
    // });
  }

  handlePageEvent(event$: PageEvent): void {
    const index = event$.pageIndex;
    this.issueControl.setValue(this.examples[index].issue);
  }

  processIssue(): void {
    if(this.issueControl.value.length === 0) {
      return;
    }

    this.blockButtons.set(true);

  }
}
