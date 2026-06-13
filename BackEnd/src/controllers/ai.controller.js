const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body.code;

    if (!code) {
      return res.status(400).json({
        error: "Code is required",
      });
    }

    const response = await aiService(code);

    return res.status(200).json({
      review: response,
    });
  } catch (error) {
    console.error("AI Review Error:", error.message);

    return res.status(500).json({
      error: "Something went wrong while reviewing code.",
    });
  }
};