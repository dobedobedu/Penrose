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
  let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Update the total steps display
  totalStepsElem.textContent = totalSteps.toString().padStart(2, '0');
  
  // Track which section is currently active
  let activeSection = 1;
  let isScrolling = false;
  let scrollTimeout = null;
  let userInitiatedScroll = false;
  let lastScrollTime = 0;
  
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
    
    // Position the ball at the marker with a faster transition for mobile
    const transitionSpeed = isMobile ? '0.4s' : '0.6s';
    glowingBall.style.transition = `left ${transitionSpeed} ease-out, top ${transitionSpeed} ease-out`;
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
  
  // Function to scroll to a specific section with improved behavior for iOS
  function scrollToSection(index) {
    // Prevent scrolling if already in progress or invalid index
    if (isScrolling || index < 1 || index > totalSteps) return;
    
    isScrolling = true;
    userInitiatedScroll = true;
    lastScrollTime = new Date().getTime();
    
    console.log(`Scrolling to section ${index}`);
    
    updateActiveSection(index);
    
    const targetSection = document.querySelector(`.step-section[data-step="${index}"]`);
    if (targetSection) {
      if (isIOS) {
        // iOS-specific scroll handling
        const offset = targetSection.offsetTop;
        stepsContainer.scrollTo({
          top: offset,
          behavior: 'auto' // Use 'auto' instead of 'smooth' for iOS
        });
        
        setTimeout(() => {
          isScrolling = false;
          userInitiatedScroll = false;
        }, 500); // Longer timeout for iOS
      } else if (isMobile) {
        // For non-iOS mobile devices - use direct scrollTo for most reliable behavior
        const offset = targetSection.offsetTop;
        stepsContainer.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        
        // Use a longer timeout to ensure scroll completes
        setTimeout(() => {
          isScrolling = false;
          userInitiatedScroll = false;
        }, 1000);
      } else {
        // Desktop behavior
        const offset = targetSection.offsetTop;
        stepsContainer.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          isScrolling = false;
          userInitiatedScroll = false;
        }, 600);
      }
    }
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
    
    // Re-enable transitions
    setTimeout(() => {
      glowingBall.style.transition = isMobile ? 'left 0.4s ease-out, top 0.4s ease-out' : 'left 0.6s ease-out, top 0.6s ease-out';
      updateActiveSection(1);
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
    // Skip scroll handling if it was initiated by our code
    if (userInitiatedScroll) return;
    
    // Clear any existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Only update active section if not currently animating
    const now = new Date().getTime();
    if (now - lastScrollTime < 500) return; // Skip if scrolled recently
    
    // Set a new timeout
    scrollTimeout = setTimeout(() => {
      if (isScrolling) return;
      
      const mostVisibleSection = getMostVisibleSection();
      
      if (mostVisibleSection !== activeSection) {
        // Update the UI without triggering another scroll
        moveGlowingBall(mostVisibleSection);
        activeSection = mostVisibleSection;
        updateNavigationArrows();
      }
    }, isMobile ? 100 : 100);
  }, { passive: true });
  
  // Enhanced touch handling for mobile - HEAVILY MODIFIED FOR PRECISE CONTROL
  let touchStartY = 0;
  let touchEndY = 0;
  let lastSwipeTime = 0;
  let isSwiping = false;
  let swipeDirection = 0;
  
  stepsContainer.addEventListener('touchstart', (e) => {
    // Stop if already in a scroll animation
    if (isScrolling) return;
    
    touchStartY = e.touches[0].clientY;
    isSwiping = false;
  }, { passive: true });
  
  stepsContainer.addEventListener('touchmove', (e) => {
    // Don't process during scroll animations
    if (isScrolling) return;
    
    const currentY = e.touches[0].clientY;
    const diffY = touchStartY - currentY;
    
    // Only consider as a swipe if moved more than threshold
    if (Math.abs(diffY) > 30) {
      isSwiping = true;
      swipeDirection = diffY > 0 ? 1 : -1; // 1 = up, -1 = down
    }
  }, { passive: true });
  
  stepsContainer.addEventListener('touchend', (e) => {
    // Skip if already scrolling or no swipe detected
    if (isScrolling || !isSwiping) return;
    
    const now = new Date().getTime();
    
    // Cooldown to prevent multiple rapid swipes
    if (now - lastSwipeTime < 500) return;
    
    lastSwipeTime = now;
    
    // Process the swipe - move exactly one step
    if (swipeDirection === 1 && activeSection < totalSteps) {
      scrollToSection(activeSection + 1);
    } else if (swipeDirection === -1 && activeSection > 1) {
      scrollToSection(activeSection - 1);
    }
    
    // Reset swipe state
    isSwiping = false;
    swipeDirection = 0;
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
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      const transitionSpeed = isMobile ? '0.4s' : '0.6s';
      glowingBall.style.transition = `left ${transitionSpeed} ease-out, top ${transitionSpeed} ease-out`;
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

  // Reset scrolling flag after animation completes
  window.addEventListener('scrollend', () => {
    setTimeout(() => {
      isScrolling = false;
      userInitiatedScroll = false;
    }, isMobile ? 400 : 600);
  });
});