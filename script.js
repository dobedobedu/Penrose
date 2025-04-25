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
  
  // Mobile detection
  const isMobile = window.innerWidth <= 768;
  
  // Update the total steps display
  totalStepsElem.textContent = totalSteps.toString().padStart(2, '0');
  
  // Track which section is currently active
  let activeSection = 1;
  let isScrolling = false;
  let scrollTimeout = null;
  
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
    glowingBall.style.transition = 'left 0.6s ease-out, top 0.6s ease-out';
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
      glowingBall.style.transition = 'left 0.6s ease-out, top 0.6s ease-out';
      updateActiveSection(1);
    }, 50);
  }, 100);
  
  // Function to get the most visible section
  function getMostVisibleSection() {
    let maxVisibility = 0;
    let mostVisibleIndex = activeSection;
    
    stepSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      // Calculate visibility as a percentage of the section's height
      const visibility = visibleHeight / rect.height;
      
      // Update most visible section if this one is more visible
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleIndex = index + 1;
      }
    });
    
    return mostVisibleIndex;
  }
  
  // Improved scroll handler with debouncing
  stepsContainer.addEventListener('scroll', () => {
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Set a new timeout
    scrollTimeout = setTimeout(() => {
      if (isScrolling) return;
      
      // Get most visible section
      const mostVisibleSection = getMostVisibleSection();
      
      // Update active section if different
      if (mostVisibleSection !== activeSection) {
        updateActiveSection(mostVisibleSection);
      }
    }, isMobile ? 50 : 100); // Shorter timeout for mobile
  }, { passive: true });
  
  // Enhanced touch handling for mobile
  let touchStartY = 0;
  let touchEndY = 0;
  
  // Detect touch start
  stepsContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  // Handle touch end
  stepsContainer.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    
    // Check if we should detect this as a swipe
    const touchDistance = touchStartY - touchEndY;
    
    // Only use swipe detection for long swipes
    if (Math.abs(touchDistance) > 50) {
      const direction = touchDistance > 0 ? 1 : -1;
      
      // On mobile, immediately update the visible section after a swipe
      setTimeout(() => {
        const mostVisibleSection = getMostVisibleSection();
        updateActiveSection(mostVisibleSection);
      }, 100);
    }
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
  
  // Handle window resize events
  window.addEventListener('resize', () => {
    // Update mobile detection
    const wasJustMobile = isMobile;
    const isNowMobile = window.innerWidth <= 768;
    
    // Immediately update the ball position without animation
    glowingBall.style.transition = 'none';
    moveGlowingBall(activeSection);
    
    // Force reflow
    penroseContainer.offsetWidth;
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      glowingBall.style.transition = 'left 0.6s ease-out, top 0.6s ease-out';
    }, 50);
  });
  
  // Add IntersectionObserver for better section detection on mobile
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      // Don't react during programmatic scrolling
      if (isScrolling) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const section = entry.target;
          const sectionIndex = parseInt(section.dataset.step);
          
          if (sectionIndex !== activeSection) {
            updateActiveSection(sectionIndex);
          }
        }
      });
    }, {
      root: stepsContainer,
      threshold: 0.5 // Trigger when section is 50% visible
    });
    
    // Observe all step sections
    stepSections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
  
  // Keyboard navigation
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
      const targetElement = document.querySelector(`.step-section[data-step="${targetSection}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 600);
    }
  });
});