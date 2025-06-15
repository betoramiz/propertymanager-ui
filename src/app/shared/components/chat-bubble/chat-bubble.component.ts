import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  imports: [],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.css'
})
export class ChatBubbleComponent {
  message: InputSignal<string> = input("...");
  time: InputSignal<string> = input("00:00:00");
}
