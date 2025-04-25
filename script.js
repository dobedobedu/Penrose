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
  
  // Enhanced mobile detection with improved iOS detection
  let isMobile = window.innerWidth <= 768;
  let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || /MacIntel/.test(navigator.platform) && navigator.maxTouchPoints > 1;
  
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
  
  // Function to move the glowing ball to a step marker with verification
  function moveGlowingBall(index) {
    // Ensure index is valid
    if (index < 1 || index > totalSteps) {
      console.warn(`Invalid step index: ${index}`);
      return;
    }
    
    const marker = stepMarkers[index - 1];
    if (!marker) {
      console.warn(`Step marker not found for index: ${index}`);
      return;
    }
    
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
      const sectionStep = parseInt(section.dataset.step, 10);
      if (sectionStep === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }
  
  // Function to ensure all step content is visible for mobile
  function forceContentVisibility() {
    // Only needed on mobile
    if (!isMobile) return;
    
    // Make all sections visible
    stepSections.forEach(section => {
      section.style.display = "block";
      section.style.visibility = "visible";
      section.style.opacity = "1";
      
      // Make the content inside visible too
      const content = section.querySelector('.step-content');
      if (content) {
        content.style.display = "block";
        content.style.visibility = "visible";
        content.style.opacity = "1";
        content.style.transform = "none";
      }
    });
  }
  
  // Function to scroll to a specific section with improved behavior for iOS
  function scrollToSection(index) {
    if (isScrolling || index < 1 || index > totalSteps) return;
    
    isScrolling = true;
    updateActiveSection(index);
    
    // Force all content to be visible on mobile
    if (isMobile) {
      forceContentVisibility();
    }
    
    const targetSection = document.querySelector(`.step-section[data-step="${index}"]`);
    if (targetSection) {
      if (isIOS) {
        // iOS-specific scroll handling with easier scrolling
        targetSection.scrollIntoView({
          behavior: 'auto', // Use 'auto' instead of 'smooth' for more reliable iOS behavior
          block: 'start'
        });
        
        // Force a reflow to ensure the scroll completes
        stepsContainer.offsetHeight;
        
        // Set a flag to prevent other scrolling during this operation
        setTimeout(() => {
          isScrolling = false;
        }, 200); // Shorter timeout for iOS for better responsiveness
      } else if (isMobile) {
        // For non-iOS mobile devices - optimized approach with easier scrolling
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        setTimeout(() => {
          isScrolling = false;
        }, 600);
      } else {
        // Desktop behavior
        const offset = targetSection.offsetTop;
        stepsContainer.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          isScrolling = false;
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
    
    // On mobile, force content visibility after section change
    if (isMobile) {
      forceContentVisibility();
    }
    
    // Update navigation arrows state - only for desktop
    if (!isMobile) {
      updateNavigationArrows();
    }
  }

  // Function to update navigation arrows visibility
  function updateNavigationArrows() {
    if (!navUp || !navDown) return;
    
    navUp.classList.toggle('disabled', activeSection === 1);
    navDown.classList.toggle('disabled', activeSection === totalSteps);
  }

  // Function to get the most visible section with improved calculation for mobile
  function getMostVisibleSection() {
    let maxVisibility = 0;
    let mostVisibleIndex = activeSection;
    
    // Get the viewport height and scroll position for better calculations
    const viewportHeight = window.innerHeight;
    const scrollTop = stepsContainer.scrollTop;
    
    stepSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionStep = parseInt(section.dataset.step, 10);
      
      // Calculate visibility with viewport adjustment for mobile
      let visibleTop = Math.max(0, rect.top);
      let visibleBottom = Math.min(viewportHeight, rect.bottom);
      
      // On mobile, adjust calculations to account for the sticky header
      if (isMobile) {
        // For mobile, require less visibility to consider a section active
        const headerHeight = isMobile ? viewportHeight * 0.2 : 0; // Reduced threshold for easier scrolling
        visibleTop = Math.max(headerHeight, rect.top);
        
        // Special case for step 1 on iOS for immediate visibility on load
        if (sectionStep === 1 && isIOS && scrollTop < 50) {
          return mostVisibleIndex = 1;
        }
      }
      
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibility = visibleHeight / rect.height;
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleIndex = sectionStep; // Use the actual step number from dataset
      }
    });
    
    return mostVisibleIndex;
  }
  
  // Initialize the page
  setTimeout(() => {
    // Initial setup
    glowingBall.style.transition = 'none';
    moveGlowingBall(1);
    
    // Special handling for mobile
    if (isMobile) {
      // Force all content to be immediately visible
      forceContentVisibility();
      
      // Add special styling to fix the layout for mobile
      document.body.classList.add('mobile-view');
      
      // Reduce the height of the Penrose container to show more content
      const penroseContainerElement = document.querySelector('.penrose-container');
      if (penroseContainerElement) {
        penroseContainerElement.style.height = isIOS ? '20vh' : '25vh';
        penroseContainerElement.style.minHeight = isIOS ? '150px' : '180px';
      }
    }
    
    penroseContainer.offsetWidth; // Force reflow
    
    // Re-enable transitions
    setTimeout(() => {
      glowingBall.style.transition = isMobile ? 'left 0.4s ease-out, top 0.4s ease-out' : 'left 0.6s ease-out, top 0.6s ease-out';
      updateActiveSection(1);
      
      // Force step 1 to be visible on page load for mobile
      if (isMobile) {
        // Reset scroll position first
        stepsContainer.scrollTop = 0;
        
        // Ensure first step is visible
        const firstSection = document.querySelector('.step-section[data-step="1"]');
        if (firstSection) {
          setTimeout(() => {
            firstSection.scrollIntoView({
              block: 'start',
              behavior: 'auto'
            });
            
            // Force visibility again after scrolling
            forceContentVisibility();
          }, 100);
        }
      }
    }, 50);
  }, 100);
  
  // Event Listeners
  
  // Navigation arrows click handlers - Desktop only
  if (navUp && navDown && !isMobile) {
    navUp.addEventListener('click', () => {
      if (activeSection > 1) {
        scrollToSection(activeSection - 1);
      }
    });
    
    navDown.addEventListener('click', () => {
      if (activeSection < totalSteps) {
        scrollToSection(activeSection + 1);
      }
    });
  }

  // Improved scroll handler with debouncing
  stepsContainer.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Make sure content is visible while scrolling on mobile
    if (isMobile) {
      forceContentVisibility();
    }
    
    // Set a new timeout - FASTER on mobile
    scrollTimeout = setTimeout(() => {
      if (isScrolling) return;
      
      const mostVisibleSection = getMostVisibleSection();
      
      if (mostVisibleSection !== activeSection) {
        updateActiveSection(mostVisibleSection);
      }
    }, isMobile ? 30 : 100); // Reduced timeout for more responsive mobile experience
  }, { passive: true });
  
  // Enhanced touch handling for mobile with reduced sensitivity for easier scrolling
  let touchStartY = 0;
  let touchEndY = 0;
  let lastSwipeTime = 0;
  
  // Only add touch handlers on mobile
  if (isMobile) {
    stepsContainer.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      
      // Ensure content visibility on any touch
      forceContentVisibility();
    }, { passive: true });
    
    stepsContainer.addEventListener('touchend', (e) => {
      if (isScrolling) return; // Prevent handling during animation
      
      touchEndY = e.changedTouches[0].clientY;
      
      // Calculate swipe distance and direction
      const touchDistance = touchStartY - touchEndY;
      const now = new Date().getTime();
      
      // Only process swipes that are significant enough but with lower threshold for easier navigation
      if (Math.abs(touchDistance) > 50) { // Increased threshold to make it less sensitive
        const direction = touchDistance > 0 ? 1 : -1; // 1 = up, -1 = down
        
        // Only navigate if sufficient time has passed since last swipe to prevent accidental triggers
        if (now - lastSwipeTime > 400) { // Increased delay between swipes
          lastSwipeTime = now;
          
          // If swiping up, go to next step; if swiping down, go to previous step
          if (direction === 1 && activeSection < totalSteps) {
            scrollToSection(activeSection + 1);
          } else if (direction === -1 && activeSection > 1) {
            scrollToSection(activeSection - 1);
          }
        }
      }
      
      // Update the visible section after a swipe
      setTimeout(() => {
        // Force visibility again after touch
        forceContentVisibility();
        
        const mostVisibleSection = getMostVisibleSection();
        updateActiveSection(mostVisibleSection);
      }, 100);
    }, { passive: true });
    
    // Add touch move handler to keep content visible while dragging
    stepsContainer.addEventListener('touchmove', () => {
      forceContentVisibility();
    }, { passive: true });
  }
  
  // Reset to first step when clicking total steps
  totalStepsElem.addEventListener('click', () => {
    scrollToSection(1);
  });
  
  // Allow clicking current step to navigate
  currentStepElem.addEventListener('click', () => {
    if (isMobile) {
      // On mobile, clicking the step indicator moves to the next step
      if (activeSection < totalSteps) {
        scrollToSection(activeSection + 1);
      } else {
        // If at the last step, go back to step 1
        scrollToSection(1);
      }
    } else {
      // On desktop, clicking step indicator moves to previous step
      if (activeSection > 1) {
        scrollToSection(activeSection - 1);
      }
    }
  });
  
  // Handle window resize with improved iOS detection
  window.addEventListener('resize', () => {
    const wasMobile = isMobile;
    
    // Update device detection
    isMobile = window.innerWidth <= 768;
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || /MacIntel/.test(navigator.platform) && navigator.maxTouchPoints > 1;
    
    // Toggle mobile class
    document.body.classList.toggle('mobile-view', isMobile);
    
    // Adjust the Penrose container if on mobile
    if (isMobile) {
      const penroseContainerElement = document.querySelector('.penrose-container');
      if (penroseContainerElement) {
        penroseContainerElement.style.height = isIOS ? '20vh' : '25vh';
        penroseContainerElement.style.minHeight = isIOS ? '150px' : '180px';
      }
      
      // Force content visibility if switching to mobile
      if (!wasMobile) {
        forceContentVisibility();
      }
    }
    
    // Update the glowing ball position
    glowingBall.style.transition = 'none';
    moveGlowingBall(activeSection);
    
    penroseContainer.offsetWidth;
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
      const transitionSpeed = isMobile ? '0.4s' : '0.6s';
      glowingBall.style.transition = `left ${transitionSpeed} ease-out, top ${transitionSpeed} ease-out`;
    }, 50);
  });
  
  // Keyboard navigation for desktop only
  if (!isMobile) {
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
  }

  // Add IntersectionObserver for better section detection with less strict thresholds
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      if (isScrolling) return;
      
      entries.forEach(entry => {
        // Use lower threshold values for easier scrolling detection
        const threshold = isMobile ? 0.15 : 0.3;
        
        if (entry.isIntersecting && entry.intersectionRatio > threshold) {
          const section = entry.target;
          const sectionIndex = parseInt(section.dataset.step, 10);
          
          if (sectionIndex !== activeSection) {
            updateActiveSection(sectionIndex);
          }
        }
      });
    }, {
      root: stepsContainer,
      threshold: isMobile ? [0.1, 0.15, 0.2] : [0.3, 0.5, 0.7] // Lower thresholds for mobile for easier detection
    });
    
    stepSections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
  
  // Fix for iOS scroll issue - ensure content is visible
  if (isIOS) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Force all content to be immediately visible
        forceContentVisibility();
        
        // Force step 1 to be visible on iOS
        const firstSection = document.querySelector('.step-section[data-step="1"]');
        if (firstSection) {
          // Reset scroll position
          stepsContainer.scrollTop = 0;
          
          // After a short delay, scroll to first section
          setTimeout(() => {
            firstSection.scrollIntoView({
              block: 'start',
              behavior: 'auto'
            });
          }, 50);
        }
      }, 300);
    });
  }
});