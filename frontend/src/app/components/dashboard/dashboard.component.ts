import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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
