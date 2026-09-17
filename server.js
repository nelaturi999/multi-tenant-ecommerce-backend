const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();


// =====================================================
// PORT
// =====================================================

const PORT = process.env.PORT || 5000;


// =====================================================
// FRONTEND URL
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://multi-tenant-frontend-lac.vercel.app/"];


// =====================================================
// CORS CONFIGURATION
// =====================================================

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an origin
    // such as Postman or REST clients.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("CORS blocked origin:", origin);

    return callback(
      new Error(`CORS blocked this origin: ${origin}`)
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Accept",
    "Authorization",
  ],

  credentials: true,

  optionsSuccessStatus: 204,
};


// =====================================================
// APPLY CORS
// =====================================================

app.use(cors(corsOptions));


// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// =====================================================
// REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
  );

  next();
});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Multi-Tenant E-Commerce Backend is running",
    port: PORT,
  });
});


// =====================================================
// API HEALTH CHECK
// =====================================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Multi-Tenant E-Commerce API is running",
  });
});


// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);


// =====================================================
// PRODUCT ROUTES
// =====================================================

app.use(
  "/api/products",
  productRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    method: req.method,
    path: req.originalUrl,
  });
});


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error(
    "GLOBAL SERVER ERROR:",
    error
  );

  if (
    error &&
    error.message &&
    error.message.startsWith("CORS blocked")
  ) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});


// =====================================================
// MONGODB CONNECTION
// =====================================================

const mongoURI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.MONGODB_URI;


if (!mongoURI) {
  console.error(
    "================================================="
  );

  console.error(
    "MongoDB connection string is missing."
  );

  console.error(
    "Please check your .env file."
  );

  console.error(
    "Expected: MONGO_URI=mongodb://..."
  );

  console.error(
    "================================================="
  );

  process.exit(1);
}


// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      mongoURI
    );

    console.log(
      "MongoDB connected successfully."
    );

    console.log(
      "Database:",
      mongoose.connection.name
    );

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          "================================================="
        );

        console.log(
          `Backend running on http://localhost:${PORT}`
        );

        console.log(
          `Products API: http://localhost:${PORT}/api/products`
        );

        console.log(
          `Auth API: http://localhost:${PORT}/api/auth`
        );

        console.log(
          "Allowed frontend origins:"
        );

        allowedOrigins.forEach(
          (origin) => {
            console.log(
              `  - ${origin}`
            );
          }
        );

        console.log(
          "================================================="
        );
      }
    );
  } catch (error) {
    console.error(
      "================================================="
    );

    console.error(
      "MongoDB connection failed:"
    );

    console.error(
      error.message
    );

    console.error(
      "================================================="
    );

    process.exit(1);
  }
}


startServer();