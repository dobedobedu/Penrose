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
  const stepIndicator = document.querySelector('.step-indicator');
  
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
    "Need Finding",
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
    "Reflect and Connect the Dots"
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
  
  // Create the dedicated blur gradient layer for smooth transitions
  function createBlurGradientLayer() {
    if (!isMobile) return;
    
    // Check if the blur layer already exists
    if (document.querySelector('.penrose-blur-layer')) return;
    
    const blurLayer = document.createElement('div');
    blurLayer.className = 'penrose-blur-layer';
    document.body.appendChild(blurLayer);
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
    
    // Create the blur gradient layer
    createBlurGradientLayer();
    
    // Set up snap alignment for sections
    stepSections.forEach(section => {
      section.style.scrollSnapAlign = "start";
      section.style.scrollSnapStop = "always"; // Ensure snapping always stops at each section
      
      // Add proper scroll margin to ensure sections snap at the right position
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height'));
      const indicatorHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-indicator-height'));
      const staircaseHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-staircase-height'));
      
      const scrollMargin = headerHeight + indicatorHeight + staircaseHeight;
      section.style.scrollMarginTop = `${scrollMargin}px`;
    });
    
    // Initialize intersection observer to handle section visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = entry.target;
        const content = section.querySelector('.step-content');
        if (!content) return;
        
        if (entry.isIntersecting) {
          // When section is in good view, make it the active one and remove blur
          if (entry.intersectionRatio > 0.7) {
            section.classList.add('active');
            content.style.filter = "blur(0)";
          } else {
            // Partially visible, apply slight blur
            section.classList.remove('active');
            const blurAmount = Math.max(0, 1 - entry.intersectionRatio) * 2;
            content.style.filter = `blur(${blurAmount}px)`;
          }
        } else {
          // When section is out of view, add blur
          section.classList.remove('active');
          content.style.filter = "blur(0.5px)"; // Reduced blur for better visibility
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
    const transitionSpeed = isMobile ? '0.3s' : '0.6s'; // Even faster for mobile
    glowingBall.style.transition = `left ${transitionSpeed} ease-out, top ${transitionSpeed} ease-out`;
    glowingBall.style.left = `${left}px`;
    glowingBall.style.top = `${top}px`;
    
    // Update step indicator
    currentStepElem.textContent = index.toString().padStart(2, '0');
    
    // Add active class to current section and remove from others
    stepSections.forEach((section) => {
      const sectionStep = parseInt(section.dataset.step, 10);
      if (sectionStep === index) {
        section.classList.add('active');
        // Make active section content clear
        const content = section.querySelector('.step-content');
        if (content) {
          content.style.filter = "blur(0)";
          content.style.opacity = "1"; // Ensure full opacity
        }
      } else {
        section.classList.remove('active');
        // Apply slight blur to non-active sections
        const content = section.querySelector('.step-content');
        if (content) {
          // Use less blur for non-active sections on mobile
          content.style.filter = isMobile ? "blur(0.5px)" : "blur(1px)";
        }
      }
    });
  }
  
  // Function to scroll to a specific section with improved behavior for iOS
  function scrollToSection(index) {
    if (isScrolling || index < 1 || index > totalSteps) return;
    
    isScrolling = true;
    
    // Force all content to be visible on mobile
    if (isMobile) {
      forceContentVisibility();
    }
    
    // Update active section before scrolling for smoother ball movement
    updateActiveSection(index);
    
    const targetSection = document.querySelector(`.step-section[data-step="${index}"]`);
    if (targetSection) {
      if (isIOS) {
        // iOS-specific scroll handling with adjusted offset to prevent content cutoff
        const offsetTop = targetSection.offsetTop - 40; // Apply offset to prevent content cutoff
        
        // Use auto behavior for better iOS performance
        stepsContainer.scrollTo({
          top: offsetTop,
          behavior: 'auto' // Use 'auto' instead of 'smooth' for more reliable iOS behavior
        });
        
        // Force a reflow to ensure the scroll completes
        stepsContainer.offsetHeight;
        
        // After a short delay, update the ball position and clear flag
        setTimeout(() => {
          isScrolling = false;
          // Force an additional ball movement to keep it synchronized
          moveGlowingBall(index);
        }, 200); // Shorter timeout for iOS for better responsiveness
      } else if (isMobile) {
        // For non-iOS mobile devices - optimized approach with adjusted offset
        const offsetTop = targetSection.offsetTop - 40; // Apply offset to prevent content cutoff
        
        stepsContainer.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Use a longer timeout for smooth scrolling completion
        setTimeout(() => {
          isScrolling = false;
          // Force an additional ball movement after scrolling completes
          moveGlowingBall(index);
        }, 800);
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
    
    // For mobile, determine a better way to calculate visibility
    if (isMobile) {
      // Get the viewport height and scroll position
      const viewportHeight = window.innerHeight;
      const scrollTop = stepsContainer.scrollTop;
      
      // Calculate the position of key elements
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height')) || 60;
      const indicatorHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-indicator-height')) || 40;
      const staircaseHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-staircase-height')) || 280;
      
      // Total offset from top
      const topOffset = headerHeight + indicatorHeight + staircaseHeight;
      
      // Viewport area where we want to detect the most visible section
      const visibilityStart = topOffset;
      const visibilityEnd = viewportHeight;
      const visibilityArea = visibilityEnd - visibilityStart;
      
      // Get all sections currently in the view
      stepSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionStep = parseInt(section.dataset.step, 10);
        
        // Calculate how much of the section is visible in our target area
        const sectionTopInView = Math.max(visibilityStart, rect.top);
        const sectionBottomInView = Math.min(visibilityEnd, rect.bottom);
        
        // Calculate visible height
        const visibleHeight = Math.max(0, sectionBottomInView - sectionTopInView);
        
        // Adjust visibility calculation to prefer sections at the top
        // of the viewport after the fixed elements
        let visibility = visibleHeight / rect.height;
        
        // Boost visibility for sections near the top of the viewing area
        if (rect.top <= visibilityStart + 100 && rect.bottom >= visibilityStart) {
          visibility += 0.5; // Boost sections positioned right at the top of the viewing area
        }
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = sectionStep;
        }
      });
    } else {
      // Desktop calculation
      stepSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionStep = parseInt(section.dataset.step, 10);
        
        const visibleHeight = Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);
        const visibility = visibleHeight / rect.height;
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleIndex = sectionStep;
        }
      });
    }
    
    return mostVisibleIndex;
  }
  
  // Function to advance to next step with improved handling for step 14 -> step 1 cycling
  function goToNextStep() {
    if (activeSection < totalSteps) {
      scrollToSection(activeSection + 1);
    } else {
      // If on last step (step 14), loop back to first step (step 1)
      scrollToSection(1);
      
      // Add additional handling to ensure smooth transition to step 1
      if (isMobile) {
        // Force an immediate update to the ball position
        setTimeout(() => {
          moveGlowingBall(1);
          forceContentVisibility();
          
          // Reset scroll position to top with adjusted offset for mobile
          const firstSection = document.querySelector('.step-section[data-step="1"]');
          if (firstSection) {
            const offsetTop = firstSection.offsetTop - 40;
            stepsContainer.scrollTo({
              top: offsetTop,
              behavior: isIOS ? 'auto' : 'smooth'
            });
          }
        }, isIOS ? 100 : 300);
      }
    }
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
      
      // Make step indicator clickable for mobile - entire indicator area for better touch targets
      if (stepIndicator) {
        stepIndicator.style.cursor = 'pointer';
        stepIndicator.addEventListener('click', goToNextStep);
        
        // Add visual feedback for better UX
        stepIndicator.addEventListener('touchstart', () => {
          stepIndicator.style.opacity = '0.8';
        });
        stepIndicator.addEventListener('touchend', () => {
          stepIndicator.style.opacity = '1';
        });
      }
      
      // Enforce scroll snap settings programmatically
      if (stepsContainer) {
        stepsContainer.style.scrollSnapType = "y mandatory";
        stepsContainer.style.scrollBehavior = "smooth";
        stepsContainer.style.WebkitOverflowScrolling = "touch";
      }
    }
    
    penroseContainer.offsetWidth; // Force reflow
    
    // Re-enable transitions
    setTimeout(() => {
      glowingBall.style.transition = isMobile ? 'left 0.3s ease-out, top 0.3s ease-out' : 'left 0.6s ease-out, top 0.6s ease-out';
      updateActiveSection(1);
      
      // Force step 1 to be visible on page load for mobile
      if (isMobile) {
        // Reset scroll position first
        stepsContainer.scrollTop = 0;
        
        // Ensure first step is visible
        const firstSection = document.querySelector('.step-section[data-step="1"]');
        if (firstSection) {
          setTimeout(() => {
            // Adjust scroll position with offset to prevent content cutoff
            const offsetTop = firstSection.offsetTop - 40;
            stepsContainer.scrollTo({
              top: offsetTop,
              behavior: 'auto'
            });
            
            // Force visibility again after scrolling
            forceContentVisibility();
            firstSection.classList.add('active');
            const content = firstSection.querySelector('.step-content');
            if (content) {
              content.style.filter = "blur(0)";
            }
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
      } else {
        // If on last step, loop back to first step
        scrollToSection(1);
      }
    });
  }

  // Add scrolling handler to update blur effect and ball position
  stepsContainer.addEventListener('scroll', () => {
    if (isMobile) {
      // Update blur effect based on scroll position
      stepSections.forEach(section => {
        const content = section.querySelector('.step-content');
        if (!content) return;
        
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how far the section is from the center of viewport
        const distanceFromCenter = Math.abs((rect.top + rect.height / 2) - (viewportHeight / 2));
        const maxDistance = viewportHeight / 2 + rect.height / 2;
        
        // Calculate blur amount (0 when centered, up to 2px when far away)
        const blurAmount = Math.min(1, (distanceFromCenter / maxDistance) * 2);
        
        // Apply blur with smooth transition
        content.style.filter = `blur(${blurAmount}px)`;
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
    }, isMobile ? 30 : 100); // Reduced timeout for more responsive mobile experience
  }, { passive: true });
  
  // Improved debounce function for better performance
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
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
      if (Math.abs(touchDistance) > 50) { // Threshold to make it less sensitive
        const direction = touchDistance > 0 ? 1 : -1; // 1 = up, -1 = down
        
        // Only navigate if sufficient time has passed since last swipe to prevent accidental triggers
        if (now - lastSwipeTime > 400) { // Increased delay between swipes
          lastSwipeTime = now;
          
          // If swiping up, go to next step; if swiping down, go to previous step
          if (direction === 1) {
            // Going to next step or looping back to first
            if (activeSection < totalSteps) {
              scrollToSection(activeSection + 1);
            } else {
              // If on last step, loop back to first step
              scrollToSection(1);
            }
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
        
        // Force ball to follow to current section after a touch event completes
        moveGlowingBall(activeSection);
      }, 100);
    }, { passive: true });
    
    // Add touch move handler to keep content visible while dragging and update blur
    stepsContainer.addEventListener('touchmove', debounce((e) => {
      // Keep content visible during touch movement
      forceContentVisibility();
      
      // Get current scroll position during touch move to synchronize ball position
      const mostVisibleSection = getMostVisibleSection();
      if (mostVisibleSection !== activeSection) {
        updateActiveSection(mostVisibleSection);
      }
    }, 50), { passive: true });
  }
  
  // Reset to first step when clicking total steps
  totalStepsElem.addEventListener('click', () => {
    scrollToSection(1);
  });
  
  // Allow clicking current step to navigate to next step
  currentStepElem.addEventListener('click', () => {
    goToNextStep();
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
      
      // Setup enhanced snapping
      if (!wasJustMobile) {
        if (stepsContainer) {
          stepsContainer.style.scrollSnapType = "y mandatory";
          stepsContainer.style.scrollBehavior = "smooth";
        }
      }
      
      // Force content visibility if switching to mobile
      if (!wasJustMobile) {
        forceContentVisibility();
        setupBlurEffect();
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
      const transitionSpeed = isMobile ? '0.3s' : '0.6s';
      glowingBall.style.transition = `left ${transitionSpeed} ease-out, top ${transitionSpeed} ease-out`;
    }, 50);
  });
  
  // Keyboard navigation for desktop only
  if (!isMobile) {
    document.addEventListener('keydown', (e) => {
      if (isScrolling) return;
      
      let targetSection = activeSection;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (targetSection < totalSteps) {
          targetSection = Math.min(activeSection + 1, totalSteps);
        } else {
          // If on last step, loop back to first step
          targetSection = 1;
        }
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
      
      // Setup proper snapping
      if (stepsContainer) {
        stepsContainer.style.scrollSnapType = "y mandatory";
        stepsContainer.style.scrollBehavior = "smooth";
        
        // Add scroll margin to all step sections
        stepSections.forEach(section => {
          // Calculate proper scroll margin from CSS variables
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height'));
          const indicatorHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-indicator-height'));
          const staircaseHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mobile-staircase-height'));
          
          const scrollMargin = headerHeight + indicatorHeight + staircaseHeight;
          section.style.scrollMarginTop = `${scrollMargin}px`;
          section.style.scrollSnapAlign = "start";
          section.style.scrollSnapStop = "always";
        });
      }
      
      // Fix specific issues with Safari/iOS
      if (isIOS) {
        setTimeout(() => {
          // Reset scroll position
          stepsContainer.scrollTop = 0;
          
          // Force visibility of all sections
          forceContentVisibility();
          
          // First section special handling
          const firstSection = document.querySelector('.step-section[data-step="1"]');
          if (firstSection) {
            // Adjust scroll position with offset to prevent content cutoff
            const offsetTop = firstSection.offsetTop - 40;
            stepsContainer.scrollTo({
              top: offsetTop,
              behavior: 'auto'
            });
            
            // Make first section active and clear
            setTimeout(() => {
              firstSection.classList.add('active');
              const content = firstSection.querySelector('.step-content');
              if (content) {
                content.style.filter = "blur(0)";
              }
              
              // Force ball position update
              moveGlowingBall(1);
            }, 100);
          }
        }, 300);
      }
    }
  });
});