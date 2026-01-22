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
    particles: {
      desktop: 50,
      mobile: 25,
      linksDistance: {
        desktop: 150,
        mobile: 100
      }
    },
    flip: {
      autoReturnDelay: 5000,
      duration: 0.8
    },
    animation: {
      entryDuration: 1.8,
      entryDelay: 0.2
    }
  };

  // =========================================
  // State
  // =========================================
  const state = {
    isFlipped: false,
    atroposInstance: null,
    autoReturnTimer: null,
    isAnimating: false,
    prefersReducedMotion: false
  };

  // =========================================
  // DOM Elements
  // =========================================
  const elements = {};

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
            // Purple and green colors for light mode
            value: ['#6F42C1', '#00FF85', '#9B59B6', '#2ECC71']
          },
          opacity: {
            value: { min: 0.3, max: 0.7 }
          },
          size: {
            value: { min: 2, max: 4 }
          },
          links: {
            enable: true,
            distance: linksDistance,
            // Alternate between purple and green for links
            color: {
              value: ['#6F42C1', '#00FF85']
            },
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.8,
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
                opacity: 0.6,
                color: '#6F42C1'
              }
            }
          }
        },
        detectRetina: true
      });

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
    elements.cardScene.classList.add('ready');

    if (reducedMotion) {
      gsap.set(elements.cardScene, {
        y: 0,
        scale: 1,
        opacity: 1
      });
      initAtropos();
      initFlipButtons();
      return;
    }

    state.isAnimating = true;

    // Create timeline for entry animation
    const tl = gsap.timeline({
      onComplete: () => {
        state.isAnimating = false;
        initAtropos();
        initFlipButtons();
      }
    });

    // Animate the card scene (not the inner flip container)
    tl.fromTo(
      elements.cardScene,
      {
        y: '80vh',
        scale: 0.5,
        opacity: 0
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: CONFIG.animation.entryDuration,
        ease: 'power3.out'
      },
      CONFIG.animation.entryDelay
    );
  }

  // =========================================
  // Atropos (3D Tilt)
  // =========================================
  function initAtropos() {
    if (state.atroposInstance || state.isFlipped) {
      return;
    }

    try {
      state.atroposInstance = Atropos({
        el: elements.cardAtropos,
        activeOffset: 40,
        shadowScale: 1.05,
        rotateXMax: 12,
        rotateYMax: 12,
        shadow: true,
        highlight: true,
        duration: 300
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
    elements.btnFlipToBack.addEventListener('click', handleFlipToBack);
    elements.btnFlipToFront.addEventListener('click', handleFlipToFront);
  }

  function handleFlipToBack(e) {
    e.preventDefault();
    e.stopPropagation();
    flipToBack();
  }

  function handleFlipToFront(e) {
    e.preventDefault();
    e.stopPropagation();
    flipToFront();
  }

  function flipToBack() {
    if (state.isFlipped || state.isAnimating) {
      return;
    }

    clearAutoReturnTimer();
    destroyAtropos();

    state.isFlipped = true;
    state.isAnimating = true;

    gsap.to(elements.cardInner, {
      rotateY: 180,
      duration: CONFIG.flip.duration,
      ease: 'power2.inOut',
      transformPerspective: 1000,
      transformOrigin: '50% 50%',
      onComplete: () => {
        state.isAnimating = false;
        // Set auto-return timer
        state.autoReturnTimer = setTimeout(() => {
          flipToFront();
        }, CONFIG.flip.autoReturnDelay);
      }
    });
  }

  function flipToFront() {
    if (!state.isFlipped || state.isAnimating) {
      return;
    }

    clearAutoReturnTimer();

    state.isFlipped = false;
    state.isAnimating = true;

    gsap.to(elements.cardInner, {
      rotateY: 0,
      duration: CONFIG.flip.duration,
      ease: 'power2.inOut',
      transformPerspective: 1000,
      transformOrigin: '50% 50%',
      onComplete: () => {
        state.isAnimating = false;
        // Reinitialize Atropos after flip back
        setTimeout(() => {
          initAtropos();
        }, 100);
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
      // Escape returns to front
      if (e.code === 'Escape' && state.isFlipped && !state.isAnimating) {
        e.preventDefault();
        flipToFront();
      }
    });
  }

  // =========================================
  // Initialization
  // =========================================
  function cacheElements() {
    elements.particlesBg = document.getElementById('particles-bg');
    elements.cardScene = document.getElementById('card-scene');
    elements.cardAtropos = document.getElementById('card-atropos');
    elements.cardInner = document.getElementById('card-inner');
    elements.btnFlipToBack = document.getElementById('btn-flip-to-back');
    elements.btnFlipToFront = document.getElementById('btn-flip-to-front');
  }

  function init() {
    cacheElements();

    state.prefersReducedMotion = checkReducedMotion();

    // Initialize particles
    initParticles();

    // Initialize keyboard navigation
    initKeyboardNav();

    // Start entry animation
    setTimeout(() => {
      playEntryAnimation();
    }, 100);

    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearAutoReturnTimer();
      }
    });
  }

  // =========================================
  // Start
  // =========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
