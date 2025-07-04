import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 8080;

console.log("👋 Server starting...");

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server", error);
    process.exit(1);
  }
})();
