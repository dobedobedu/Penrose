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
  
  // Function to move the glowing ball to a step marker
  function moveGlowingBall(index) {
    const marker = stepMarkers[index - 1];
    if (!marker) return; // Exit if marker doesn't exist
    
    // Get position from the marker's style (more precise)
    const left = parseFloat(marker.style.left) || 0;
    const top = parseFloat(marker.style.top) || 0;
    
    // Make sure transition is enabled
    glowingBall.style.transition = 'left 0.8s ease, top 0.8s ease';
    
    // Position the ball at the marker with a smooth transition
    glowingBall.style.left = `${left}px`;
    glowingBall.style.top = `${top}px`;
  }
  
  // Function to update UI based on current active section
  function updateActiveSection(index) {
    // Don't update if it's the same section
    if (index === activeSection) return;
    
    // Ensure index is within bounds
    if (index < 1 || index > totalSteps) return;
    
    // Remove active and adjacent classes from all sections
    stepSections.forEach(section => {
      section.classList.remove('active', 'adjacent');
    });
    
    // Add active class to current section
    stepSections[index - 1].classList.add('active');
    
    // Add adjacent class to sections before and after
    if (index > 1) {
      stepSections[index - 2].classList.add('adjacent');
    }
    if (index < totalSteps) {
      stepSections[index].classList.add('adjacent');
    }
    
    // Move the glowing ball
    moveGlowingBall(index);
    
    // Update step indicator
    currentStepElem.textContent = index.toString().padStart(2, '0');
    
    // Update active section tracker
    activeSection = index;
    
    // Make sure the step content is visible
    const activeContent = stepSections[index - 1].querySelector('.step-content');
    activeContent.style.opacity = 1;
    activeContent.style.transform = 'translateY(0)';
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
      glowingBall.style.transition = 'left 0.8s ease, top 0.8s ease';
      updateActiveSection(1);
    }, 50);
  }, 100);
  
  // Handle scroll events on the steps container to detect current section
  stepsContainer.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    const scrollPosition = stepsContainer.scrollTop;
    const sectionHeight = window.innerHeight;
    
    // Calculate which section is currently in view
    const viewportMiddle = scrollPosition + sectionHeight / 2;
    const sectionIndex = Math.floor(viewportMiddle / sectionHeight) + 1;
    
    if (sectionIndex !== activeSection && sectionIndex > 0 && sectionIndex <= totalSteps) {
      updateActiveSection(sectionIndex);
    }
  });
  
  // Add wheel event listener to implement custom smooth scrolling
  stepsContainer.addEventListener('wheel', (e) => {
    // Prevent default to take control of scrolling
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
    
    // Update active section
    updateActiveSection(targetSection);
    
    // Reset scrolling flag after animation completes
    setTimeout(() => {
      isScrolling = false;
    }, 1000);
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
      
      // Smooth scroll to target section
      stepsContainer.scrollTo({
        top: (targetSection - 1) * window.innerHeight,
        behavior: 'smooth'
      });
      
      // Update active section
      updateActiveSection(targetSection);
      
      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  });
  
  // Add touch swipe handling for mobile devices
  let touchStartY = 0;
  
  stepsContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  stepsContainer.addEventListener('touchmove', (e) => {
    if (isScrolling) {
      e.preventDefault();
      return;
    }
    
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    // If significant swipe detected
    if (Math.abs(diff) > 50) {
      e.preventDefault();
      
      const direction = diff > 0 ? 1 : -1;
      let targetSection = activeSection + direction;
      
      // Ensure target section is within bounds
      targetSection = Math.max(1, Math.min(targetSection, totalSteps));
      
      if (targetSection !== activeSection) {
        isScrolling = true;
        
        // Smooth scroll to target section
        stepsContainer.scrollTo({
          top: (targetSection - 1) * window.innerHeight,
          behavior: 'smooth'
        });
        
        // Update active section
        updateActiveSection(targetSection);
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling = false;
        }, 1000);
        
        // Update touch start for continued swiping
        touchStartY = touchY;
      }
    }
  }, { passive: false });
  
  // Make sure all sections' content is properly initialized
  stepSections.forEach((section, index) => {
    const content = section.querySelector('.step-content');
    if (index === 0) {
      // First section is active initially
      content.style.opacity = 1;
      content.style.transform = 'translateY(0)';
    } else {
      content.style.opacity = 0;
      content.style.transform = 'translateY(20px)';
    }
  });
  
  // Add a click event to step markers to allow direct navigation (for development)
  document.querySelectorAll('.step-marker').forEach((marker, index) => {
    marker.addEventListener('click', () => {
      const targetSection = index + 1;
      
      // Scroll to that section
      stepsContainer.scrollTo({
        top: (targetSection - 1) * window.innerHeight,
        behavior: 'smooth'
      });
      
      // Update active section
      updateActiveSection(targetSection);
    });
  });
  
  // Add click handler for total-steps to reset to first step
  totalStepsElem.addEventListener('click', () => {
    // Scroll to first section
    stepsContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Update active section
    updateActiveSection(1);
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
      glowingBall.style.transition = 'left 0.8s ease, top 0.8s ease';
    }, 50);
  });
});