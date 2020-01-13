import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ChatService } from '../chat.service';
import { ChatMessage } from '../chat-message';

@Component({
  selector: 'app-chatbot-window',
  templateUrl: './chatbot-window.component.html',
  styleUrls: ['./chatbot-window.component.scss']
})
export class ChatbotWindowComponent implements OnInit {
  chatOpen = false;
  userName: string;
  chatMessages: ChatMessage[] = [];
  message = new FormControl();

  constructor(private chatService: ChatService) {}

  public onToggleChatbot() {
    this.chatOpen = !this.chatOpen;
  }

  public onSendMessage() {
    this.chatMessages.push({ isBot: false, text: this.message.value });
    this.chatService
      .sendMessage(this.userName, this.message.value)
      .subscribe(responseMessages => {
        this.chatMessages = [...this.chatMessages, ...responseMessages];
        this.message.reset();
        console.log(responseMessages);
      });
  }

  public ngOnInit() {
    this.userName = Math.random()
      .toString(36)
      .substr(2);
    this.chatService
      .initRasaChat(this.userName)
      .subscribe(data => console.log('Rasa conversation initialized.'));
    this.chatMessages.push({
      isBot: true,
      text: 'Hi, I am the chatbot. How can I help?'
    });
  }
}
