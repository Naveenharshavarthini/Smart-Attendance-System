import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private departmentApiUrl = `${environment.apiUrl}/departments`;
  private classApiUrl = `${environment.apiUrl}/classes`;
  private subjectApiUrl = `${environment.apiUrl}/subjects`;
  private timeTableApiUrl = `${environment.apiUrl}/timetable`;
  constructor(private http: HttpClient) {}

  // Department Methods

  // Get all departments
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(this.departmentApiUrl);
  }

  // Get department by ID
  getDepartmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.departmentApiUrl}/${id}`);
  }

  // Create new department
  createDepartment(department: any): Observable<any> {
    return this.http.post<any>(this.departmentApiUrl, department);
  }

  // Update department
  updateDepartment(id:any,department: any): Observable<any> {
    return this.http.put<any>(`${this.departmentApiUrl}/${id}`, department); // Use _id
  }

  // Delete department
  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.departmentApiUrl}/${id}`);
  }

  // Class Methods

  // Get all classes
  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(this.classApiUrl);
  }

  // Get class by ID
  getClassById(id: string): Observable<any> {
    return this.http.get<any>(`${this.classApiUrl}/${id}`);
  }

  // Create new class
  createClass(classData: any): Observable<any> {
    return this.http.post<any>(this.classApiUrl, classData);
  }

  // Update class
  updateClass(id: string, classData: any): Observable<any> {
    return this.http.put<any>(`${this.classApiUrl}/${id}`, classData);
  }

  // Delete class
  deleteClass(id: string): Observable<any> {
    return this.http.delete<any>(`${this.classApiUrl}/${id}`);
  }
   // Clock in attendance
   clockInAttendance(attendanceData: any): Observable<any> {
    return this.http.post<any>(`${this.classApiUrl}/clock-in`, attendanceData);
  }
  
  getAttendance(paramsobj?:any): Observable<any[]> {
    const params: any = {};
    if (paramsobj.userId) params.userId = paramsobj.userId;
    if (paramsobj.classId) params.classId = paramsobj.classId;
    if (paramsobj.departmentId) params.departmentId = paramsobj.departmentId;
    if (paramsobj.subjectId) params.subjectId = paramsobj.subjectId;
    return this.http.post<any[]>(`${this.classApiUrl}/getattendance`, { params });
  }
  getAttendanceReport(paramsobj?: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.classApiUrl}/getAttendanceReport`, { params: paramsobj });
  }
  getAllSubjects(): Observable<any> {
    return this.http.get(`${this.subjectApiUrl}`);
  }

  getSubjectById(id: string): Observable<any> {
    return this.http.get(`${this.subjectApiUrl}/${id}`);
  }

  createSubject(data: any): Observable<any> {
    return this.http.post(`${this.subjectApiUrl}`, data);
  }

  updateSubject(id: string, data: any): Observable<any> {
    return this.http.put(`${this.subjectApiUrl}/${id}`, data);
  }

  deleteSubject(id: string): Observable<any> {
    return this.http.delete(`${this.subjectApiUrl}/${id}`);
  }
  getTimetable(classId:any): Observable<any> {
    return this.http.get(`${this.timeTableApiUrl}/${classId}`);
  }

  saveTimetable(timetableData: any): Observable<any> {
    return this.http.post(this.timeTableApiUrl, timetableData);
  }
  // Get all timetables
  getTimetables() {
    return this.http.get(this.timeTableApiUrl);
  }
// Update timetable by timetable ID
updateTimetable(timetableId: string, timetableData: any): Observable<any> {
  return this.http.put(`${this.timeTableApiUrl}/${timetableId}`, timetableData);
}
  // Delete timetable by ID
  deleteTimetable(id: string): Observable<void> {
    return this.http.delete<void>(`${this.timeTableApiUrl}/${id}`);
  }
}
