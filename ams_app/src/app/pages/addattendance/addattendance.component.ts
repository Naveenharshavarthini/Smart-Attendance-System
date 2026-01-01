import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { MasterService } from '../../services/master.service';
import { UtilityService } from '../../services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as faceapi from '@vladmandic/face-api';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-addattendance',
  templateUrl: './addattendance.component.html',
  styleUrls: ['./addattendance.component.scss']
})
export class AddattendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hourLabels: string[] = [];
  currentDayIndex: number;
  currentWeekStart: moment.Moment; // Holds the start date of the current week
  locationError: string | null = null;
  canSubmit = false;
  allowedRadius = 20; // meters
  classLatitude: any | null = null;
  classLongitude: any | null = null;
  userClassId: string | null = null;
  studentLatitude: any | null = null;
  studentLongitude: any | null = null;
  userId:any=null;
  storedUser: any;
  timetable:any=null;
  attendanceData: any[] = []; // To hold fetched attendance records
  onclickcurrenttime:any = null;
  tabledayIndex :any;
  tablehourIndex:any;
  capturedImage: any = null;
  isfaceload = false;
  @ViewChild('clockInModal') clockInModal: any;
    trigger: Subject<void> = new Subject<void>();
  triggerObservable: Observable<void> = this.trigger.asObservable();

  constructor(private fb: FormBuilder, 
    private modalService: NgbModal, private masterService: MasterService, 
    private route: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService) {
    this.attendanceForm = this.fb.group({
      attendance: this.fb.array([])
    });
    this.currentDayIndex = moment().weekday() - 1;
    this.currentWeekStart = moment().startOf('isoWeek'); // Set current week's start date
    this.generateHourLabels();
    console.log(this.weekDays);

    
  }

  ngOnInit(): void {
    this.initializeForm();
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loadAttendanceData(); // Load attendance data on component initialization
    console.log(this.getHourControls(1));
    this.loadFaceApiModels()
  }

  // Load user class from local storage
  loadUserClass() {
    this.storedUser = JSON.parse(localStorage.getItem('user') || '{}'); 
   //  this.masterService.getClasses().subscribe(classes => {
      let studentclass = this.attendanceData.find((att: any) => 
        (att.userId === this.userId && att.subject == this.storedUser.subject))
    console.log(studentclass);
    this.userClassId = this.storedUser.role == 'Student'? this.storedUser.class:(studentclass?.class||'')
    console.log(this.userClassId);
      if (this.userClassId) {
        // this.classLatitude = userClass.lat;
        // this.classLongitude = userClass.lng;
          this.masterService.getTimetable(this.userClassId).subscribe((timetable: any) => {
            console.log('timetable', timetable);
            this.timetable = timetable; // Attach timetable to user class
          },(e)=>{
            alert('No timetable found for your class!')
            this.router.navigate(['/']);
          });
      }
  //  });
  }
  async loadFaceApiModels() {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models')
    ]);
    console.log('Face API models loaded.');
  }
  loadAttendanceData() {
    this.storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = this.userId !=null?this.userId: this.storedUser._id; // Assuming you have the user ID stored
  //  const studentId =  this.storedUser._id; // Assuming you have the user ID stored
    this.masterService.getAttendance(studentId).subscribe(
      (data: any) => {
        this.attendanceData = data;
        console.log('attendanceData',this.attendanceData);
        this.attendanceData = data.filter((record: any) => record.userId === studentId);
        console.log('Filtered attendanceData', this.attendanceData);
        this.loadUserClass();
      },
      (error) => {
        console.error('Error fetching attendance data:', error);
      }
    );
  }

  generateHourLabels() {
    const hours = [];
    for (let i = 9; i < 16; i++) {
      const nextHour = i + 1;
      const suffix = i < 12 ? 'AM' : 'PM';
      const formattedHour = (i % 12 === 0 ? 12 : i % 12);
      const formattedNextHour = (nextHour % 12 === 0 ? 12 : nextHour % 12);
      hours.push(`${formattedHour}-${formattedNextHour} ${suffix}`);
    }
    this.hourLabels = hours;
  }
  getSubjectLocation(dayIndex: number, hourIndex: number) {
    const userClass = this.storedUser?.class;
    console.log(dayIndex ,hourIndex);
     console.log(this.timetable);
     
    if (!this.timetable) return null;
    
    const dayTimetable = this.timetable?.schedule[dayIndex];
    console.log(dayTimetable);
    if (dayTimetable && dayTimetable.slots[hourIndex]) {
      
      return {
        lat: dayTimetable.slots[hourIndex].subject.latitude,
        lng: dayTimetable.slots[hourIndex].subject.longitude
      };
    }
    return null;
  } 
  initializeForm() {
    const attendanceArray = this.attendanceForm.get('attendance') as FormArray;
    this.weekDays.forEach(() => {
      const dayArray = this.fb.group({
        hours: this.fb.array(this.hourLabels.map(() => new FormControl(false)))
      });
      attendanceArray.push(dayArray);
    });
  }

  getHourControls(dayIndex: number) {
    const attendanceArray = this.attendanceForm.get('attendance') as FormArray;
    return (attendanceArray.at(dayIndex).get('hours') as FormArray).controls;
  }
  getAttendanceStatus(dayIndex: number, hourIndex: number) {
    const currentDate = this.getDayDate(dayIndex); // Assuming this returns a date string (YYYY-MM-DD format)
    let currentHour = this.hourLabels[hourIndex];

    // Extract the end hour if the label has a time range (e.g., '9 AM - 10 AM')
    if (currentHour.includes('-')) {
        currentHour = currentHour.split('-')[1].trim(); // Get the end hour (e.g., '10 AM')
    }

    // Concatenate date and hour to form a date-time string
    const currentDateTime = `${currentDate} ${currentHour}`; // e.g., '2024-10-13 10 AM'
    let [year, month, day]:any = currentDate.split('-');
    // Convert the 12-hour AM/PM format into 24-hour format
    let hour = parseInt(currentHour.split(' ')[0]); // Extract the hour number
    const period = currentHour.split(' ')[1]; // Extract AM/PM
    // Handle AM/PM conversion to 24-hour format
    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0; // Midnight case
    }
    const dateToCheck =  new Date(year, parseInt(month) - 1, day, hour);
    const now = new Date();
  //  console.log(now+'==='+dateToCheck);
    // if (dateToCheck > now) {
    //   return "future"; // If dateToCheck is in the future
    // }
    // Iterate over attendanceData to check if any record matches the current slot
    const isPresent = this.attendanceData.some((record: any) => {
        const recordDateTime = `${moment(record.clockInTime).format('YYYY-MM-DD')} ${moment(record.clockInTime).format('h A')}`;

        // Log the comparison for debugging
      //  console.log(currentDateTime === recordDateTime);

        // Return true if the record matches the current slot
       
        
        return currentDateTime === recordDateTime;
    });
    let current = (dateToCheck.getDate() == now.getDate()) && (dateToCheck.getHours()  == now.getHours()) 
    // console.log(current);
    // Return 'present' if a match is found, otherwise 'absent'
    return isPresent ? 'present' : (dateToCheck > now)?'future': current?'current' :'absent';
}

  isToday(dayIndex: number): boolean {
    return dayIndex === this.currentDayIndex && this.currentWeekStart.isSame(moment().startOf('isoWeek'), 'day');
  }

  async onHourClick(dayIndex: number, hourIndex: number): Promise<void> {
 
  const status = this.getAttendanceStatus(dayIndex, hourIndex);
  // if(this.userId == null){
  //   if (status === 'future') {
  //     this.utilityService.showError('clock-in on this hour yet to be open.');
  //     return
  //   }; // Don't allow future clicks
  //   if (status === 'absent') {
  //     this.utilityService.showError('Unable to clock-in on this hour. Please contact staff.');
  //     return;
  //   }
    
  //   if (status === 'present') {   
  //     this.utilityService.showSuccess('You have already clocked in.');
  //     return;
  //   }
    
  // //  Face Recognition Check
  // // const isFaceMatched = await this.compareFaces();
  // // if (!isFaceMatched) {
  // //   this.utilityService.showError('Face did not match.');
  // //   return;
  // // }
  // }
  
  // Only open the modal for the current day's present or future hours
  console.log(this.isToday(dayIndex));
  
   //if (this.isToday(dayIndex)) {
    const currentDate = this.getDayDate(dayIndex);  // Returns YYYY-MM-DD
    let currentHour = this.hourLabels[hourIndex].split('-')[1].trim(); // Extract the time part
    // Parse the current date into individual components
    let [year, month, day]:any = currentDate.split('-');
    // Convert the 12-hour AM/PM format into 24-hour format
    let hour = parseInt(currentHour.split(' ')[0]); // Extract the hour number
    const period = currentHour.split(' ')[1]; // Extract AM/PM
    // Handle AM/PM conversion to 24-hour format
    if (period === 'PM' && hour !== 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0; // Midnight case
    }
    // Create the Date object using year, month, day, and converted 24-hour format
    this.onclickcurrenttime = new Date(year, parseInt(month) - 1, day, hour);
    console.log(this.onclickcurrenttime);  // Should log a valid date
     this.tabledayIndex = dayIndex;
     this.tablehourIndex = hourIndex;
     this.canSubmit = false;
     this.locationError = null;
     const slotsubjectId = this.timetable?.schedule[this.tabledayIndex]?.slots[this.tablehourIndex]?.subject?._id
     console.log(slotsubjectId,this.storedUser?.subject);
     if(this.storedUser?.role  == "Staff" && this.storedUser?.subject != slotsubjectId){
       this.utilityService.showError('You are not this subject staff!.');
       return;
     }
    this.openClockInModal();
}
  openClockInModal() {
    this.modalService.open(this.clockInModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  getCurrentLocation() {
    const subjectLocation = this.getSubjectLocation(this.tabledayIndex, this.tablehourIndex);
    console.log(subjectLocation);
    
    if (!subjectLocation) {
      console.log('Subject location not found');
      this.locationError = 'There is no subject assigned your class Timetable';
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.studentLatitude = position.coords.latitude;//12.218964//
          this.studentLongitude = position.coords.longitude; //79.649017// 
          console.log(position.coords.latitude,position.coords.longitude);
          console.log (subjectLocation.lat, subjectLocation.lng);
          
          const distance = this.calculateDistance(
            subjectLocation.lat, subjectLocation.lng,
            this.studentLatitude, this.studentLongitude
          );  
          console.log(distance);
           
          if (distance <= this.allowedRadius) {
            this.canSubmit = true;
            this.locationError = null;
            this.locationError = 'Yes, You are at the subject class range!';
          } else {
            this.canSubmit = false;
            this.locationError = 'You are out of subject class range!';
          }
        },
        (error) => {
          this.locationError = 'Unable to get your location!';
        }
      );
    } else {
      this.locationError = 'Geolocation is not supported by this browser!';
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in meters
    // if(lat1 == lat2 && lon1 == lon2){
    //   return 0;
    // }
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c ; // distance in meters
  }

  submitClockIn(modal: any) {
    if (this.canSubmit) {
      modal.close();
      const studentData = {
        userId: this.storedUser._id, // ID from local storage
        studentLatitude: this.studentLatitude,
        studentLongitude: this.studentLongitude,
        idCard: this.storedUser.idCardId, // Can fetch from another API or form input
        status: 'Present',
        clockInTime:this.onclickcurrenttime,
        subject:this.timetable?.schedule[this.tabledayIndex].slots[this.tablehourIndex].subject._id
      };
      this.masterService.clockInAttendance(studentData).subscribe(
        (response) => {
          this.utilityService.showSuccess('Attendance submitted successfully!');
          this.loadAttendanceData();
        },
        (error) => {
          this.utilityService.showError('Something went wrong, please try again!');
        }
      );
    }
  }
  async captureLivePhoto() {
    let videoContainer = document.getElementById('videoContainer'); // Get the div by Id
    if (!videoContainer) return; // Exit if div is not found
     videoContainer.style.display = 'block'
    const video = document.createElement('video');
    video.width = 500;
    videoContainer.appendChild(video);  // Append video to the specific div
  
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
  
    return new Promise<HTMLCanvasElement>((resolve) => {
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        if(videoContainer) videoContainer.style.display = 'none'
        video.pause();
        stream.getTracks().forEach(track => track.stop());
        video.remove();
  
        resolve(canvas);
      }, 5000); // Capture photo after 2 seconds
    });
  }
  getDayDate(dayIndex: number): string {
    const dayDate = this.currentWeekStart.clone().add(dayIndex, 'days');
    return dayDate.format('YYYY-MM-DD');
  }

  // Navigate to the previous week
  previousWeek() {
    this.currentWeekStart = this.currentWeekStart.subtract(1, 'week');
  }

  // Navigate to the next week
  nextWeek() {
    this.currentWeekStart = this.currentWeekStart.add(1, 'week');
  }
  async compareFaces(dayIndex?:any, hourIndex?:any) {
    if(this.userId != null){      
      this.onHourClick(dayIndex, hourIndex);
      return true;
    }
  
    this.isfaceload = true;
    const livePhotoCanvas  = await this.captureLivePhoto()
      if(!livePhotoCanvas) return;
      const storedUser  = JSON.parse(localStorage.getItem('user') || '{}');
      const storedPhoto = 'http://localhost:5001/' + storedUser ?.profilePhoto; // Full image path
      
      if (!storedUser ?.profilePhoto) {
        this.isfaceload = false;
          this.utilityService.showError('No stored photo found.');
          return false;
      }
  
      // Create an image and set crossOrigin
      const storedImage = new Image();
      storedImage.crossOrigin = 'anonymous'; // Set this attribute
      storedImage.src = storedPhoto;
      console.log(livePhotoCanvas);
      console.log(storedImage);
  
      await new Promise((resolve, reject) => {
        storedImage.onload = resolve;  
        storedImage.onerror = () => {
          console.error("Image not found:", storedPhoto);
          this.utilityService.showError("Stored photo not found! or Please reupload your photo");
          this.isfaceload = false;
          reject(new Error("Image not found"));
          return false;
        };
      });
      
      const livePhotoDetection = await faceapi.detectSingleFace(livePhotoCanvas).withFaceLandmarks().withFaceDescriptor();
      console.log(livePhotoDetection);
      const storedPhotoDetection = await faceapi.detectSingleFace(storedImage).withFaceLandmarks().withFaceDescriptor();
      console.log(storedPhotoDetection);
      if (!livePhotoDetection || !storedPhotoDetection) {
          this.utilityService.showError('Face detection failed.');
          this.isfaceload = false;
          return false;
      }
  
      const faceMatcher = new faceapi.FaceMatcher(storedPhotoDetection);
      const match = faceMatcher.findBestMatch(livePhotoDetection.descriptor);
      this.isfaceload = false;
       if( match.label !== 'unknown' && match.distance < 0.6){
        this.onHourClick(dayIndex, hourIndex);
        return true;
       } else{
        this.utilityService.showError('Face Not matched as per record or try again!');
        return false;
       }// 0.6 is the similarity threshold
  //  },() => {return false;})
   
  }
}
