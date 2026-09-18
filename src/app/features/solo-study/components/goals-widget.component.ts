import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { TimerService } from '../../../core/services/timer.service';
import { Goal } from '../../../core/models';
import {
  LucideCheckSquare,
  LucideSquare,
  LucidePlus,
  LucideTarget,
  LucideLink2,
} from '@lucide/angular';

@Component({
  selector: 'app-goals-widget',
  standalone: true,
  imports: [
    FormsModule,
    LucideCheckSquare,
    LucideSquare,
    LucidePlus,
    LucideTarget,
    LucideLink2,
  ],
  templateUrl: './goals-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsWidgetComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly timerService = inject(TimerService);

  readonly goals = signal<Goal[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly newGoalTitle = signal<string>('');

  readonly completedCount = computed<number>(() => this.goals().filter((g) => g.isCompleted).length);

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

  addGoal(event: Event): void {
    event.preventDefault();
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

  isGoalLinked(goalId: string): boolean {
    return this.timerService.activeGoalIds().includes(goalId);
  }

  toggleSessionLink(goalId: string): void {
    this.timerService.toggleGoal(goalId);
  }
}
