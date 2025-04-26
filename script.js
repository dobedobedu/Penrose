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
  
  // Function to ensure all step content is visible for mobile
  function forceContentVisibility() {
    // Only needed on mobile
    if (!isMobile) return;
    
    // Make all sections visible
    stepSections.forEach(section => {
      section.style.opacity = "1";
    });
  }
  
  // Create blur overlay for content behind the Penrose stairs
  function createPenroseBlurOverlay() {
    if (!isMobile) return;
    
    // Check if the overlay already exists
    if (document.querySelector('.penrose-behind-blur')) return;
    
    const blurOverlay = document.createElement('div');
    blurOverlay.className = 'penrose-behind-blur';
    document.body.appendChild(blurOverlay);
  }
  
  // Enable blur effect for text that's scrolling out of view
  function setupBlurEffect() {
    if (!isMobile) return;
    
    // Add blur-content class to all step content elements
    stepSections.forEach(section => {
      const content = section.querySelector('.step-content');
      if (content) {
        content.parentElement.classList.add('blur-content');
      }
    });
    
    // Initialize scroll observer for blur effect
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const content = entry.target.querySelector('.step-content');
        if (!content) return;
        
        if (entry.isIntersecting) {
          // When section is in view, remove blur
          content.classList.remove('blur-out');
          
          // Gradually remove blur as the section becomes more visible
          const ratio = entry.intersectionRatio;
          content.style.filter = `blur(${3 - (ratio * 3)}px)`;
        } else {
          // When section is out of view, add blur
          content.classList.add('blur-out');
        }
      });
    }, {
      root: null,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '-5% 0px -5% 0px'
    });
    
    // Observe all step sections
    stepSections.forEach(section => {
      observer.observe(section);
    });
    
    // Create the blur overlay for stairs
    createPenroseBlurOverlay();
  }
  
  // Apply stronger blur to content behind the Penrose stairs
  function applyStairsBlurEffect() {
    if (!isMobile) return;
    
    const penroseHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-staircase-height'));
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height'));
    const indicatorHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-indicator-height'));
    
    const stairsBottom = headerHeight + indicatorHeight + penroseHeight;
    
    stepSections.forEach(section => {
      const content = section.querySelector('.step-content');
      if (!content) return;
      
      const rect = section.getBoundingClientRect();
      
      // If the section is behind or partially behind the stairs
      if (rect.top < stairsBottom) {
        // Calculate how much of the section is behind the stairs
        const overlapPercentage = (stairsBottom - rect.top) / rect.height;
        if (overlapPercentage > 0) {
          // Apply stronger blur for more overlap
          const blurAmount = Math.min(5, overlapPercentage * 6);
          content.style.filter = `blur(${blurAmount}px)`;
        }
      }
    });
  }
  
  // Ensure the Penrose container is properly sized for mobile
  function adjustPenroseContainerForMobile() {
    if (!isMobile) return;
    
    const containerElement = document.querySelector('.penrose-container');
    if (containerElement) {
      // Set mobile-friendly height with more space for the stairs
      containerElement.style.height = window.innerWidth <= 480 ? '260px' : '280px';
      containerElement.style.minHeight = window.innerWidth <= 480 ? '260px' : '280px';
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
          if (isMobile) {
            applyStairsBlurEffect();
          }
        }, 200); // Shorter timeout for iOS for better responsiveness
      } else if (isMobile) {
        // For non-iOS mobile devices - optimized approach with easier scrolling
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        setTimeout(() => {
          isScrolling = false;
          applyStairsBlurEffect();
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
    
    // On mobile, ensure content visibility
    if (isMobile) {
      forceContentVisibility();
      applyStairsBlurEffect();
    }
    
    moveGlowingBall(index);
    activeSection = index;
    
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
        // For iOS and small mobile screens, require more visibility to consider a section active
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
      
      // Adjust Penrose container size
      adjustPenroseContainerForMobile();
      
      // Setup blur effect for text scrolling
      setupBlurEffect();
      
      // Apply initial blur for text behind stairs
      applyStairsBlurEffect();
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
            applyStairsBlurEffect();
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

  // Add scrolling handler to update blur effect
  stepsContainer.addEventListener('scroll', () => {
    if (isMobile) {
      // Apply stairs blur effect during scroll
      applyStairsBlurEffect();
      
      // Update blur effect based on scroll position
      stepSections.forEach(section => {
        const content = section.querySelector('.step-content');
        if (!content) return;
        
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how far the section is from the center of viewport
        const distanceFromCenter = Math.abs((rect.top + rect.height / 2) - (viewportHeight / 2));
        const maxDistance = viewportHeight / 2 + rect.height / 2;
        
        // Calculate blur amount (0 when centered, up to 3px when far away)
        const blurAmount = Math.min(3, (distanceFromCenter / maxDistance) * 3);
        
        // Apply blur based on scrolling distance
        // Don't apply this to content that's behind the stairs (that's handled by applyStairsBlurEffect)
        const penroseHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-staircase-height'));
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height'));
        const indicatorHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-indicator-height'));
        const stairsBottom = headerHeight + indicatorHeight + penroseHeight;
        
        if (rect.top >= stairsBottom) {
          content.style.filter = `blur(${blurAmount}px)`;
        }
      });
    }
    
    // Original scroll handler logic
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
      
      // Apply stairs blur after scrolling settles
      if (isMobile) {
        applyStairsBlurEffect();
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
      applyStairsBlurEffect();
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
        applyStairsBlurEffect();
        
        const mostVisibleSection = getMostVisibleSection();
        updateActiveSection(mostVisibleSection);
      }, 100);
    }, { passive: true });
    
    // Add touch move handler to keep content visible while dragging and update blur
    stepsContainer.addEventListener('touchmove', (e) => {
      // Keep content visible during touch movement
      forceContentVisibility();
      
      // Update blur effect during touch movement
      applyStairsBlurEffect();
      
      stepSections.forEach(section => {
        const content = section.querySelector('.step-content');
        if (!content) return;
        
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how far the section is from the center of viewport
        const distanceFromCenter = Math.abs((rect.top + rect.height / 2) - (viewportHeight / 2));
        const maxDistance = viewportHeight / 2 + rect.height / 2;
        
        // Calculate blur amount
        const blurAmount = Math.min(3, (distanceFromCenter / maxDistance) * 3);
        
        // Apply blur with transition - but not to content behind stairs, that's handled separately
        const penroseHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-staircase-height'));
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height'));
        const indicatorHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-indicator-height'));
        const stairsBottom = headerHeight + indicatorHeight + penroseHeight;
        
        if (rect.top >= stairsBottom) {
          content.style.filter = `blur(${blurAmount}px)`;
        }
      });
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
    const wasJustMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || /MacIntel/.test(navigator.platform) && navigator.maxTouchPoints > 1;
    
    // Adjust the Penrose container if on mobile
    if (isMobile) {
      // Adjust container size
      adjustPenroseContainerForMobile();
      
      // Force content visibility if switching to mobile
      if (!wasJustMobile) {
        forceContentVisibility();
        setupBlurEffect();
        applyStairsBlurEffect();
      }
    } else if (wasJustMobile) {
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

  // Handle document load event to ensure all content is visible after full page load
  window.addEventListener('load', () => {
    if (isMobile) {
      // Force all content to be visible
      forceContentVisibility();
      
      // Adjust container size
      adjustPenroseContainerForMobile();
      
      // Setup blur effect
      setupBlurEffect();
      
      // Apply stairs blur effect
      applyStairsBlurEffect();
      
      // Fix specific issues with Safari/iOS
      if (isIOS) {
        setTimeout(() => {
          // Reset scroll position
          stepsContainer.scrollTop = 0;
          
          // Force visibility of all sections
          forceContentVisibility();
          applyStairsBlurEffect();
          
          // First section special handling
          const firstSection = document.querySelector('.step-section[data-step="1"]');
          if (firstSection) {
            firstSection.scrollIntoView({
              block: 'start',
              behavior: 'auto'
            });
            
            // Reapply blur after scrolling
            setTimeout(() => {
              applyStairsBlurEffect();
            }, 100);
          }
        }, 300);
      }
    }
  });
});