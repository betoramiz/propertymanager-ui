import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AssistantRequest, AssistantResponse} from './app.model';

@Injectable({
  providedIn: 'root'
})
export class TicketApiService {

  private baseUrl = 'https://localhost:7290/api/issue'
  private http: HttpClient = inject(HttpClient);
  constructor() { }

  public reportIssue(request: AssistantRequest) {
    const url = `${this.baseUrl}/report`;
    return this.http.post<AssistantResponse>(url, request);
  }
}
