document.addEventListener("DOMContentLoaded", () => {
  // Get all elements we need to work with
  const stepSections = document.querySelectorAll('.step-section');
  const stepMarkers = document.querySelectorAll('.step-marker');
  const stepsContainer = document.querySelector('.steps-container');
  const currentStepElem = document.getElementById('current-step');
  const totalStepsElem = document.getElementById('total-steps');
  const totalSteps = stepSections.length;
  const glowingBall = document.querySelector('.glowing-ball');
  const penroseContainer = document.querySelector('.penrose-image-container');
  
  // Update the total steps display
  totalStepsElem.textContent = totalSteps.toString().padStart(2, '0');
  
  // Track which section is currently active
  let activeSection = 1;
  let isScrolling = false;
  
  // Define each step's title for debugging and reference
  const stepTitles = [
    "Get Inspired and Disciplined",
    "Problem Exploring",
    "Problem Framing",
    "User Research",
    "Ideation",
    "Prototyping",
    "Testing",
    "Prototyping (Iterate)",
    "MVP",
    "Business Model Development",
    "Go to Market",
    "Growth Strategy",
    "Demo Day",
    "Feedback Collection, Reflect and Connect the Dots"
  ];
  
  // Function to move the glowing ball to a step marker
  function moveGlowingBall(index) {
    const marker = stepMarkers[index - 1];
    if (!marker) return; // Exit if marker doesn't exist
    
    // Get position from the marker's style (more precise)
    const left = parseFloat(marker.style.left) || 0;
    const top = parseFloat(marker.style.top) || 0;
    
    // Position the ball at the marker with a gentle transition
    glowingBall.style.transition = 'left 1s ease-in-out, top 1s ease-in-out';
    glowingBall.style.left = `${left}px`;
    glowingBall.style.top = `${top}px`;
    
    // Update step indicator
    currentStepElem.textContent = index.toString().padStart(2, '0');
    
    // Log for debugging
    console.log(`Moving to step ${index}: ${stepTitles[index-1]}`);
  }
  
  // Function to update UI based on current active section
  function updateActiveSection(index) {
    // Don't update if it's the same section
    if (index === activeSection) return;
    
    // Ensure index is within bounds
    if (index < 1 || index > totalSteps) return;
    
    // Move the glowing ball immediately
    moveGlowingBall(index);
    
    // Update active section tracker
    activeSection = index;
  }

  // Initialize by setting the first section as active
  // Short timeout to ensure everything is loaded
  setTimeout(() => {
    // Initial ball positioning without transition
    glowingBall.style.transition = 'none';
    moveGlowingBall(1);
    
    // Force reflow
    penroseContainer.offsetWidth;
    
    // Re-enable transitions
    setTimeout(() => {
      glowingBall.style.transition = 'left 1s ease-in-out, top 1s ease-in-out';
      updateActiveSection(1);
    }, 50);
  }, 100);
  
  // Smoother scroll handling for mobile
  let lastScrollTime = 0;
  const scrollThrottle = 300; // ms between scroll detections
  
  // Handle scroll events on the steps container to detect current section
  stepsContainer.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < scrollThrottle) return;
    lastScrollTime = now;
    
    if (isScrolling) return;
    
    const scrollPosition = stepsContainer.scrollTop;
    const sectionHeight = window.innerHeight;
    
    // Calculate which section is currently in view
    const viewportMiddle = scrollPosition + sectionHeight / 2;
    const sectionIndex = Math.floor(viewportMiddle / sectionHeight) + 1;
    
    if (sectionIndex !== activeSection && sectionIndex > 0 && sectionIndex <= totalSteps) {
      updateActiveSection(sectionIndex);
    }
  }, { passive: true }); // Using passive for better performance
  
  // Add wheel event listener with smoother scrolling
  stepsContainer.addEventListener('wheel', (e) => {
    // Only control scroll on desktop
    if (window.innerWidth > 768) {
      e.preventDefault();
      
      if (isScrolling) return;
      
      isScrolling = true;
      
      // Determine scroll direction
      const direction = e.deltaY > 0 ? 1 : -1;
      let targetSection = activeSection + direction;
      
      // Ensure target section is within bounds
      targetSection = Math.max(1, Math.min(targetSection, totalSteps));
      
      // Smooth scroll to target section
      stepsContainer.scrollTo({
        top: (targetSection - 1) * window.innerHeight,
        behavior: 'smooth'
      });
      
      // Update active section immediately
      updateActiveSection(targetSection);
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  }, { passive: false });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    let targetSection = activeSection;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      targetSection = Math.min(activeSection + 1, totalSteps);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      targetSection = Math.max(activeSection - 1, 1);
    } else if (e.key === 'Home') {
      targetSection = 1;
    } else if (e.key === 'End') {
      targetSection = totalSteps;
    } else {
      return; // Not a navigation key, do nothing
    }
    
    if (targetSection !== activeSection) {
      isScrolling = true;
      
      // Update active section immediately for smoother experience
      updateActiveSection(targetSection);
      
      // Then scroll to section
      stepsContainer.scrollTo({
        top: (targetSection - 1) * window.innerHeight,
        behavior: 'smooth'
      });
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  });
  
  // Improved touch handling for mobile
  let touchStartY = 0;
  let touchStartTime = 0;
  let touchEndTime = 0;
  let touchDistance = 0;
  
  // Detect touch start
  stepsContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });
  
  // Handle touch move
  stepsContainer.addEventListener('touchmove', (e) => {
    // We don't prevent default here to allow native scrolling
    touchDistance = touchStartY - e.touches[0].clientY;
  }, { passive: true });
  
  // Handle touch end
  stepsContainer.addEventListener('touchend', (e) => {
    touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    
    // Only handle quick swipes (less than 300ms)
    if (touchDuration < 300 && Math.abs(touchDistance) > 30) {
      const direction = touchDistance > 0 ? 1 : -1;
      let targetSection = activeSection + direction;
      
      // Ensure target section is within bounds
      targetSection = Math.max(1, Math.min(targetSection, totalSteps));
      
      if (targetSection !== activeSection) {
        // Update ball position immediately
        updateActiveSection(targetSection);
      }
    }
    
    // Reset variables
    touchDistance = 0;
  }, { passive: true });
  
  // Add click handler for total-steps to reset to first step
  totalStepsElem.addEventListener('click', () => {
    // Update active section
    updateActiveSection(1);
    
    // Scroll to first section
    stepsContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Handle window resize events to ensure the ball stays properly positioned
  window.addEventListener('resize', () => {
    // Immediately update the ball position without animation
    glowingBall.style.transition = 'none';
    moveGlowingBall(activeSection);
    
    // Force reflow
    penroseContainer.offsetWidth;
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      glowingBall.style.transition = 'left 1s ease-in-out, top 1s ease-in-out';
    }, 50);
  });
  
  // Monitor scrolling and update ball position periodically on mobile
  if (window.innerWidth <= 768) {
    setInterval(() => {
      const scrollPosition = stepsContainer.scrollTop;
      const sectionHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / sectionHeight) + 1;
      
      if (sectionIndex !== activeSection && sectionIndex > 0 && sectionIndex <= totalSteps) {
        updateActiveSection(sectionIndex);
      }
    }, 500);
  }
  
  // Handle step section clicks for easier mobile navigation
  stepSections.forEach((section, index) => {
    section.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        updateActiveSection(index + 1);
      }
    });
  });
});