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
    if (isScrolling || index < 1 || index > totalSteps) return;
    
    isScrolling = true;
    updateActiveSection(index);
    
    const targetSection = document.querySelector(`.step-section[data-step="${index}"]`);
    if (targetSection) {
      if (isIOS) {
        // iOS-specific scroll handling with smoother behavior
        const offset = targetSection.offsetTop;
        
        // For iOS, use smooth scrolling with specific offset adjustment for better positioning
        // This helps ensure content is not hidden behind the stairs
        const scrollTopValue = offset - (window.innerHeight * 0.05);
        
        stepsContainer.scrollTo({
          top: scrollTopValue,
          behavior: 'smooth'
        });
        
        // Force a reflow to ensure the scroll completes
        stepsContainer.offsetHeight;
        
        // Set a flag to prevent other scrolling during this operation
        setTimeout(() => {
          isScrolling = false;
        }, 500); // Slightly longer timeout for iOS
      } else if (isMobile) {
        // For non-iOS mobile devices - optimized approach
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
    
    // Update navigation arrows state
    updateNavigationArrows();
  }

  // Function to update navigation arrows visibility
  function updateNavigationArrows() {
    if (isMobile || !navUp || !navDown) return;
    
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
    
    stepSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      
      // Calculate visibility with viewport adjustment for mobile
      let visibleTop = Math.max(0, rect.top);
      let visibleBottom = Math.min(viewportHeight, rect.bottom);
      
      // On mobile, adjust calculations to account for the sticky header
      if (isMobile) {
        // For iOS and small mobile screens, require more visibility to consider a section active
        const headerHeight = isIOS ? viewportHeight * 0.5 : viewportHeight * 0.45;
        visibleTop = Math.max(headerHeight, rect.top);
        
        // If this is step 1 and we're on iOS, always consider it more visible initially
        if (index === 0 && isIOS && scrollTop < viewportHeight) {
          return mostVisibleIndex = 1;
        }
      }
      
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
      
      // Adjust first section position on mobile
      if (isMobile) {
        // Force step 1 to be visible on load for mobile
        const firstSection = document.querySelector('.step-section[data-step="1"]');
        if (firstSection) {
          stepsContainer.scrollTop = 0; // Reset scroll position
          
          // For iOS, ensure proper initial positioning
          if (isIOS) {
            setTimeout(() => {
              firstSection.scrollIntoView({
                block: 'start',
                behavior: 'auto'
              });
            }, 100);
          }
        }
      }
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
    
    // Set a new timeout - FASTER on mobile
    scrollTimeout = setTimeout(() => {
      if (isScrolling) return;
      
      const mostVisibleSection = getMostVisibleSection();
      
      if (mostVisibleSection !== activeSection) {
        updateActiveSection(mostVisibleSection);
      }
    }, isMobile ? 30 : 100); // Reduced timeout for more responsive mobile experience
  }, { passive: true });
  
  // Enhanced touch handling for mobile
  let touchStartY = 0;
  let touchEndY = 0;
  let lastSwipeTime = 0;
  
  stepsContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  stepsContainer.addEventListener('touchend', (e) => {
    if (isIOS && isScrolling) return; // Prevent handling during animation on iOS
    
    touchEndY = e.changedTouches[0].clientY;
    
    // Calculate swipe distance and direction
    const touchDistance = touchStartY - touchEndY;
    const now = new Date().getTime();
    
    // Only process swipes that are significant enough
    if (Math.abs(touchDistance) > 30) { // Reduced threshold for easier detection
      const direction = touchDistance > 0 ? 1 : -1; // 1 = up, -1 = down
      
      // If swiping up, go to next step; if swiping down, go to previous step
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
    
    // On mobile, immediately update the visible section after a swipe
    setTimeout(() => {
      const mostVisibleSection = getMostVisibleSection();
      updateActiveSection(mostVisibleSection);
    }, 50); // Reduced from 100 to 50 for faster mobile response
  }, { passive: true });
  
  // Reset to first step when clicking total steps
  totalStepsElem.addEventListener('click', () => {
    scrollToSection(1);
  });
  
  // Handle window resize with improved iOS detection
  window.addEventListener('resize', () => {
    const wasJustMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || /MacIntel/.test(navigator.platform) && navigator.maxTouchPoints > 1;
    
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

  // Add IntersectionObserver for better section detection
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      if (isScrolling) return;
      
      entries.forEach(entry => {
        // Better threshold adjustment for mobile vs desktop
        const threshold = isMobile ? (isIOS ? 0.4 : 0.3) : 0.3;
        
        if (entry.isIntersecting && entry.intersectionRatio > threshold) {
          const section = entry.target;
          const sectionIndex = parseInt(section.dataset.step);
          
          if (sectionIndex !== activeSection) {
            updateActiveSection(sectionIndex);
          }
        }
      });
    }, {
      root: stepsContainer,
      threshold: isMobile ? [0.4, 0.6, 0.8] : [0.3, 0.5, 0.7] // Adjusted thresholds for mobile
    });
    
    stepSections.forEach(section => {
      sectionObserver.observe(section);
    });
  }
  
  // Reset scrolling flag after animation completes - faster on mobile
  window.addEventListener('scrollend', () => {
    setTimeout(() => {
      isScrolling = false;
    }, isMobile ? 400 : 600); // Reduced timeout for mobile
  });

  // Fix for iOS scroll issue on page load - ensure content is visible
  if (isIOS) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // Force a small scroll to trigger layout calculations
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
        
        // Position the first section properly
        const firstSection = document.querySelector('.step-section[data-step="1"]');
        if (firstSection) {
          firstSection.scrollIntoView({ block: 'start' });
        }
      }, 300);
    });
  }
});