document.addEventListener("DOMContentLoaded", () => {
  // Get all milestones and steps
  const milestones = document.querySelectorAll(".milestone");
  const steps = document.querySelectorAll(".step");
  
  // Calculate total document height
  const docHeight = document.body.scrollHeight - window.innerHeight;
  
  // Listen for scroll events to trigger step highlighting
  window.addEventListener("scroll", () => {
    // Calculate current scroll position as percentage of total scrollable distance
    const scrollPosition = window.scrollY;
    const scrollPercentage = Math.min(scrollPosition / docHeight, 1);
    
    // Determine which milestone is currently in view
    let activeIndex = -1;
    
    milestones.forEach((milestone, index) => {
      const rect = milestone.getBoundingClientRect();
      
      // Check if the milestone is in the viewport
      if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
        milestone.classList.add("active");
        activeIndex = index;
      } else {
        milestone.classList.remove("active");
      }
    });
    
    // Highlight the corresponding step on the Penrose stairs
    if (activeIndex >= 0) {
      // First, remove active class from all steps
      steps.forEach(step => {
        step.classList.remove("active");
      });
      
      // Highlight the active step
      if (activeIndex < steps.length) {
        steps[activeIndex].classList.add("active");
      }
    }
  });
  
  // Trigger scroll event initially to set correct step on page load
  window.dispatchEvent(new Event('scroll'));
  
  // Add hover effects to the steps
  steps.forEach((step, index) => {
    step.addEventListener("mouseenter", () => {
      // Highlight step on hover
      step.style.fill = "#7cb342";
      
      // Scroll to the corresponding milestone when clicking on a step
      step.addEventListener("click", () => {
        milestones[index].scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    
    step.addEventListener("mouseleave", () => {
      // Restore original state on mouse leave if not active
      if (!step.classList.contains("active")) {
        step.style.fill = "";
      }
    });
  });
});