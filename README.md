# 🚀 Real-Time Chat Application

A **full-stack real-time chat application** built with modern web technologies.  
This project enables users to communicate instantly with features like authentication, real-time messaging, file uploads, and notifications.

The project follows a **client-server architecture** using **Next.js for the frontend** and **Node.js + Express for the backend**, with **Socket.IO powering real-time communication**.

---

# 🛠 Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- Bootstrap
- Axios
- Socket.IO Client
- React Toastify
- React Icons

## Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT Authentication
- Cloudinary (image uploads)
- Nodemailer

---

# 📂 Project Structure

```text
project-root
│
├── client # Next.js frontend
│
├── server # Node.js backend
│
└── README.md
```

---

# ⚙️ Environment Variables

Before running the project, you must configure environment variables.

---

# Client `.env`

Create a file named:

client/.env.local


Add the following:

```env
NEXT_PUBLIC_API_URL="https://localhost:8087"
```

Server .env

Create a file named:
```env
server/.env
```

Example configuration:

```env
MONGO_URL="your_mongodb_connection_string"

SECRET="your_jwt_secret"

PORT=8087

CORS_PORT="http://localhost:3000"

EMAIL_USER="your_email@gmail.com"

EMAIL_PASS="your_email_app_password"

CLOUD_NAME="your_cloudinary_cloud_name"

API_KEY="your_cloudinary_api_key"

API_SECRET="your_cloudinary_api_secret"
```

⚠️ Important:
Never commit .env files to GitHub.

🚀 Running the Project Locally

Follow these steps to run the application locally.

1️⃣ Clone the Repository

```text
git clone https://github.com/your-username/your-repository.git

cd your-repository
```

2️⃣ Install Dependencies
Client

```text
cd client
npm install
```

Server

```text
cd ../server
npm install
```

3️⃣ Configure Environment Variables

Create the .env files as described above.

4️⃣ Start the Backend Server

Inside the server folder:

```text
npm run server
```

Server will run on:

```text
http://localhost:8087
```

5️⃣ Start the Frontend

Open a new terminal.

Inside the client folder:

```text
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

🤝 Contributing

Contributions are welcome! Follow these steps to contribute.

1️⃣ Fork the Repository

Click the Fork button on GitHub.

2️⃣ Clone Your Fork

```text
git clone https://github.com/your-username/repository-name.git
```

3️⃣ Create a Branch

Always create a new branch for your work.

```text
git checkout -b feature/your-feature-name
```

Example

```text
feature/add-message-reactions
fix/chat-scroll-bug
```

4️⃣ Make Your Changes

Implement your feature or bug fix.

Make sure:

Code is clean

No unnecessary console logs

Follow project structure

Test before pushing

5️⃣ Commit Changes
```text
git add .
git commit -m "feat: add message reaction feature"
```

Use meaningful commit messages.

Examples:

```text
feat: add emoji picker
fix: resolve message auto-scroll issue
refactor: improve chat component structure
```

6️⃣ Push Your Branch
```text
git push origin feature/your-feature-name
```

7️⃣ Open a Pull Request

Go to GitHub and open a Pull Request.

Provide:

Clear description

Screenshots if UI changes

Linked issue if applicable

🐛 Reporting Issues

If you find bugs or want to request a feature:

Go to Issues

Click New Issue

Describe the problem clearly

Include:

Steps to reproduce

Expected behavior

Screenshots (if applicable)

💡 Contribution Ideas

You can contribute by:

Improving UI/UX

Adding new chat features

Fixing bugs

Improving performance

Writing documentation

Adding tests

⭐ Support the Project

If you find this project useful:

⭐ Star the repository

It helps the project grow and reach more developers.

We truly appreciate your support.

We love stars ⭐

Give the repository a star and help the project grow 🚀