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
    animation: {
      entryDuration: 1.5,
      entryDelay: 0.1
    }
  };

  // =========================================
  // State
  // =========================================
  const state = {
    atroposInstance: null,
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
            value: { min: 0.4, max: 0.8 }
          },
          size: {
            value: { min: 2, max: 4 }
          },
          links: {
            enable: true,
            distance: linksDistance,
            color: '#6F42C1',
            opacity: 0.5,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
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
                opacity: 0.8,
                color: '#00FF85'
              }
            },
            push: {
              quantity: 2
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
        y: 100,
        scale: 0.8,
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
        activeOffset: 40,
        shadowScale: 1.05,
        rotateXMax: 10,
        rotateYMax: 10,
        shadow: true,
        highlight: true,
        duration: 300
      });
    } catch (error) {
      console.warn('Failed to initialize Atropos:', error);
    }
  }

  // =========================================
  // Initialization
  // =========================================
  function cacheElements() {
    elements.particlesBg = document.getElementById('particles-bg');
    elements.cardScene = document.getElementById('card-scene');
    elements.cardAtropos = document.getElementById('card-atropos');
  }

  function init() {
    cacheElements();

    state.prefersReducedMotion = checkReducedMotion();

    // Initialize particles
    initParticles();

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
