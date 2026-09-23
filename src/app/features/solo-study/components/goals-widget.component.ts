import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { TimerService } from '../../../core/services/timer.service';
import { Goal } from '../../../core/models';
import {
  LucideTarget,
  LucideInfo,
  LucideX,
  LucidePlus,
  LucideCircle,
  LucideCheckCircle2,
  LucideLink2,
} from '@lucide/angular';

@Component({
  selector: 'app-goals-widget',
  standalone: true,
  imports: [
    FormsModule,
    LucideTarget,
    LucideInfo,
    LucideX,
    LucidePlus,
    LucideCircle,
    LucideCheckCircle2,
    LucideLink2,
  ],
  templateUrl: './goals-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsWidgetComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly timerService = inject(TimerService);
  readonly close = output<void>();

  readonly goals = signal<Goal[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly newGoalTitle = signal<string>('');

  readonly completedCount = computed<number>(() => this.goals().filter((g) => g.isCompleted).length);
  readonly openCount = computed<number>(() => this.goals().filter((g) => !g.isCompleted).length);

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.isLoading.set(true);
    this.apiService.getGoals().subscribe({
      next: (data) => {
        this.goals.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[GoalsWidget] Error cargando metas:', err);
        this.isLoading.set(false);
      },
    });
  }

  addGoal(event?: Event): void {
    if (event) event.preventDefault();
    const title = this.newGoalTitle().trim();
    if (!title || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.apiService.createGoal(title).subscribe({
      next: (created) => {
        this.goals.update((list) => [created, ...list]);
        this.newGoalTitle.set('');
        this.isSubmitting.set(false);
        this.timerService.toggleGoal(created.id);
      },
      error: (err) => {
        console.error('[GoalsWidget] Error creando meta:', err);
        this.isSubmitting.set(false);
      },
    });
  }

  toggleGoalComplete(goal: Goal): void {
    const nextState = !goal.isCompleted;
    this.apiService.updateGoal(goal.id, { isCompleted: nextState }).subscribe({
      next: (updated) => {
        this.goals.update((list) => list.map((g) => (g.id === updated.id ? updated : g)));
        if (nextState && this.isGoalLinked(goal.id)) {
          this.timerService.toggleGoal(goal.id);
        }
      },
      error: (err) => {
        console.error('[GoalsWidget] Error actualizando meta:', err);
      },
    });
  }

  deleteGoal(goalId: string, event: Event): void {
    event.stopPropagation();
    this.apiService.deleteGoal(goalId).subscribe({
      next: () => {
        this.goals.update((list) => list.filter((g) => g.id !== goalId));
        if (this.isGoalLinked(goalId)) {
          this.timerService.toggleGoal(goalId);
        }
      },
      error: (err) => {
        console.warn('[GoalsWidget] No se pudo borrar en el servidor, eliminando localmente:', err);
        this.goals.update((list) => list.filter((g) => g.id !== goalId));
        if (this.isGoalLinked(goalId)) {
          this.timerService.toggleGoal(goalId);
        }
      },
    });
  }

  isGoalLinked(goalId: string): boolean {
    return this.timerService.activeGoalIds().includes(goalId);
  }

  toggleSessionLink(goalId: string, event: Event): void {
    event.stopPropagation();
    this.timerService.toggleGoal(goalId);
  }
}
