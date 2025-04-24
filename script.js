document.addEventListener("DOMContentLoaded", () => {
  const milestones = document.querySelectorAll(".milestone");

  // Listen for scroll events to trigger milestone highlighting
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;

    milestones.forEach((milestone, index) => {
      const milestoneTop = milestone.offsetTop;
      const milestoneHeight = milestone.offsetHeight;

      // Check if the milestone is in the viewport
      if (scrollPosition >= milestoneTop - 200 && scrollPosition < milestoneTop + milestoneHeight - 200) {
        milestone.classList.add("active");
      } else {
        milestone.classList.remove("active");
      }
    });
  });
});
