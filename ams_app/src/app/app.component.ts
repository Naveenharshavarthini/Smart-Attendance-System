import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UtilityService } from './services/utility.service';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl'; // Use WebGL for better performance
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  alertMessage: string | null = null;
  alertType: string | null = null;

  constructor(private utilityService: UtilityService) {}

  async ngOnInit(): Promise<void> {
    this.utilityService.getAlertObservable().subscribe((alert) => {
      this.alertMessage = alert.message;
      this.alertType = alert.type;

      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        this.clearAlert();
      }, 7000);
    });
    await tf.setBackend('webgl'); // or 'wasm' for CPU fallback
    await tf.ready();
    console.log('TensorFlow.js backend initialized.');
  }

  clearAlert() {
    this.alertMessage = null;
    this.alertType = null;
  }
}
