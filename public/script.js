async function submitIdea() {
  const idea = document.getElementById("idea-input").value;
  const goButton = document.getElementById("go-button");
  const loadingDots = document.getElementById("loading-dots");
  const dots = document.querySelectorAll(".dot"); // Select each dot

  if (!idea) {
    alert("Please enter an idea");
    return;
  }

  // Show loading dots and hide the "Go" button
  goButton.style.display = "none";
  loadingDots.style.display = "flex";

  // Define different prompts for each slide
  const prompts = [
    "Explain The Problem for this idea, make it convincing, try to pinpoint specific numbers to strengthen the case",
    "Explain The Solution for this idea in 15 words or less. Add an unfair advantage this solution has",
    "Define the Value Prop for this idea for the customer or user. What differentiates this solution from any other solution?",
    "Come up with the best business model for this idea",
    "Estimate numbers for TAM, SAM and SOM for this idea, and the assumptions made",
    "Identify 3 to 5 competitors for this idea, and why they are less well positioned to execute than we are",
    "Identify the strongest go to market strategy for this idea",
    "Define Criteria the team should highlight for this idea",
    "Define Relevant Traction and Validation parameters for this idea",
  ];

  const slide_titles = [
    "Problem Statement",
    "Proposed Solution",
    "Value Proposition",
    "Business Model",
    "Market Opportunity & Growth",
    "Competition",
    "Go-To-Market",
    "Team",
    "Traction and Validation",
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
      console.log(reply);
      const slide = document.createElement("div");
      slide.classList.add("slide");

      slide.innerHTML = `<p>Slide ${index + 1}: ${
        slide_titles[index]
        // }</p><pre>${reply}</pre>`;
      }</p>${reply}`;

      slidesContainer.appendChild(slide);
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    alert("An error occurred. Please try again.");
  } finally {
    // Stop the dots animation by setting animation to 'none'
    dots.forEach((dot) => (dot.style.animation = "none"));
    loadingDots.style.display = "none"; // Hide loading dots
    goButton.style.display = "block"; // Show the "Go" button again
  }
}
