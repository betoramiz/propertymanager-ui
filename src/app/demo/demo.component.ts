import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { AppDataService } from '../app-data.service';
import { concatMap, from, tap, timer } from 'rxjs';

@Component({
  selector: 'app-demo',
  imports: [],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export default class DemoComponent implements OnInit {

  private appDataService: AppDataService = inject(AppDataService);
  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);

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

  ngOnInit(): void {
    console.log('Data', this.appDataService.getAppData());

    from(this.items)
      .pipe(
        concatMap(item =>
          timer(4000)
          .pipe(
            tap(() => {
              if(item.section === 'log') {
                this.typingLog.update(() => true);
                this.typingVendor.update(() => false);
                this.typingTenant.update(() => false);
              } else if(item.section === 'tenant') {
                this.typingLog.update(() => false);
                this.typingVendor.update(() => false);
                this.typingTenant.update(() => true);
              } else if(item.section === 'tenant') {
                this.typingLog.update(() => false);
                this.typingVendor.update(() => true);
                this.typingTenant.update(() => false);
              }
            }),
            tap(() => document.getElementById(item.id.toString())?.classList.remove('hidden'))
          )
      )
    ).subscribe({
      complete: () => {
        this.typingLog.update(() => false);
        this.typingVendor.update(() => false);
        this.typingTenant.update(() => false);
      }
    });
  }
}
