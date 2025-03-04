import { Injectable, signal } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly STORAGE_KEY = 'chat_messages';
  private readonly USERNAME_KEY = 'chat_username';
  private broadcastChannel: BroadcastChannel;
  
  messages = signal<Message[]>([]);
  username = signal<string>('');

  constructor() {
    this.broadcastChannel = new BroadcastChannel('chat_channel');
    this.loadMessages();
    this.setupBroadcastChannel();
    this.loadUsername();
  }

  private setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'NEW_MESSAGE') {
        if (!this.messages().some(m => m.id === event.data.message.id)) {
          this.messages.update(msgs => [...msgs, event.data.message]);
          this.saveMessages();
        }
      } else if (event.data.type === 'REQUEST_MESSAGES') {
        this.broadcastChannel.postMessage({
          type: 'SYNC_MESSAGES',
          messages: this.messages()
        });
      } else if (event.data.type === 'SYNC_MESSAGES') {
        const newMessages = event.data.messages.filter(
          (newMsg: Message) => !this.messages().some(existingMsg => existingMsg.id === newMsg.id)
        );
        
        if (newMessages.length > 0) {
          this.messages.update(msgs => {
            const combined = [...msgs, ...newMessages];
            return combined.sort((a: Message, b: Message) => a.timestamp - b.timestamp);
          });
          this.saveMessages();
        }
      }
    };

    this.broadcastChannel.postMessage({
      type: 'REQUEST_MESSAGES'
    });
  }

  private loadMessages() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.messages.set(JSON.parse(stored));
    }
  }

  private saveMessages() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages()));
  }

  loadUsername(): string {
    const stored = localStorage.getItem(this.USERNAME_KEY);
    if (stored) {
      this.username.set(stored);
      return stored;
    }
    return '';
  }

  setUsername(username: string) {
    this.username.set(username);
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  changeUsername() {
    this.username.set('');
    localStorage.removeItem(this.USERNAME_KEY);
  }

  sendMessage(text: string) {
    const message: Message = {
      id: crypto.randomUUID(),
      text,
      author: this.username(),
      timestamp: Date.now()
    };

    this.messages.update(msgs => [...msgs, message]);
    this.saveMessages();
    
    this.broadcastChannel.postMessage({
      type: 'NEW_MESSAGE',
      message
    });
  }
}