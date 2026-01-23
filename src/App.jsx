import ReflectiveCard from './components/ReflectiveCard'

function App() {
  return (
    <div className="app-container">
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
