const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file on the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Endpoint to handle OpenAI API requests
app.post("/api/generate", async (req, res) => {
  const { idea, prompts } = req.body;

  try {
    // Send a request for each prompt to the OpenAI API
    const responses = await Promise.all(
      prompts.map(async (prompt) => {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo", // Use appropriate model version
            messages: [{ role: "user", content: `${prompt}: ${idea}` }],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        );
        return response.data.choices[0].message.content;
      })
    );

    res.json({ responses });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Error generating response" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
