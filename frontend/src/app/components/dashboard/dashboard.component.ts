import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Task Manager</h1>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <input type="text" class="w-full p-2 border border-gray-400 rounded" [(ngModel)]="newTask.title" placeholder="Task title">
          <textarea class="w-full p-2 border border-gray-400 rounded" [(ngModel)]="newTask.description" placeholder="Task description"></textarea>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="createTask()">Create Task</button>
        </div>
        <div class="flex flex-col gap-2">
          <ul class="list-none p-0">
            <li class="flex justify-between items-center p-2 border border-gray-400 rounded" *ngFor="let task of tasks">
              <span class="text-lg" [ngClass]="{'line-through': task.completed}">{{ task.title }}</span>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" (click)="toggleComplete(task)">Toggle Complete</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" (click)="deleteTask(task._id!)">Delete Task</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Omit<Task, '_id'> = {
    title: '',
    description: '',
    completed: false
  };
  error = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        this.error = 'Failed to load tasks';
        console.error(err);
      }
    });
  }

  createTask(): void {
    if (!this.newTask.title.trim()) {
      this.error = 'Title is required';
      return;
    }

    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', completed: false };
        this.loadTasks();
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to create task';
        console.error(err);
      }
    });
  }

  updateTask(task: Task): void {
    this.taskService.updateTask(task._id!, task).subscribe({
      next: () => {
        this.loadTasks();
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to update task';
        console.error(err);
      }
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
          this.error = '';
        },
        error: (err) => {
          this.error = 'Failed to delete task';
          console.error(err);
        }
      });
    }
  }

  toggleComplete(task: Task): void {
    this.updateTask({ ...task, completed: !task.completed });
  }
}
