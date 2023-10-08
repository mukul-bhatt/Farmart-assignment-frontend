# File Upload and Short Link Generator

This project is a web application that allows users to upload files, generates short links for those files, and provides user authentication and authorization to manage their uploaded files. The application consists of both a frontend and a backend component.

## Frontend

The frontend of the application is responsible for providing a user-friendly interface for file upload and interaction with uploaded files.

### Features:

- **File Upload**: Users can select and upload files from their local system.

- **Short Link Display**: After a file is successfully uploaded, a short link is generated and displayed to the user.

- **Error Handling**: The frontend includes error handling to validate file types and enforce file size restrictions. Users are notified of any issues during the file upload process.

- **Download Link**: Users can access a download link for the uploaded file.

### Frontend Technologies:

- Next.js (App Router)
- TypeScript
- Tailwind CSS

GitHub Frontend Repository: [Upload-File-Generate-Url](https://github.com/abhishekvatsAV/Upload-File-Generate-Url)

## Backend

The backend of the application handles file upload, short link generation, user authentication, and database management.

### Features:

- **API**: An API is implemented on the server-side to handle file upload and short link generation.

- **File Storage**: Uploaded files are securely stored either on the server or on a cloud storage service, such as AWS S3, depending on the configuration.

- **Short Link Generation**: A unique short link is generated for each uploaded file to provide easy access to the file.

- **Database Storage**: Information about the uploaded files, including the short link and file details, is stored in a MongoDB database.

- **User Authentication and Authorization**: Registered users can manage their uploaded files. User authentication and authorization mechanisms are implemented to ensure that only authorized users can access and modify their files.

- **File Deletion**: A file deletion feature is available, allowing users to remove their uploaded files when needed.

- **Security**: Uploaded files are stored securely, and access is restricted to authorized users. Proper security measures are implemented to prevent unauthorized access to files.

### Backend Technologies:

- Node.js
- Express.js
- MongoDB

GitHub Backend Repository: [Upload-File-Generate-Url-Backend](https://github.com/abhishekvatsAV/Upload-File-Generate-Url-Backend)

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

```bash
 git clone https://github.com/abhishekvatsAV/Upload-File-Generate-Url
```

2. Install dependencies

```zsh
 npm install
```

3. Run Server

```zsh
  npm run dev
```

Do These same steps for Backend.

# Deployed Application

You can access the deployed application at 

