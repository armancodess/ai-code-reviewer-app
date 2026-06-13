require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

console.log("Loaded Groq Key:", process.env.GROQ_API_KEY?.slice(0, 10));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});