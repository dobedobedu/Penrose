document.addEventListener("DOMContentLoaded", () => {
  // Get all elements we need to work with
  const stepSections = document.querySelectorAll('.step-section');
  const penroseSteps = document.querySelectorAll('.step');
  const stepsContainer = document.querySelector('.steps-container');
  const currentStepElem = document.getElementById('current-step');
  const totalSteps = stepSections.length;
  const toggleBtn = document.getElementById('perspective-toggle');
  const body = document.body;
  
  // Update the total steps display
  document.getElementById('total-steps').textContent = totalSteps.toString().padStart(2, '0');
  
  // Track which section is currently active
  let activeSection = 1;
  
  // Toggle perspective view
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('alt-perspective');
      
      if (body.classList.contains('alt-perspective')) {
        toggleBtn.textContent = 'Original View';
      } else {
        toggleBtn.textContent = 'Toggle Perspective';
      }
    });
  }
  
  // Function to update UI based on current active section
  function updateActiveSection(index) {
    // Don't update if it's the same section
    if (index === activeSection) return;
    
    // Remove active class from all sections and steps
    stepSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to current section and corresponding step
    stepSections[index - 1].classList.add('active');
    
    // Update Penrose stairs visualization - progressive activation
    penroseSteps.forEach((step, stepIndex) => {
      if (stepIndex < index) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Update step indicator
    currentStepElem.textContent = index.toString().padStart(2, '0');
    
    // Update active section tracker
    activeSection = index;
  }

  // Initialize by setting the first section as active
  updateActiveSection(1);
  stepSections[0].classList.add('active');
  penroseSteps[0].classList.add('active');
  
  // Handle scroll events on the steps container to detect current section
  let isScrolling = false;
  stepsContainer.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    const scrollPosition = stepsContainer.scrollTop;
    const sectionHeight = window.innerHeight;
    
    // Calculate which section is currently in view
    const currentSection = Math.floor(scrollPosition / sectionHeight) + 1;
    
    if (currentSection !== activeSection && currentSection > 0 && currentSection <= totalSteps) {
      updateActiveSection(currentSection);
    }
  });
  
  // Add click events to Penrose steps to navigate to corresponding section
  penroseSteps.forEach((step, index) => {
    step.addEventListener('click', () => {
      const targetSection = index + 1;
      
      // Smooth scroll to the selected section
      isScrolling = true;
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
    });
  });
  
  // Add wheel event listener to implement custom smooth scrolling with snapping
  stepsContainer.addEventListener('wheel', (e) => {
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
  
  // Make sure the first section content is visible
  setTimeout(() => {
    stepSections[0].querySelector('.step-content').style.opacity = 1;
    stepSections[0].querySelector('.step-content').style.transform = 'translateY(0)';
  }, 300);
});