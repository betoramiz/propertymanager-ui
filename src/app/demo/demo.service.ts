import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Example } from './models/example.model';
import { Category } from './models/category.example';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  private path = `${environment.apiUrl}`
  private httpClient: HttpClient = inject(HttpClient);
  constructor() { }

  getIssues(): Observable<Example[]> {
    const url = `${this.path}/message/examples`;
    return this.httpClient.get<Example[]>(url);
  }

  getCategories() : Observable<Category[]> {
    const url = `${this.path}/category/list`;
    return this.httpClient.get<Category[]>(url)
  }
}
