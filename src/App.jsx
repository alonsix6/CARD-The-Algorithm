import ReflectiveCard from './components/ReflectiveCard'
import Particles from './components/Particles'

function App() {
  return (
    <div className="app-container">
      {/* OGL Particles Background */}
      <Particles
        particleColors={['#6F42C1', '#00FF85', '#9B59B6', '#2ECC71']}
        particleCount={150}
        particleSpread={10}
        speed={0.08}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        particleHoverFactor={1}
        alphaParticles={true}
        sizeRandomness={0.8}
        disableRotation={false}
        pixelRatio={Math.min(window.devicePixelRatio, 2)}
      />

      {/* Reflective Card */}
      <ReflectiveCard
        overlayColor="rgba(0, 0, 0, 0.25)"
        blurStrength={18}
        glassDistortion={25}
        metalness={0.9}
        roughness={0.5}
        displacementStrength={15}
        noiseScale={1.2}
        specularConstant={4}
        grayscale={0.3}
        color="#ffffff"
      />
    </div>
  )
}

export default App
