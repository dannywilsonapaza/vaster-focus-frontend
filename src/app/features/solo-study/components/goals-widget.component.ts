import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
    FormsModule,
    LucideCheckSquare,
    LucideSquare,
    LucidePlus,
    LucideTarget,
    LucideLink2,
  ],
  template: `
    <div class="p-5 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl w-full max-w-sm flex flex-col max-h-[420px]">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div class="flex items-center gap-2">
          <svg lucideTarget [size]="18" class="w-4 h-4 text-emerald-400"></svg>
          <h3 class="text-sm font-semibold tracking-wide text-white">Metas de la Sesión</h3>
        </div>
        <div class="text-[11px] font-mono text-white/50">
          {{ completedCount() }}/{{ goals().length }} completadas
        </div>
      </div>

      <!-- Add Goal Input -->
      <form (submit)="addGoal($event)" class="flex items-center gap-2 mb-3">
        <input
          type="text"
          [(ngModel)]="newGoalTitle"
          name="goalTitle"
          placeholder="Añadir nueva meta..."
          maxlength="255"
          class="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          type="submit"
          [disabled]="!newGoalTitle().trim() || isSubmitting()"
          class="flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Añadir meta"
        >
          <svg lucidePlus [size]="16" class="w-4 h-4"></svg>
        </button>
      </form>

      <!-- Goals List -->
      <div class="flex-1 overflow-y-auto space-y-2 pr-1">
        @if (isLoading()) {
          <div class="py-8 text-center text-xs text-white/40 animate-pulse">
            Cargando metas...
          </div>
        } @else if (goals().length === 0) {
          <div class="py-8 text-center text-xs text-white/40">
            No hay metas activas. ¡Crea una para concentrarte!
          </div>
        } @else {
          @for (goal of goals(); track goal.id) {
            <div class="group flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
              <!-- Checkbox & Title -->
              <div class="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer" (click)="toggleGoalComplete(goal)">
                <button
                  type="button"
                  class="text-white/40 hover:text-emerald-400 transition-colors shrink-0"
                  [attr.aria-label]="goal.isCompleted ? 'Desmarcar meta' : 'Completar meta'"
                >
                  @if (goal.isCompleted) {
                    <svg lucideCheckSquare [size]="16" class="w-4 h-4 text-emerald-400"></svg>
                  } @else {
                    <svg lucideSquare [size]="16" class="w-4 h-4"></svg>
                  }
                </button>
                <span
                  class="text-xs truncate transition-all select-none"
                  [ngClass]="goal.isCompleted ? 'line-through text-white/40' : 'text-white/90'"
                >
                  {{ goal.title }}
                </span>
              </div>

              <!-- Link to Active Session Button -->
              @if (!goal.isCompleted) {
                <button
                  type="button"
                  (click)="toggleSessionLink(goal.id)"
                  class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors shrink-0"
                  [ngClass]="isGoalLinked(goal.id) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/30 hover:text-white/60 hover:bg-white/5'"
                  title="Vincular a la sesión de trabajo actual"
                >
                  <svg lucideLink2 [size]="11" class="w-3 h-3"></svg>
                  <span>{{ isGoalLinked(goal.id) ? 'Activa' : 'Vincular' }}</span>
                </button>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsWidgetComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  readonly timerService = inject(TimerService);

  readonly goals = signal<Goal[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly isSubmitting = signal<boolean>(false);
  readonly newGoalTitle = signal<string>('');

  readonly completedCount = computed(() => this.goals().filter((g) => g.isCompleted).length);

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
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

  addGoal(event: Event) {
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

  toggleGoalComplete(goal: Goal) {
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

  toggleSessionLink(goalId: string) {
    this.timerService.toggleGoal(goalId);
  }
}
