/* =========================================
   THE ALGORITHM CARD - Main JavaScript
   Reset Agency - The Lab
   ========================================= */

(function () {
  'use strict';

  // =========================================
  // Configuration
  // =========================================
  const CONFIG = {
    // Particles
    particles: {
      desktop: 60,
      mobile: 30,
      linksDistance: {
        desktop: 150,
        mobile: 100
      }
    },
    // Flip behavior
    flip: {
      threshold: 0.15, // 15% of screen width to trigger flip
      resistance: 0.5, // Drag resistance factor
      maxDragRotation: 60, // Max degrees during drag
      autoReturnDelay: 4000 // ms before auto-return to front
    },
    // Animation
    animation: {
      entryDuration: 2.2,
      entryDelay: 0.3
    }
  };

  // =========================================
  // State
  // =========================================
  const state = {
    isDragging: false,
    startX: 0,
    isFlipped: false,
    atroposInstance: null,
    autoReturnTimer: null,
    isAnimating: true,
    prefersReducedMotion: false
  };

  // =========================================
  // DOM Elements
  // =========================================
  const elements = {
    particlesBg: null,
    cardContainer: null,
    cardFlipper: null,
    cardAtropos: null,
    flipHint: null
  };

  // =========================================
  // Utility Functions
  // =========================================
  function isMobile() {
    return window.innerWidth < 768;
  }

  function checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getClientX(e) {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientX;
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return e.changedTouches[0].clientX;
    }
    return e.clientX;
  }

  // =========================================
  // Particles Initialization
  // =========================================
  async function initParticles() {
    const mobile = isMobile();
    const particleCount = mobile ? CONFIG.particles.mobile : CONFIG.particles.desktop;
    const linksDistance = mobile
      ? CONFIG.particles.linksDistance.mobile
      : CONFIG.particles.linksDistance.desktop;

    try {
      await tsParticles.load('particles-bg', {
        fullScreen: {
          enable: false,
          zIndex: -1
        },
        particles: {
          number: {
            value: particleCount,
            density: {
              enable: true,
              area: 800
            }
          },
          color: {
            value: ['#00FF85', '#6F42C1', '#FFFFFF']
          },
          opacity: {
            value: { min: 0.1, max: 0.5 }
          },
          size: {
            value: { min: 1, max: 3 }
          },
          links: {
            enable: true,
            distance: linksDistance,
            color: '#00FF85',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'bounce'
            }
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: !mobile,
              mode: 'grab'
            }
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
                color: '#00FF85'
              }
            }
          }
        },
        detectRetina: true
      });

      // Fade in particles
      elements.particlesBg.classList.add('visible');
    } catch (error) {
      console.warn('Failed to initialize particles:', error);
    }
  }

  // =========================================
  // GSAP Entry Animation
  // =========================================
  function playEntryAnimation() {
    const reducedMotion = state.prefersReducedMotion;

    // Make card visible
    elements.cardContainer.classList.add('ready');

    if (reducedMotion) {
      // Skip animation for reduced motion preference
      gsap.set(elements.cardContainer, {
        y: 0,
        scale: 1,
        rotateY: 0
      });
      state.isAnimating = false;
      initAtropos();
      initFlipInteraction();
      showFlipHint();
      return;
    }

    // Create timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        state.isAnimating = false;
        initAtropos();
        initFlipInteraction();
        showFlipHint();
      }
    });

    // Entry animation: card comes from below with 360deg rotation
    tl.fromTo(
      elements.cardContainer,
      {
        y: '100vh',
        scale: 0.3,
        rotateY: 0
      },
      {
        y: 0,
        scale: 1,
        rotateY: 360,
        duration: CONFIG.animation.entryDuration,
        ease: 'back.out(1.2)'
      },
      CONFIG.animation.entryDelay
    );

    // Reset rotation for proper flip behavior after animation
    tl.set(elements.cardFlipper, { rotateY: 0 });
  }

  // =========================================
  // Atropos (3D Tilt) Initialization
  // =========================================
  function initAtropos() {
    if (state.atroposInstance) {
      return;
    }

    try {
      state.atroposInstance = Atropos({
        el: elements.cardAtropos,
        activeOffset: 40,
        shadowScale: 1.05,
        rotateXMax: 15,
        rotateYMax: 15,
        shadow: true,
        highlight: true,
        duration: 400,
        onEnter: () => {
          if (!state.isDragging) {
            elements.cardContainer.style.cursor = 'grab';
          }
        },
        onLeave: () => {
          elements.cardContainer.style.cursor = 'default';
        }
      });
    } catch (error) {
      console.warn('Failed to initialize Atropos:', error);
    }
  }

  function pauseAtropos() {
    if (state.atroposInstance) {
      state.atroposInstance.el.classList.add('atropos-disabled');
    }
  }

  function resumeAtropos() {
    if (state.atroposInstance) {
      state.atroposInstance.el.classList.remove('atropos-disabled');
    }
  }

  // =========================================
  // Flip Card Interaction
  // =========================================
  function initFlipInteraction() {
    const flipper = elements.cardFlipper;

    // Mouse events
    flipper.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    // Touch events
    flipper.addEventListener('touchstart', handleDragStart, { passive: true });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }

  function handleDragStart(e) {
    if (state.isAnimating) return;

    // Don't start drag if clicking on a CTA button
    if (e.target.closest('.cta-button')) {
      return;
    }

    state.isDragging = true;
    state.startX = getClientX(e);

    // Clear any existing auto-return timer
    if (state.autoReturnTimer) {
      clearTimeout(state.autoReturnTimer);
      state.autoReturnTimer = null;
    }

    // Visual feedback
    elements.cardContainer.classList.add('dragging');
    pauseAtropos();
  }

  function handleDragMove(e) {
    if (!state.isDragging) return;

    // Prevent scrolling on touch devices
    if (e.type === 'touchmove') {
      e.preventDefault();
    }

    const currentX = getClientX(e);
    const deltaX = currentX - state.startX;

    // Apply resistance
    const rotation = deltaX * CONFIG.flip.resistance;

    // Clamp rotation during drag
    const clampedRotation = Math.max(
      -CONFIG.flip.maxDragRotation,
      Math.min(CONFIG.flip.maxDragRotation, rotation)
    );

    // Calculate final rotation based on current flip state
    const baseRotation = state.isFlipped ? 180 : 0;
    const finalRotation = baseRotation + clampedRotation;

    // Apply visual rotation
    gsap.set(elements.cardFlipper, {
      rotateY: finalRotation
    });
  }

  function handleDragEnd(e) {
    if (!state.isDragging) return;

    state.isDragging = false;
    elements.cardContainer.classList.remove('dragging');

    const endX = getClientX(e);
    const deltaX = endX - state.startX;
    const threshold = window.innerWidth * CONFIG.flip.threshold;

    if (Math.abs(deltaX) > threshold) {
      // Flip successful
      state.isFlipped = !state.isFlipped;

      gsap.to(elements.cardFlipper, {
        rotateY: state.isFlipped ? 180 : 0,
        duration: 0.6,
        ease: 'back.out(1.5)',
        onComplete: () => {
          resumeAtropos();

          // If flipped to back, set auto-return timer
          if (state.isFlipped) {
            state.autoReturnTimer = setTimeout(() => {
              autoReturnToFront();
            }, CONFIG.flip.autoReturnDelay);
          }
        }
      });

      // Hide flip hint after first successful flip
      hideFlipHint();
    } else {
      // Didn't reach threshold - spring back
      gsap.to(elements.cardFlipper, {
        rotateY: state.isFlipped ? 180 : 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          resumeAtropos();
        }
      });
    }
  }

  function autoReturnToFront() {
    if (!state.isFlipped || state.isDragging) return;

    state.isFlipped = false;
    state.autoReturnTimer = null;

    gsap.to(elements.cardFlipper, {
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });
  }

  // =========================================
  // Flip Hint
  // =========================================
  function showFlipHint() {
    setTimeout(() => {
      elements.flipHint.classList.add('visible');
    }, 500);
  }

  function hideFlipHint() {
    elements.flipHint.classList.remove('visible');
  }

  // =========================================
  // Keyboard Navigation
  // =========================================
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (state.isAnimating) return;

      // Flip card with spacebar or arrow keys
      if (e.code === 'Space' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        // Don't trigger if focused on a button
        if (document.activeElement.classList.contains('cta-button')) {
          return;
        }

        e.preventDefault();
        toggleFlip();
      }
    });
  }

  function toggleFlip() {
    if (state.autoReturnTimer) {
      clearTimeout(state.autoReturnTimer);
      state.autoReturnTimer = null;
    }

    state.isFlipped = !state.isFlipped;

    gsap.to(elements.cardFlipper, {
      rotateY: state.isFlipped ? 180 : 0,
      duration: 0.6,
      ease: 'back.out(1.5)',
      onComplete: () => {
        if (state.isFlipped) {
          state.autoReturnTimer = setTimeout(() => {
            autoReturnToFront();
          }, CONFIG.flip.autoReturnDelay);
        }
      }
    });

    hideFlipHint();
  }

  // =========================================
  // Resize Handler
  // =========================================
  function handleResize() {
    // Re-initialize particles on significant resize
    // (handled by tsParticles internally)
  }

  // =========================================
  // Initialization
  // =========================================
  function init() {
    // Cache DOM elements
    elements.particlesBg = document.getElementById('particles-bg');
    elements.cardContainer = document.querySelector('.card-container');
    elements.cardFlipper = document.getElementById('card-flipper');
    elements.cardAtropos = document.getElementById('card-atropos');
    elements.flipHint = document.getElementById('flip-hint');

    // Check for reduced motion preference
    state.prefersReducedMotion = checkReducedMotion();

    // Initialize features
    initParticles();
    initKeyboardNav();

    // Start entry animation after a brief delay for resources to load
    setTimeout(() => {
      playEntryAnimation();
    }, 100);

    // Handle resize
    window.addEventListener('resize', handleResize);

    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.autoReturnTimer) {
        clearTimeout(state.autoReturnTimer);
        state.autoReturnTimer = null;
      }
    });
  }

  // =========================================
  // Start when DOM is ready
  // =========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
