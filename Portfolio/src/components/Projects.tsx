import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss, SiMongodb, SiPostgresql } from 'react-icons/si'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const projects = [
    {
      title: 'Aligone Marketplace',
      description: 'Complete auction marketplace platform similar to Allegro. Features include user authentication, real-time bidding, product categories, shopping cart, and secure payment processing.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=500&fit=crop',
      tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
      icons: [FaReact, SiTypescript, FaNodeJs, SiMongodb],
      github: 'https://github.com/yourusername/aligone',
      demo: '#',
      featured: true,
    },
    {
      title: 'E-Commerce Dashboard',
      description: 'Comprehensive admin dashboard for managing online stores. Real-time analytics, inventory management, order tracking, and customer insights.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      tags: ['React', 'TypeScript', 'TailwindCSS', 'PostgreSQL'],
      icons: [FaReact, SiTypescript, SiTailwindcss, SiPostgresql],
      github: 'https://github.com',
      demo: '#',
      featured: true,
    },
    {
      title: 'Task Management System',
      description: 'Collaborative task management tool with real-time updates, team workspaces, kanban boards, and productivity analytics.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=500&fit=crop',
      tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      icons: [FaReact, FaNodeJs, FaDatabase, SiMongodb],
      github: 'https://github.com',
      demo: '#',
      featured: false,
    },
    {
      title: 'Weather Forecast App',
      description: 'Beautiful weather application with location-based forecasts, interactive maps, weather alerts, and detailed meteorological data.',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=500&fit=crop',
      tags: ['React', 'TypeScript', 'API Integration', 'TailwindCSS'],
      icons: [FaReact, SiTypescript, SiTailwindcss],
      github: 'https://github.com',
      demo: '#',
      featured: false,
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
    <section id="projects" className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-pink/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-cyber-green/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A showcase of my recent work and personal projects that I'm proud of
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group relative bg-cyber-darker/30 backdrop-blur-sm border border-cyber-blue/20 rounded-xl overflow-hidden hover:border-cyber-purple/50 transition-all duration-300 ${
                project.featured ? 'lg:col-span-2' : ''
              }`}
              whileHover={{ y: -5 }}
            >
              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-cyber-blue to-cyber-purple px-4 py-2 rounded-full text-sm font-bold">
                  Featured
                </div>
              )}

              <div className={`grid ${project.featured ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {/* Project Image */}
                <div className="relative h-64 md:h-full overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker via-transparent to-transparent opacity-60" />

                  {/* Tech icons overlay */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {project.icons.map((Icon, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-cyber-dark/80 backdrop-blur-sm rounded-lg border border-cyber-blue/30"
                      >
                        <Icon className="text-xl text-cyber-blue" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-3 gradient-text">{project.title}</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-sm text-cyber-blue font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyber-dark/50 border border-cyber-blue/30 rounded-lg hover:bg-cyber-blue/10 hover:border-cyber-blue transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGithub />
                      <span className="font-semibold">Code</span>
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/0 via-cyber-purple/5 to-cyber-pink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* View more button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cyber-blue text-cyber-blue rounded-lg font-semibold hover:bg-cyber-blue/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub size={20} />
            View More on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
