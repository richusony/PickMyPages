# PickMyPages
PickMyPages is a web application that allows users to upload a PDF, view all its pages, select specific pages, and create a new PDF containing only the selected pages. This app uses React for the frontend with JSX and Tailwind CSS, while the backend is powered by Node.js to handle PDF processing, including extracting and recreating the PDF based on user selections.


## Features
- User authentication (JWT-based)
- Upload a PDF file
- Preview all pages in the uploaded PDF
- Select specific pages from the preview, Create and download a new PDF with only the selected pages.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **File Uploads**: Multer
- **Server Environment**: Render

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/richusony/PickMyPages.git
cd PickMyPages
```
### 2. Install dependencies

```bash
cd /server
npm install

cd /client
npm install
```

### 3. Start Server and Client

```bash
cd /server
npm start

cd /client
npm run dev
```

### 4. Enjoy Development 😌⌨️