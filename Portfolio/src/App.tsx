import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import MatrixRain from './components/MatrixRain'
import Navigation from './components/Navigation'
import './App.css'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Cursor Glow Effect */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.4) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyber-blue/20 bg-cyber-darker/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 <span className="gradient-text font-semibold">Your Portfolio</span>.
            Crafted with passion and code.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Made with React, TypeScript, Tailwind CSS & Framer Motion
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
