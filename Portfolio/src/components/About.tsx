import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaTerminal, FaDatabase, FaReact, FaServer } from 'react-icons/fa'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: FaReact,
      title: 'Frontend Development',
      description: 'Building responsive and interactive UIs with React, TypeScript, and modern CSS frameworks.',
    },
    {
      icon: FaServer,
      title: 'Backend Engineering',
      description: 'Designing scalable APIs and services with Node.js, Express, and microservices architecture.',
    },
    {
      icon: FaDatabase,
      title: 'Database Design',
      description: 'Architecting efficient data models with SQL and NoSQL databases for optimal performance.',
    },
    {
      icon: FaTerminal,
      title: 'DevOps & CI/CD',
      description: 'Automating deployment pipelines and maintaining cloud infrastructure for seamless delivery.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="about" className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background gradient orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate full-stack developer with a love for creating
            innovative solutions. My journey in tech has been driven by
            curiosity and the constant desire to learn and grow.
          </p>
        </motion.div>

        {/* Terminal-style bio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-cyber-darker/50 backdrop-blur-sm border border-cyber-blue/30 rounded-lg overflow-hidden">
            {/* Terminal header */}
            <div className="bg-cyber-dark/80 px-4 py-2 flex items-center gap-2 border-b border-cyber-blue/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-400 font-mono ml-2">~/about-me</span>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono text-sm">
              <div className="space-y-2">
                <p className="text-cyber-green">
                  <span className="text-cyber-blue">$</span> cat about.txt
                </p>
                <div className="text-gray-300 pl-4 space-y-2">
                  <p>
                    <span className="text-cyber-purple">const</span>{' '}
                    <span className="text-cyber-blue">developer</span> = {'{'}
                  </p>
                  <p className="pl-4">
                    name: <span className="text-cyber-green">"Your Name"</span>,
                  </p>
                  <p className="pl-4">
                    role: <span className="text-cyber-green">"Full-Stack Developer"</span>,
                  </p>
                  <p className="pl-4">
                    location: <span className="text-cyber-green">"Earth 🌍"</span>,
                  </p>
                  <p className="pl-4">
                    passion: <span className="text-cyber-green">"Building amazing things"</span>,
                  </p>
                  <p className="pl-4">
                    experience:{' '}
                    <span className="text-cyber-pink">[</span>
                    <span className="text-cyber-green">"Web Development"</span>,{' '}
                    <span className="text-cyber-green">"E-commerce"</span>,{' '}
                    <span className="text-cyber-green">"API Design"</span>
                    <span className="text-cyber-pink">]</span>,
                  </p>
                  <p className="pl-4">
                    learning: <span className="text-cyber-green">"Always"</span>
                  </p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-cyber-darker/30 backdrop-blur-sm border border-cyber-blue/20 rounded-xl p-6 hover:border-cyber-purple/50 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/0 via-cyber-purple/5 to-cyber-pink/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="inline-flex p-3 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-3xl text-cyber-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2 gradient-text">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyber-blue/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
