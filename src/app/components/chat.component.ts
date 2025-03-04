import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { UsernameDialogComponent } from './username-dialog.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, UsernameDialogComponent],
  template: `
    <app-username-dialog
      *ngIf="!chatService.username()"
      (usernameSet)="onUsernameSet($event)"
    ></app-username-dialog>

    <div class="chat-container" *ngIf="chatService.username()">
      <div class="header">
        <h1>Chat App</h1>
        <div class="user-info">
          <span>Logged in as: <strong>{{ chatService.username() }}</strong></span>
          <button class="change-username-btn" (click)="changeUsername()">Change Username</button>
        </div>
      </div>

      <div class="messages" #messageContainer>
        <div
          *ngFor="let message of chatService.messages()"
          class="message"
          [class.own-message]="message.author === chatService.username()"
        >
          <div class="message-header">
            <span class="author">{{ message.author }}</span>
            <span class="timestamp">{{ message.timestamp | date:'short' }}</span>
          </div>
          <div class="message-content">{{ message.text }}</div>
        </div>
      </div>

      <form (ngSubmit)="sendMessage()" class="message-form">
        <input
          type="text"
          [(ngModel)]="newMessage"
          name="message"
          placeholder="Type a message..."
          (keyup.enter)="sendMessage()"
        />
        <button type="submit" [disabled]="!newMessage.trim()">Send</button>
      </form>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .change-username-btn {
      padding: 0.3rem 0.6rem;
      background: #f0f0f0;
      color: #333;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: normal;
      min-width: 140px;
    }
    .change-username-btn:hover {
      background: #e0e0e0;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .message {
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: white;
      border-radius: 8px;
      max-width: 70%;
    }
    .own-message {
      margin-left: auto;
      background: #007bff;
      color: white;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
    }
    .message-content {
      word-break: break-word;
    }
    .message-form {
      display: flex;
      gap: 1rem;
    }
    input {
      flex: 1;
      padding: 0.5rem;
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
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  newMessage = '';

  constructor(public chatService: ChatService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onUsernameSet(username: string) {
    this.chatService.setUsername(username);
  }

  changeUsername() {
    this.chatService.changeUsername();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage.trim());
      this.newMessage = '';
    }
  }
}