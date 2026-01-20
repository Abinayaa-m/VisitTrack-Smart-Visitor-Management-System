# VisitTrack-Smart-Visitor-Management-System

A secure Visitor Management System built with QR authentication, role-based access (Admin, Security, Staff), visitor tracking and real-time visitor analytics. The system replaces manual visitor registers with a **secure, scalable, and analytics-driven solution**.

🚀 **Features**

 🔐 Authentication & Roles
- Role-based access control:
  - Admin
  - Security
  - Staff
- Secure login & authorization using **Spring Security + JWT**

🧾 Visitor Management
- Add visitor with **email validation**
- Automatic **QR code generation** for each visitor
- Email delivery of visitor QR code
- Visitor **entry and exit tracking**
- Manual exit by security
- Visitor status tracking (ACTIVE / EXITED)

📊 Dashboards & Analytics
- Security Dashboard with:
  - Visitors Today
  - Active Visitors
  - Exited Visitors
  - **Hourly Visitors Bar Chart**
- Peak hour detection


 🔎 Search & Filters
- Search visitors by name, email, or phone
- Filter by:
  - Date range
  - Status
  - Staff
- Advanced search with multiple conditions

 📤 Reports
- Export visitor data to:
  - Excel
  - CSV

 🛡️ Security Features
- QR-based verification
- Email format validation (backend enforced)
- Role-based API protection
- Secure visitor scan and exit flow


 🛠️ Tech Stack

**Backend**
- Spring Boot
- Spring Security + JWT
- JPA
- MySQL
- Java Mail Sender
- Postman 

**Frontend**
- React.js
- Tailwind CSS
- Chart.js
- Axios

 🏗️ System Architecture

Frontend (React + Tailwind)
|
| REST APIs
|
Backend (Spring Boot)
|
| JPA
|
Database (MySQL)


🔄 Application Workflow

1. Visitor is registered by Security
2. QR code is generated and emailed to visitor
3. Entry time is recorded
4. Security exits visitor manually or via scan
5. Exit time is recorded
6. Dashboard analytics update in real time
