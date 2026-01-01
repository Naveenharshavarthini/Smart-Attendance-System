import { Component, OnInit } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl'; // Use WebGL backend
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-facesreg',
  templateUrl: './facesreg.component.html',
  styleUrls: ['./facesreg.component.scss'] // Corrected to 'styleUrls'
})
export class FacesregComponent implements OnInit {
  trigger: Subject<void> = new Subject<void>();
  triggerObservable: Observable<void> = this.trigger.asObservable();

  capturedImage: any = null;
  uploadedImage: any  = null;
  matchResult: string = '';
  imagepick = null;
  async ngOnInit() {
    await tf.setBackend('webgl'); // Set TensorFlow.js backend
    await tf.ready();
    console.log('TensorFlow.js backend initialized.');

    // Load Face API models
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
      console.log('Face API models loaded successfully.');
    } catch (error) {
      console.error('Error loading Face API models:', error);
    }
  }

  async handleImage(webcamImage: WebcamImage) {
    this.capturedImage = new Image();
    this.capturedImage.src = webcamImage.imageAsDataUrl;

    // Wait for the image to load
    await new Promise<void>((resolve) => {
      if (this.capturedImage) {
        this.capturedImage.onload = resolve;
      }
    });
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = async (e: any) => {
        this.uploadedImage = new Image();
        this.uploadedImage.src = e.target.result;

        // Wait for the image to load
        await new Promise<void>((resolve) => {
          if (this.uploadedImage) {
            this.uploadedImage.onload = resolve;
          }
        });
      };
      fileReader.readAsDataURL(input.files[0]);
    }
  }

  capture() {
    this.trigger.next();
  }

  async compareFaces() {
    if (!this.capturedImage || !this.uploadedImage) {
      this.matchResult = 'Please provide both an uploaded and a captured image!';
      return;
    }

    const capturedDescriptor = await this.getFaceDescriptor(this.capturedImage);
    console.log('Captured Descriptor:', capturedDescriptor);
    
    const uploadedDescriptor = await this.getFaceDescriptor(this.uploadedImage);
    console.log('Uploaded Descriptor:', uploadedDescriptor);

    if (!capturedDescriptor || !uploadedDescriptor) {
      this.matchResult = 'No face detected in one or both images!';
      return;
    }

    const distance = faceapi.euclideanDistance(capturedDescriptor, uploadedDescriptor);
    console.log('Face distance:', distance);

    if (distance < 0.6) {
      this.matchResult = '✅ Face Matched! Attendance Marked.';
      console.log('Face Matched');
    } else {
      this.matchResult = '❌ Face Not Recognized!';
      console.log('Face Not Recognized');
    }
  }

  async getFaceDescriptor(image: HTMLImageElement): Promise<Float32Array | null> {
    try {
      const detection = await faceapi.detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();
  
      console.log('Detection Result:', detection); // Log the detection result
      return detection ? detection.descriptor : null;
    } catch (error) {
      console.error('Error in getFaceDescriptor:', error);
      return null;
    }
  }
}