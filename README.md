# MERN Stack CRUD Application

A full-stack CRUD application built with MongoDB, Express.js, React (Next.js), and Node.js.

## 🚀 Tech Stack

### Frontend (Client)

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Storybook** - Component development environment

### Backend (Server)

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Nodemon** - Development server with auto-restart

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) or MongoDB Atlas account

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crud-mern
```

### 2. Install Dependencies

#### Option A: Install all dependencies at once

```bash
# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

#### Option B: Install dependencies separately

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Server Environment

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following environment variables to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crud-mern
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crud-mern
```

#### Client Environment

Create a `.env.local` file in the `client` directory:

```bash
cd client
touch .env.local
```

Add the following environment variables to `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/products
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your server `.env` file

### 5. Run the Application

#### Development Mode

**Terminal 1 - Start the Backend Server:**

```bash
cd server
npm start
```

The server will run on `http://localhost:5000`

**Terminal 2 - Start the Frontend Client:**

```bash
cd client
npm run dev
```

The client will run on `http://localhost:3000`

#### Production Mode

**Build and start the client:**

```bash
cd client
npm run build
npm start
```

**Start the server:**

```bash
cd server
npm start
```

## 📁 Project Structure

```
crud-mern/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── lib/          # Utility functions
│   │   └── assets/       # Static assets
│   ├── package.json
│   └── ...
├── server/                # Express.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
└── README.md
```

## 🚀 Available Scripts

### Client Scripts

```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run storybook    # Start Storybook
```

### Server Scripts

```bash
cd server
npm start            # Start server with nodemon
```

## 🔧 API Endpoints

The server provides the following REST API endpoints:

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## 🎨 Features

- ✅ Create, Read, Update, Delete products
- ✅ Image upload functionality
- ✅ Form validation
- ✅ Responsive design
- ✅ Modern UI components
- ✅ TypeScript support
- ✅ Component documentation with Storybook

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.
