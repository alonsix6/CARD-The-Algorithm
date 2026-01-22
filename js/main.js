/* =========================================
   THE ALGORITHM CARD - Main JavaScript
   Reset Agency - The Lab
   Apple Glassmorphism + Flip Card
   ========================================= */

(function () {
  'use strict';

  // =========================================
  // Configuration
  // =========================================
  const CONFIG = {
    particles: {
      desktop: 60,
      mobile: 30,
      linksDistance: {
        desktop: 150,
        mobile: 100
      }
    },
    animation: {
      entryDuration: 1.2,
      entryDelay: 0.2,
      flipDuration: 0.8
    }
  };

  // =========================================
  // State
  // =========================================
  const state = {
    atroposInstance: null,
    prefersReducedMotion: false,
    isFlipped: false,
    isAnimating: false
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
          zIndex: 0
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
            color: '#6F42C1',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'bounce'
            }
          }
        },
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: {
              enable: true,
              mode: 'grab'
            },
            onClick: {
              enable: true,
              mode: 'push'
            }
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.7,
                color: '#00FF85'
              }
            },
            push: {
              quantity: 3
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

    if (reducedMotion) {
      gsap.set(elements.cardScene, {
        y: 0,
        scale: 1,
        opacity: 1
      });
      initAtropos();
      return;
    }

    gsap.fromTo(
      elements.cardScene,
      {
        y: 80,
        scale: 0.9,
        opacity: 0
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: CONFIG.animation.entryDuration,
        ease: 'power3.out',
        delay: CONFIG.animation.entryDelay,
        onComplete: () => {
          initAtropos();
        }
      }
    );
  }

  // =========================================
  // Atropos (3D Tilt)
  // =========================================
  function initAtropos() {
    if (state.atroposInstance) {
      return;
    }

    try {
      state.atroposInstance = Atropos({
        el: elements.cardAtropos,
        activeOffset: 50,
        shadowScale: 1.05,
        rotateXMax: 12,
        rotateYMax: 12,
        shadow: true,
        highlight: true,
        duration: 400
      });
    } catch (error) {
      console.warn('Failed to initialize Atropos:', error);
    }
  }

  function pauseAtropos() {
    if (state.atroposInstance) {
      // Reset tilt to neutral position
      const rotateEl = elements.cardAtropos.querySelector('.atropos-rotate');
      if (rotateEl) {
        gsap.to(rotateEl, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }

  // =========================================
  // Flip Card Animation (Apple-style)
  // =========================================
  function flipCard(toBack = true) {
    if (state.isAnimating) return;
    if (state.isFlipped === toBack) return;

    state.isAnimating = true;

    // Pause Atropos during flip
    pauseAtropos();

    const targetRotation = toBack ? 180 : 0;

    gsap.to(elements.cardFlipper, {
      rotateY: targetRotation,
      duration: CONFIG.animation.flipDuration,
      ease: 'power2.inOut',
      onComplete: () => {
        state.isFlipped = toBack;
        state.isAnimating = false;
      }
    });
  }

  // =========================================
  // Event Handlers
  // =========================================
  function setupFlipButtons() {
    // Flip to back (info button)
    const flipToBackBtn = document.getElementById('flip-to-back');
    if (flipToBackBtn) {
      flipToBackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipCard(true);
      });
    }

    // Flip to front (close button)
    const flipToFrontBtn = document.getElementById('flip-to-front');
    if (flipToFrontBtn) {
      flipToFrontBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipCard(false);
      });
    }
  }

  // =========================================
  // Initialization
  // =========================================
  function cacheElements() {
    elements.particlesBg = document.getElementById('particles-bg');
    elements.cardScene = document.getElementById('card-scene');
    elements.cardFlipper = document.getElementById('card-flipper');
    elements.cardAtropos = document.getElementById('card-atropos');
  }

  function init() {
    cacheElements();

    state.prefersReducedMotion = checkReducedMotion();

    // Initialize particles
    initParticles();

    // Setup flip buttons
    setupFlipButtons();

    // Start entry animation
    playEntryAnimation();
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
