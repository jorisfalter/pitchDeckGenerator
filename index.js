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
    const responses = [];
    let conversationHistory = [
      { role: "user", content: idea }, // Start with the initial idea
    ];

    // Loop through each prompt sequentially
    for (const prompt of prompts) {
      // Send a request to the OpenAI API for the current prompt
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [...conversationHistory, { role: "user", content: prompt }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      // Extract the content from the API response
      const assistantResponse = response.data.choices[0].message.content;
      responses.push(assistantResponse); // Store the response
      console.log(responses);

      conversationHistory.push(
        { role: "user", content: prompt },
        { role: "assistant", content: assistantResponse }
      );
    }

    // Send the accumulated responses back to the client
    res.json({ responses });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
  console.log("finished defining responses");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
