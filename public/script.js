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
    "Describe the primary audience for this idea",
    "Explain the core functionality of the idea",
    "Outline the unique selling points",
    "Suggest a go-to-market strategy",
    "Identify potential competitors",
  ];

  const slide_titles = ["", "", "", "", "", "", "", "", ""];

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
