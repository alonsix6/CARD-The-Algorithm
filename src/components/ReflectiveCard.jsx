import { useEffect, useRef } from 'react';
import './ReflectiveCard.css';
import { Zap, BarChart3, FileText, Target, Play } from 'lucide-react';

const ReflectiveCard = ({
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = '',
  style = {}
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  };

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      {/* Video wrapper for proper clipping on mobile */}
      <div className="reflective-video-wrapper">
        <video ref={videoRef} autoPlay playsInline muted className="reflective-video" />
      </div>

      {/* Texture layers in front of camera */}
      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <Zap size={14} className="security-icon" />
            <span>DATA INTELLIGENCE</span>
          </div>
          <BarChart3 className="status-icon" size={20} />
        </div>

        <div className="card-body">
          <div className="brand-info">
            <h1 className="brand-title">THE ALGORITHM</h1>
            <p className="brand-subtitle">Data & Market Intelligence</p>
          </div>

          <div className="cta-buttons">
            <a
              href="https://www.notion.so/2e7f63b5a985816bbe27cf3bf3218dc8"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              <FileText size={16} />
              <span>Leer el articulo</span>
            </a>
            <a
              href="https://diagnostico-data-reset.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              <Target size={16} />
              <span>Hacer el diagnostico</span>
            </a>
            <a
              href="https://reset-the-algorithm.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
            >
              <Play size={16} />
              <span>Ver la demo</span>
            </a>
          </div>
        </div>

        <div className="card-footer">
          <div className="powered-section">
            <span className="label">POWERED BY</span>
            <span className="value">THE LAB</span>
          </div>
          <div className="logo-section">
            <div className="logo-badge reset">R</div>
            <div className="logo-badge lab">L</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;
