document.addEventListener('DOMContentLoaded', function() {
    // Toggle perspective
    const toggleBtn = document.querySelector('.perspective-toggle');
    const container = document.querySelector('.container');
    
    toggleBtn.addEventListener('click', function() {
        container.classList.toggle('alt-view');
    });
    
    // Get all steps
    const steps = document.querySelectorAll('.step');
    const totalSteps = steps.length;
    
    // Calculate scroll positions for activating each step
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const stepHeight = scrollHeight / totalSteps;
    
    // Function to update active steps based on scroll position
    function updateActiveSteps(scrollPosition) {
        // Calculate how many steps should be active based on scroll position
        const activeStepIndex = Math.min(
            Math.floor(scrollPosition / stepHeight),
            totalSteps - 1
        );
        
        // Activate steps progressively
        steps.forEach((step, index) => {
            if (index <= activeStepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Scroll event listener
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        updateActiveSteps(scrollPosition);
    });
    
    // Initial update on page load
    setTimeout(() => {
        updateActiveSteps(window.scrollY);
    }, 100);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Recalculate step height
        const newScrollHeight = document.body.scrollHeight - window.innerHeight;
        const newStepHeight = newScrollHeight / totalSteps;
        
        // Update active steps based on new calculations
        updateActiveSteps(window.scrollY);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        let scrollDirection = 0;
        
        // Up/Down arrow keys to navigate
        if (e.key === 'ArrowUp') {
            scrollDirection = -1;
        } else if (e.key === 'ArrowDown') {
            scrollDirection = 1;
        } else {
            return; // Not an arrow key
        }
        
        // Calculate new scroll position
        const currentStep = Math.floor(window.scrollY / stepHeight);
        const targetStep = Math.max(0, Math.min(currentStep + scrollDirection, totalSteps - 1));
        const targetScrollPosition = targetStep * stepHeight;
        
        // Smooth scroll to the target position
        window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
        });
    });
    
    // Optional: Add touch swipe handling for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        
        // If significant swipe detected
        if (Math.abs(swipeDistance) > 50) {
            const direction = swipeDistance > 0 ? 1 : -1;
            
            // Calculate new scroll position
            const currentStep = Math.floor(window.scrollY / stepHeight);
            const targetStep = Math.max(0, Math.min(currentStep + direction, totalSteps - 1));
            const targetScrollPosition = targetStep * stepHeight;
            
            // Smooth scroll to the target position
            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
        }
    }
});
