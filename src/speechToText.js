const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

async function transcribeWithSarvam(filePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "https://api.sarvam.ai/speech-to-text", // replace with actual endpoint
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.SARVAM_API_KEY,
        },
      }
    );

    return response.data.text; // transcript text
  } catch (err) {
    console.error("Sarvam transcription failed:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = transcribeWithSarvam;
