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
  
  // Set mobile-view class on body immediately if on mobile
  if (isMobile) {
    document.body.classList.add('mobile-view');
  } else {
    document.body.classList.remove('mobile-view');
  }
  
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
  
  // Function to ensure all step content is visible for mobile
  function forceContentVisibility() {
    // Only needed on mobile
    if (!isMobile) return;
    
    // Make all sections visible
    stepSections.forEach(section => {
      section.style.display = "block";
      section.style.visibility = "visible";
      section.style.opacity = "1";
      section.style.position = "static";
      
      // Make the content inside visible too
      const content = section.querySelector('.step-content');
      if (content) {
        content.style.display = "block";
        content.style.visibility = "visible";
        content.style.opacity = "1";
        content.style.transform = "none";
        content.style.position = "static";
      }
    });
    
    // Ensure the container is properly set up for mobile
    stepsContainer.style.overflowY = "auto";
    stepsContainer.style.height = "auto";
    stepsContainer.style.display = "block";
    stepsContainer.style.paddingTop = "var(--mobile-header-height)";
  }
  
  // Ensure the Penrose container is properly sized for mobile
  function adjustPenroseContainerForMobile() {
    if (!isMobile) return;
    
    const containerElement = document.querySelector('.penrose-container');
    if (containerElement) {
      // Set mobile-friendly height
      containerElement.style.height = window.innerWidth <= 480 ? '20vh' : '23vh';
      containerElement.style.minHeight = window.innerWidth <= 480 ? '130px' : '150px';
    }
  }
  
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
  
  // Special function for mobile to completely reset the layout
  function resetMobileLayout() {
    if (!isMobile) return;
    
    // Add the mobile view class to body
    document.body.classList.add('mobile-view');
    
    // Adjust container sizes
    adjustPenroseContainerForMobile();
    
    // Reset main container
    const container = document.querySelector('.container');
    if (container) {
      container.style.flexDirection = "column";
      container.style.height = "auto";
      container.style.overflow = "auto";
    }
    
    // Reset steps container
    stepsContainer.style.width = "100%";
    stepsContainer.style.marginLeft = "0";
    stepsContainer.style.overflowY = "auto";
    stepsContainer.style.height = "auto";
    stepsContainer.style.display = "block";
    stepsContainer.style.paddingTop = window.innerWidth <= 480 ? "20vh" : "23vh";
    
    // Reset all step sections
    stepSections.forEach((section, index) => {
      section.style.position = "static";
      section.style.height = "auto";
      section.style.minHeight = "auto";
      section.style.display = "block";
      section.style.visibility = "visible";
      section.style.opacity = "1";
      section.style.marginTop = index === 0 ? "0" : "10px";
      section.style.marginBottom = "20px";
      section.style.padding = "5px 15px 15px 15px";
      
      // Reset step content
      const content = section.querySelector('.step-content');
      if (content) {
        content.style.position = "static";
        content.style.transform = "none";
        content.style.margin = "0";
        content.style.padding = "10px";
        content.style.display = "block";
        content.style.visibility = "visible";
        content.style.opacity = "1";
      }
    });
    
    // Ensure step 14 has extra padding
    const lastStep = document.querySelector('.step-section[data-step="14"]');
    if (lastStep) {
      lastStep.style.paddingBottom = "80px";
      lastStep.style.marginBottom = "60px";
    }
  }
  
  // Function to scroll to a specific section with improved behavior for iOS
  function scrollToSection(index) {
    if (isScrolling || index < 1 || index > totalSteps) return;
    
    isScrolling = true;
    updateActiveSection(index);
    
    // On mobile, ensure all content is visible first
    if (isMobile) {
      forceContentVisibility();
      resetMobileLayout();
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
    
    // On mobile, ensure content visibility
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
    // On mobile, don't change active section based on scroll position
    // since we're using a linear layout with all sections visible
    if (isMobile) {
      return activeSection;
    }
    
    let maxVisibility = 0;
    let mostVisibleIndex = activeSection;
    
    // Get the viewport height and scroll position for better calculations
    const viewportHeight = window.innerHeight;
    
    stepSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionStep = parseInt(section.dataset.step, 10);
      
      // Calculate visibility with viewport adjustment
      let visibleTop = Math.max(0, rect.top);
      let visibleBottom = Math.min(viewportHeight, rect.bottom);
      
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
      
      // Reset the mobile layout
      resetMobileLayout();
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
        
        // Force content visibility
        forceContentVisibility();
        resetMobileLayout();
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
      return; // Don't track active section on mobile since all are visible
    }
    
    // Set a new timeout - Only for desktop
    scrollTimeout = setTimeout(() => {
      if (isScrolling) return;
      
      const mostVisibleSection = getMostVisibleSection();
      
      if (mostVisibleSection !== activeSection) {
        updateActiveSection(mostVisibleSection);
      }
    }, 100);
  }, { passive: true });
  
  // Enhanced touch handling for mobile
  if (isMobile) {
    // On mobile, we don't need complex touch handling since we've switched to a simple list view
    // Just ensure content is visible on any interaction
    stepsContainer.addEventListener('touchstart', () => {
      forceContentVisibility();
      resetMobileLayout();
    }, { passive: true });
    
    stepsContainer.addEventListener('touchmove', () => {
      forceContentVisibility();
    }, { passive: true });
    
    stepsContainer.addEventListener('touchend', () => {
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
    
    // Adjust the layout if on mobile
    if (isMobile) {
      if (!wasMobile) {
        // If switching from desktop to mobile, reset the layout
        forceContentVisibility();
        resetMobileLayout();
      } else {
        // Just adjust the container size
        adjustPenroseContainerForMobile();
      }
    } else if (wasMobile) {
      // If switching from mobile to desktop, reload the page to reset everything
      window.location.reload();
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

  // Add a simple click handler to each step section on mobile
  // This makes it easier to navigate between steps
  if (isMobile) {
    stepSections.forEach(section => {
      const sectionStep = parseInt(section.dataset.step, 10);
      
      // Add a click handler to the section title
      const title = section.querySelector('h2');
      if (title) {
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
          // When clicked, update the active section and move the ball
          updateActiveSection(sectionStep);
        });
      }
    });
  }
  
  // Handle document load event to ensure all content is visible after full page load
  window.addEventListener('load', () => {
    if (isMobile) {
      // Force all content to be visible
      forceContentVisibility();
      resetMobileLayout();
      
      // Fix specific issues with Safari/iOS
      if (isIOS) {
        setTimeout(() => {
          // Reset scroll position
          stepsContainer.scrollTop = 0;
          
          // Force visibility of all sections
          forceContentVisibility();
          resetMobileLayout();
        }, 300);
      }
    }
  });
});