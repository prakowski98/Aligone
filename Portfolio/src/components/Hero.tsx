import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaCode, FaRocket, FaLaptopCode } from 'react-icons/fa'

const Hero = () => {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)

  const roles = [
    'Full-Stack Developer',
    'React Specialist',
    'TypeScript Expert',
    'UI/UX Enthusiast',
    'Problem Solver'
  ]

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length
      const fullText = roles[i]

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? 50 : 150)

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed, roles])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full px-6 py-2 mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-green"></span>
            </span>
            <span className="text-cyber-green font-mono text-sm">Available for work</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="block text-gray-300">Hi, I'm</span>
            <span className="glitch gradient-text block" data-text="Developer">
              Developer
            </span>
          </motion.h1>

          {/* Typing Effect */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl md:text-4xl font-mono text-cyber-blue">
              {text}
              <span className="cursor-blink text-cyber-purple">|</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Crafting elegant solutions with code. Passionate about building
            exceptional digital experiences that merge creativity with
            functionality.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={scrollToProjects}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg font-semibold overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <FaRocket />
                View My Work
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.a
              href="#contact"
              className="px-8 py-4 border-2 border-cyber-blue text-cyber-blue rounded-lg font-semibold hover:bg-cyber-blue/10 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLaptopCode />
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Tech Icons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-8 mt-16"
          >
            {[FaCode, FaRocket, FaLaptopCode].map((Icon, index) => (
              <motion.div
                key={index}
                className="text-cyber-blue/50"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                <Icon size={40} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyber-blue rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-2 bg-cyber-blue rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
