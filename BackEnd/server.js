require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT;

if (!PORT) {
  console.error("❌ PORT is not defined by environment");
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});