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
      autoReturnDelay: 5000 // 5 seconds before auto-return to front
    },
    // Animation
    animation: {
      entryDuration: 2.2,
      entryDelay: 0.3,
      flipDuration: 0.8
    }
  };

  // =========================================
  // State
  // =========================================
  const state = {
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
    btnFlipToBack: null,
    btnFlipToFront: null
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
      initFlipButtons();
      return;
    }

    // Create timeline
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        state.isAnimating = false;
        initAtropos();
        initFlipButtons();
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
        duration: 400
      });
    } catch (error) {
      console.warn('Failed to initialize Atropos:', error);
    }
  }

  function destroyAtropos() {
    if (state.atroposInstance) {
      try {
        state.atroposInstance.destroy();
        state.atroposInstance = null;
      } catch (error) {
        console.warn('Failed to destroy Atropos:', error);
      }
    }
  }

  // =========================================
  // Flip Card Functions
  // =========================================
  function initFlipButtons() {
    // Button to flip to back (Ver creditos)
    elements.btnFlipToBack.addEventListener('click', flipToBack);

    // Button to flip to front (Volver)
    elements.btnFlipToFront.addEventListener('click', flipToFront);
  }

  function flipToBack() {
    if (state.isFlipped || state.isAnimating) return;

    // Clear any existing auto-return timer
    clearAutoReturnTimer();

    // Destroy Atropos before flipping
    destroyAtropos();

    state.isFlipped = true;

    // Animate flip with GSAP
    gsap.to(elements.cardFlipper, {
      rotateY: 180,
      duration: CONFIG.animation.flipDuration,
      ease: 'power2.inOut',
      onComplete: () => {
        // Set auto-return timer
        state.autoReturnTimer = setTimeout(() => {
          if (state.isFlipped) {
            flipToFront();
          }
        }, CONFIG.flip.autoReturnDelay);
      }
    });
  }

  function flipToFront() {
    if (!state.isFlipped || state.isAnimating) return;

    // Clear any existing auto-return timer
    clearAutoReturnTimer();

    state.isFlipped = false;

    // Animate flip with GSAP
    gsap.to(elements.cardFlipper, {
      rotateY: 0,
      duration: CONFIG.animation.flipDuration,
      ease: 'power2.inOut',
      onComplete: () => {
        // Reinitialize Atropos after returning to front
        initAtropos();
      }
    });
  }

  function clearAutoReturnTimer() {
    if (state.autoReturnTimer) {
      clearTimeout(state.autoReturnTimer);
      state.autoReturnTimer = null;
    }
  }

  // =========================================
  // Keyboard Navigation
  // =========================================
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (state.isAnimating) return;

      // Flip card with spacebar (when not focused on a button/link)
      if (e.code === 'Space') {
        const activeElement = document.activeElement;
        const isInteractive = activeElement.tagName === 'BUTTON' ||
                             activeElement.tagName === 'A' ||
                             activeElement.tagName === 'INPUT';

        if (!isInteractive) {
          e.preventDefault();
          toggleFlip();
        }
      }

      // Escape key returns to front
      if (e.code === 'Escape' && state.isFlipped) {
        e.preventDefault();
        flipToFront();
      }
    });
  }

  function toggleFlip() {
    if (state.isFlipped) {
      flipToFront();
    } else {
      flipToBack();
    }
  }

  // =========================================
  // Resize Handler
  // =========================================
  function handleResize() {
    // tsParticles handles resize internally
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
    elements.btnFlipToBack = document.getElementById('btn-flip-to-back');
    elements.btnFlipToFront = document.getElementById('btn-flip-to-front');

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
      if (document.hidden) {
        clearAutoReturnTimer();
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
