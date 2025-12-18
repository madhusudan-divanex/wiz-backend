const { fileURLToPath } = require("url");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const multer = require("multer");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ use this ONE server for both
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Routes =====
const cron = require("./utils/cronJob");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const userRoutes = require("./routes/user.routes");
const marketingRoutes = require("./routes/marketing.routes");
const businessLicenseRoutes = require("./routes/businessLicense.routes");
const featuresRoutes = require("./routes/features.routes");
const adminRoutes = require("./routes/admin.routes");
const providerRoutes = require("./routes/provider.routes");
const consumerRoutes = require("./routes/consumer.routes");
const cmsRoutes = require("./routes/frontend.routes");
const { deleteOrphanChats } = require("./controllers/user.controller");
const ScamReport = require("./models/ScamReport");
const { default: mongoose } = require("mongoose");

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/consumer", consumerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/businessLicense", businessLicenseRoutes);
app.use("/api/features", featuresRoutes);
app.use("/cms", cmsRoutes);
app.use("/", adminRoutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/texteditor/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });
app.post('/upload/image', upload.single('upload'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const imageUrl = `${process.env.API_URL}/uploads/texteditor/${req.file.filename}`;
  return res.status(201).json({
    uploaded: true,
    url: imageUrl,
  });
});

app.use((req, res, next) => {
  res.status(404).json({ status: false, message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: false, message: "Server Error" });
});
// ===== Socket.IO Logic =====
let onlineUsers = {}; 
io.on("connection", (socket) => {
  socket.on("userOnline", (userId) => {
    onlineUsers[userId] = socket.id; 
    io.emit("onlineStatus", { userId, status: "online" }); 
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.to).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        io.emit("onlineStatus", { userId, status: "offline" });  
        break;
      }
    }
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = { app, io };
