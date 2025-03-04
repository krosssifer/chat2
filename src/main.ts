import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ChatComponent } from './app/components/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent],
  template: '<app-chat></app-chat>'
})
export class App {}

bootstrapApplication(App);