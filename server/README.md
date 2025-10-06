# CRUD MERN API

A production-ready REST API built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Security**: Helmet, Rate Limiting, CORS, Input Validation
- **Performance**: Caching, Compression, Database Optimization
- **Error Handling**: Centralized error handling with Winston logging
- **Documentation**: Interactive Swagger/OpenAPI documentation
- **Testing**: Comprehensive test suite with Vitest

## 📦 Installation

```bash
npm install
```

## 🔧 Environment Setup

1. Copy `.env.example` to `.env`
2. Update environment variables
3. Start the server

```bash
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

Visit `http://localhost:5000/api-docs` for interactive API documentation.

## 🏗️ Architecture

server/
├── controllers/ # Business logic
├── middleware/ # Custom middleware
├── models/ # Database models
├── routes/ # API routes
├── utils/ # Utility functions
├── docs/ # API documentation
└── tests/ # Test files

## 🔒 Security Features

- Helmet for security headers
- Rate limiting (100 req/15min)
- CORS with whitelist
- Input validation and sanitization
- Environment variable protection

## ⚡ Performance Features

- Response caching (5-minute TTL)
- Compression middleware
- Database connection pooling
- MongoDB aggregation pipelines
- Pagination support

## 🛡️ Error Handling

- Custom error classes
- Centralized error handling
- Winston logging with rotation
- Request ID tracking
- Environment-specific responses
