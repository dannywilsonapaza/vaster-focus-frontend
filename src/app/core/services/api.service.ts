import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, Session, CreateSessionDto, DailyStat, StatsSummary } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  // Goals
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.baseUrl}/goals`);
  }

  createGoal(title: string): Observable<Goal> {
    return this.http.post<Goal>(`${this.baseUrl}/goals`, { title });
  }

  updateGoal(id: string, data: { title?: string; isCompleted?: boolean }): Observable<Goal> {
    return this.http.patch<Goal>(`${this.baseUrl}/goals/${id}`, data);
  }

  // Sessions
  getSessions(limit = 50): Observable<Session[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<Session[]>(`${this.baseUrl}/sessions`, { params });
  }

  createSession(data: CreateSessionDto): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}/sessions`, data);
  }

  // Stats
  getDailyStats(from?: string, to?: string, limit = 30): Observable<DailyStat[]> {
    let params = new HttpParams().set('limit', limit);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<DailyStat[]>(`${this.baseUrl}/stats/daily`, { params });
  }

  getStatsSummary(): Observable<StatsSummary> {
    return this.http.get<StatsSummary>(`${this.baseUrl}/stats/summary`);
  }
}
