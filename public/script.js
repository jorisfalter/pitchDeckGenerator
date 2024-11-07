async function submitIdea() {
  const idea = document.getElementById("idea-input").value;

  if (!idea) {
    alert("Please enter an idea");
    return;
  }

  // Define different prompts for each slide
  const prompts = [
    "Describe the primary audience for this idea",
    "Explain the core functionality of the idea",
    "Outline the unique selling points",
    "Suggest a go-to-market strategy",
    "Identify potential competitors",
  ];

  try {
    // Send the idea and prompts to the backend
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, prompts }),
    });

    const data = await response.json();

    // Clear any previous slides
    const slidesContainer = document.getElementById("slides");
    slidesContainer.innerHTML = "";

    // Display each response in a new slide
    data.responses.forEach((reply, index) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      slide.innerHTML = `<p>Slide ${index + 1}: ${
        prompts[index]
      }</p><p>${reply}</p>`;
      slidesContainer.appendChild(slide);
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    alert("An error occurred. Please try again.");
  }
}
