import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-username-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="overlay">
      <div class="dialog">
        <h2>Enter your username</h2>
        <form (ngSubmit)="onSubmit()">
          <input
            type="text"
            [(ngModel)]="username"
            name="username"
            placeholder="Username"
            required
            minlength="3"
            class="username-input"
          />
          <button type="submit" [disabled]="!username || username.length < 3">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .username-input {
      padding: 0.5rem;
      margin-right: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      padding: 0.5rem 1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
    }
  `]
})
export class UsernameDialogComponent {
  @Output() usernameSet = new EventEmitter<string>();
  username = '';

  onSubmit() {
    if (this.username && this.username.length >= 3) {
      this.usernameSet.emit(this.username);
    }
  }
}