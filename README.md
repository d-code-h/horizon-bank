# 🌅 Horizon Bank

Welcome to **Horizon Bank**! 🌟  
A modern banking platform built with **Next.js**, **React**, and a powerful tech stack to offer seamless banking services. 🚀

![Horizon Bank](/public/horizon.png)

## 🛠️ Features

- **User Authentication**: Sign up and sign in with email and password, or link your account securely with **Plaid**. 🔐
- **Animated Counters**: Display real-time data and stats with smooth animations using **CountUp**. 📊
- **Charts & Analytics**: View financial data through dynamic charts powered by **Chart.js**. 📉📈
- **Bank Integrations**: Integrate with **Dwolla** for payment solutions and **Plaid** for account linking. 💳
- **Secure Communication**: Easily manage user data with encryption and hashing, utilizing **bcryptjs**. 🔒
- **Responsive Design**: Enjoy a smooth experience on both mobile and desktop devices. 📱💻

## 🚀 Getting Started

### Prerequisites

Make sure you have **Bun** installed on your machine. You can install it from [Bun.sh](https://bun.sh/).

### Installation

1. Clone this repository:
   `git clone https://github.com/d-code-h/horizon-bank.git`

2. Navigate into the project directory:
   `cd horizon-bank`

3. Install dependencies with Bun:
   `bun install`
4. Run the app in development mode:
   `bun run dev`

This will start the app on http://localhost:3000.

### Building for Production

To build the project for production, run:
`bun run build`

To start the production server, use:
`bun run start`

### ⚙️ Technologies Used

- **Frontend:**

  - **React & Next.js** for the user interface and server-side rendering. ⚛️
  - **Tailwind CSS** for styling and utility-first design. 🎨
  - **Shadcn** for accessible, styled components. 📦
  - **Chart.js** for rendering interactive and customizable charts. 📊

- Backend:
  - **MongoDB** for database storage. 🗄️
  - **NextAuth.js** for authentication. 🔑
  - **Dwolla API** for payment processing. 💵
  - **Plaid API** for secure bank account integrations. 💳
  - **bcryptjs** for hashing passwords. 🔐

### 🏗️ Project Structure

Here’s a quick breakdown of the project structure:

```
/horizon-bank
├── /components # Reusable components (e.g., forms, buttons)
├── /app # Next.js pages (e.g., auth, dashboard)
├── /public # Public assets (e.g., images, icons)
├── /lib # Utility functions and API integrations
├── /constants          # All constants used throughout the app (e.g., API endpoints, error messages)
├── /types              # TypeScript types and interfaces for the app
├── package.json # Project metadata and dependencies
└── next.config.js # Next.js configuration file
```

### 📄 Scripts

Here are some of the scripts available for development:

- **bun run dev:** Start the development server.
- **bun run build:** Build the project for production.
- **bun run start:** Start the production server.
- **bun run lint:** Lint your code to follow best practices.

### 🧑‍💻 Contributing

We welcome contributions to Horizon Bank! 🎉
Feel free to open issues or submit pull requests. Please make sure to follow the coding guidelines and the project's structure.

### 📝 License

This project is licensed under the MIT License.
