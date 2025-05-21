import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./task-list.component.scss'],
  template: `
    <div class="task-container">
      <h2>My Tasks</h2>
      <button (click)="showAddForm = true" class="add-button">Add New Task</button>

      <!-- Add/Edit Task Form -->
      <div *ngIf="showAddForm" class="task-form">
        <h3>{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h3>
        <div class="form-group">
          <label for="title">Title:</label>
          <input
            type="text"
            id="title"
            [(ngModel)]="newTask.title"
            placeholder="Enter task title"
            required
          />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            [(ngModel)]="newTask.description"
            placeholder="Enter task description"
            rows="3"
          ></textarea>
        </div>
        <div class="button-group">
          <button (click)="saveTask()" class="save-button">
            {{ editingTask ? 'Update Task' : 'Add Task' }}
          </button>
          <button (click)="cancelEdit()" class="cancel-button">Cancel</button>
        </div>
      </div>

      <!-- Task List -->
      <div class="task-list">
        <div *ngFor="let task of tasks" class="task-item">
          <div class="task-content">
            <div class="task-header">
              <input
                type="checkbox"
                [checked]="task.completed"
                (change)="toggleComplete(task)"
              />
              <h3 [class.completed]="task.completed">{{ task.title }}</h3>
            </div>
            <p [class.completed]="task.completed">{{ task.description }}</p>
            <div class="task-actions">
              <button (click)="editTask(task)" class="edit-button">Edit</button>
              <button (click)="deleteTask(task._id!)" class="delete-button">Delete</button>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="tasks.length === 0" class="empty-state">
          <p>No tasks yet. Click 'Add New Task' to get started!</p>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  showAddForm = false;
  editingTask: Task | null = null;
  newTask: Omit<Task, '_id'> = {
    title: '',
    description: '',
    completed: false,
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

  saveTask() {
    if (this.editingTask) {
      this.taskService
        .updateTask(this.editingTask._id!, {
          title: this.newTask.title,
          description: this.newTask.description,
        })
        .subscribe(
          (updatedTask) => {
            const index = this.tasks.findIndex((t) => t._id === updatedTask._id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
            }
            this.resetForm();
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
    } else {
      this.taskService.createTask(this.newTask).subscribe(
        (task) => {
          this.tasks.push(task);
          this.resetForm();
        },
        (error) => {
          console.error('Error creating task:', error);
        }
      );
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.newTask = {
      title: task.title,
      description: task.description,
      completed: task.completed,
    };
    this.showAddForm = true;
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(
      () => {
        this.tasks = this.tasks.filter((task) => task._id !== id);
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  toggleComplete(task: Task) {
    this.taskService
      .updateTask(task._id!, { completed: !task.completed })
      .subscribe(
        (updatedTask) => {
          const index = this.tasks.findIndex((t) => t._id === updatedTask._id);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
        },
        (error) => {
          console.error('Error updating task completion:', error);
        }
      );
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.showAddForm = false;
    this.editingTask = null;
    this.newTask = {
      title: '',
      description: '',
      completed: false,
    };
  }
}
