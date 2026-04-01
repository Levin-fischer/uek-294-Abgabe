import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatIcon,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  protected title = 'Das ist mein Projekt!';
  protected text = 'Das ist mein Text';

  doToggleText() {
    if (this.text === 'Das ist mein Text') {
      this.text = 'Das ist mein neuer Text';
    } else {
      this.text = 'Das ist mein Text';
    }
  }
}
