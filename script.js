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
  const navUp = document.querySelector('.nav-up');
  const navDown = document.querySelector('.nav-down');
  
  // Mobile detection
  let isMobile = window.innerWidth <= 768;
  
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
    if (!marker) return;
    
    const left = parseFloat(marker.style.left) || 0;
    const top = parseFloat(marker.style.top) || 0;
    
    glowingBall.style.transition = 'left 0.6s ease-out, top 0.6s ease-out';
    glowingBall.style.left = `${left}px`;
    glowingBall.style.top = `${top}px`;
    
    // Update step indicator
    currentStepElem.textContent = index.toString().padStart(2, '0');
    
    // Add active class to current section and remove from others
    stepSections.forEach((section, i) => {
      if (i + 1 === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }
  
  // Function to scroll to a specific section with improved behavior
  function scrollToSection(index) {
    if (isScrolling || index < 1 || index > totalSteps) return;
    
    isScrolling = true;
    updateActiveSection(index);
    
    const targetSection = document.querySelector(`.step-section[data-step="${index}"]`);
    if (targetSection) {
      // On mobile, use scrollIntoView which works better with snap points
      if (isMobile) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // On desktop, use scrollTo which is more precise
        const offset = targetSection.offsetTop;
        stepsContainer.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }
    
    setTimeout(() => {
      isScrolling = false;
    }, 600);
  }
  
  // Function to update UI based on current active section
  function updateActiveSection(index) {
    if (index === activeSection) return;
    if (index < 1 || index > totalSteps) return;
    
    moveGlowingBall(index);
    activeSection = index;
    
    // Update navigation arrows state
    updateNavigationArrows();
  }

  // Function to update navigation arrows visibility
  function updateNavigationArrows() {
    if (isMobile || !navUp || !navDown) return;
    
    navUp.classList.toggle('disabled', activeSection === 1);
    navDown.classList.toggle('disabled', activeSection === totalSteps);
  }

  // Function to get the most visible section
  function getMostVisibleSection() {
    let maxVisibility = 0;
    let mostVisibleIndex = activeSection;
    
    stepSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      
      const visibility = visibleHeight / rect.height;
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleIndex = index + 1;
      }
    });
    
    return mostVisibleIndex;
  }
  
  // Initialize
  setTimeout(() => {
    glowingBall.style.transition = 'none';
    moveGlowingBall(1);
    
    penroseContainer.offsetWidth; // Force reflow
    
    setTimeout(() => {
      glowingBall.style.transition = 'left 0.6s ease-out, top 0.6s ease-out';
      updateActiveSection(1);
      updateNavigationArrows();
    }, 50);
  }, 100);
  
  // Event Listeners
  
  // Navigation arrows click handlers
  navUp?.addEventListener('click', () => {
    if (activeSection > 1) {
      scrollToSection(activeSection - 1);
    }
  });
  
  navDown?.addEventListener('click', () => {
    if (activeSection < totalSteps) {
      scrollToSection(activeSection + 1);
    }
  });

  // Improved scroll handler with debouncing
  stepsContainer.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
      if (isScrolling) return;
      
      const mostVisibleSection = getMostVisibleSection();
      
      if (mostVisibleSection !== activeSection) {
        updateActiveSection(mostVisibleSection);
      }
    }, isMobile ? 50 : 100);
  }, { passive: true });
  
  // Enhanced touch handling for mobile
  let touchStartY = 0;
  let touchEndY = 0;
  let lastSwipeTime = 0;
  
  stepsContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  stepsContainer.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].clientY;
    
    // Calculate swipe distance and direction
    const touchDistance = touchStartY - touchEndY;
    const now = new Date().getTime();
    
    // Only process swipes that are significant enough
    if (Math.abs(touchDistance) > 30) { // Reduced threshold for easier detection
      const direction = touchDistance > 0 ? 1 : -1; // 1 = up, -1 = down
      
      // If swiping up, go to next step; if swiping down, go to previous step
      // This makes the navigation more intuitive and responsive
      if (direction === 1 && activeSection < totalSteps) {
        // Only if sufficient time has passed since last swipe (300ms)
        if (now - lastSwipeTime > 300) {
          lastSwipeTime = now;
          scrollToSection(activeSection + 1);
        }
      } else if (direction === -1 && activeSection > 1) {
        if (now - lastSwipeTime > 300) {
          lastSwipeTime = now;
          scrollToSection(activeSection - 1);
        }
      }
    }
  }, { passive: true });
  
  // Reset to first step when clicking total steps
  totalStepsElem.addEventListener('click', () => {
    scrollToSection(1);
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const wasJustMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    glowingBall.style.transition = 'none';
    moveGlowingBall(activeSection);
    
    penroseContainer.offsetWidth;
    
    setTimeout(() => {
      glowingBall.style.transition = 'left 0.6s ease-out, top 0.6s ease-out';
      updateNavigationArrows();
    }, 50);
  });
  
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
      return;
    }
    
    if (targetSection !== activeSection) {
      scrollToSection(targetSection);
    }
  });

  // Add IntersectionObserver for better section detection
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      if (isScrolling) return;
      
      entries.forEach(entry => {
        // Lower threshold for better reactivity
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const section = entry.target;
          const sectionIndex = parseInt(section.dataset.step);
          
          if (sectionIndex !== activeSection) {
            updateActiveSection(sectionIndex);
          }
        }
      });
    }, {
      root: stepsContainer,
      threshold: [0.3, 0.5, 0.7] // Multiple thresholds for better detection
    });
    
    stepSections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
});
