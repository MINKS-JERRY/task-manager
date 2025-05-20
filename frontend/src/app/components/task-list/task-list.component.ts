import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="mb-4">
        <h2 class="text-2xl font-bold mb-4">My Tasks</h2>
        <button (click)="showAddForm = true" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add New Task
        </button>
      </div>

      <!-- Add Task Form -->
      <div *ngIf="showAddForm" class="mb-4 p-4 border rounded">
        <h3 class="text-lg font-semibold mb-2">{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h3>
        <div class="space-y-2">
          <input
            [(ngModel)]="newTask.title"
            placeholder="Task title"
            class="w-full p-2 border rounded"
          />
          <textarea
            [(ngModel)]="newTask.description"
            placeholder="Task description"
            class="w-full p-2 border rounded"
          ></textarea>
          <div>
            <button
              (click)="saveTask()"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
            >
              {{ editingTask ? 'Update' : 'Add' }}
            </button>
            <button
              (click)="cancelEdit()"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div class="space-y-4">
        <div *ngFor="let task of tasks" class="p-4 border rounded">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                [checked]="task.completed"
                (change)="toggleComplete(task)"
                class="h-5 w-5"
              />
              <h3 class="text-lg font-semibold" [class.line-through]="task.completed">
                {{ task.title }}
              </h3>
            </div>
            <div class="space-x-2">
              <button
                (click)="editTask(task)"
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                (click)="deleteTask(task._id!)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          <p class="mt-2 text-gray-600" [class.line-through]="task.completed">
            {{ task.description }}
          </p>
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
