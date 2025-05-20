import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 pt-20 pb-6 max-w-4xl">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-4">My Tasks</h2>
        <button 
          (click)="showAddForm = true" 
          class="w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md transition-all"
        >
          Add New Task
        </button>
      </div>

      <!-- Add Task Form -->
      <div *ngIf="showAddForm" class="mb-6 p-4 border rounded-lg shadow-md bg-white">
        <h3 class="text-xl font-semibold mb-4">{{ editingTask ? 'Edit Task' : 'Add New Task' }}</h3>
        <div class="space-y-4">
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-medium text-gray-700">Title</label>
            <input
              [(ngModel)]="newTask.title"
              placeholder="Enter task title"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              [(ngModel)]="newTask.description"
              placeholder="Enter task description"
              rows="3"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              (click)="saveTask()"
              class="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 shadow-md transition-all"
            >
              {{ editingTask ? 'Update Task' : 'Add Task' }}
            </button>
            <button
              (click)="cancelEdit()"
              class="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Task List -->
      <div class="space-y-4">
        <div *ngFor="let task of tasks" 
          class="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                [checked]="task.completed"
                (change)="toggleComplete(task)"
                class="mt-1.5 h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <div>
                <h3 class="text-lg font-semibold" [class.line-through]="task.completed">
                  {{ task.title }}
                </h3>
                <p class="mt-1 text-gray-600" [class.line-through]="task.completed">
                  {{ task.description }}
                </p>
              </div>
            </div>
            <div class="flex gap-2 mt-3 sm:mt-0">
              <button
                (click)="editTask(task)"
                class="flex-1 sm:flex-none bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow-sm transition-all"
              >
                Edit
              </button>
              <button
                (click)="deleteTask(task._id!)"
                class="flex-1 sm:flex-none bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="tasks.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-lg">No tasks yet. Click 'Add New Task' to get started!</p>
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
