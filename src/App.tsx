import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import ToolsSection from './components/sections/ToolsSection'

function App() {
  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <HeroSection />
      <AboutSection />
      <ToolsSection />
    </div>
  )
}

export default App
