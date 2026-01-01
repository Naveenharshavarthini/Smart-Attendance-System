# Smart-Attendance-System

## About
This project is a smart attendance system that automatically marks student or employee attendance using face recognition combined with geolocation verification.
​
It ensures that attendance is recorded only when the user is physically present in the allowed location (e.g., classroom, office) and their face is successfully authenticated.


## Features
- Automatic face detection and recognition for each user.
- Geolocation check to ensure user is within an authorized radius before marking attendance.
- Secure login for admin/teacher to view and manage attendance records.
- Real-time attendance marking with date and time stamps.
- Attendance history view per user, per day, and per subject/session.
- Simple dashboard interface for monitoring present/absent status.
- Option to export attendance reports (e.g., CSV/Excel) for academic.

## Tech Stack
- Frontend: Angular, HTML, CSS, Bootstrap
- Backend: Node.js with TypeScript, TensorFlow/TensorFlow.js SDK
- Database: MongoDB
- IDE & Tools: Visual Studio Code, Chrome/Safari browser

### Project Structure
```
Smart-Attendance-System
│
├── ams_app              # Frontend (Angular)
│   ├── src
│   ├── angular.json
│   └── package.json
│
├── ams_backend          # Backend (Node.js)
│   ├── controllers
│   ├── models
│   ├── routes
│   └── server.js
│
├── README.md
└── .gitignore
```
## Installation and Setup

1.Clone the Repository
```
git clone https://github.com/Naveenharshavarthini/Smart-Attendance-System.git
cd Smart-Attendance-System
```
2.Backend Setup
```
cd ams_backend
npm install
npm start
```

3.Frontend Setup
```
cd ams_app
npm install
ng serve
```
## Default Admin Login
- Admin:`Admin` | Password: `Admin@100`


## Future Enhancements

1. GPS-based location validation.
2. Mobile application support.
3. Cloud deployment.
4. Advanced analytics dashboard.

## Contributing
Contributions are welcome! Feel free to fork the project, make improvements, and create pull requests.

## Contact
Created By Naveenharshavarthini Ganesan

GitHub: [https://github.com/Naveenharshavarthini](https://github.com/Naveenharshavarthini)  
LinkedIn: [https://www.linkedin.com/in/naveenharshavarthini-ganesan-4047a6311/](https://www.linkedin.com/in/naveenharshavarthini-ganesan-4047a6311/)

---

Thank you for checking out this project!  
