import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiGit,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiGraphql,
  SiPython,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa'

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const skillCategories = [
    {
      title: 'Frontend',
      color: 'from-cyber-blue to-cyan-400',
      skills: [
        { name: 'React', icon: SiReact, level: 95 },
        { name: 'TypeScript', icon: SiTypescript, level: 90 },
        { name: 'JavaScript', icon: SiJavascript, level: 95 },
        { name: 'Next.js', icon: SiNextdotjs, level: 85 },
        { name: 'TailwindCSS', icon: SiTailwindcss, level: 90 },
        { name: 'Vite', icon: SiVite, level: 85 },
      ],
    },
    {
      title: 'Backend',
      color: 'from-cyber-purple to-purple-400',
      skills: [
        { name: 'Node.js', icon: SiNodedotjs, level: 90 },
        { name: 'Express', icon: SiExpress, level: 88 },
        { name: 'GraphQL', icon: SiGraphql, level: 80 },
        { name: 'Python', icon: SiPython, level: 75 },
      ],
    },
    {
      title: 'Database & Tools',
      color: 'from-cyber-pink to-pink-400',
      skills: [
        { name: 'MongoDB', icon: SiMongodb, level: 88 },
        { name: 'PostgreSQL', icon: SiPostgresql, level: 85 },
        { name: 'Redis', icon: SiRedis, level: 80 },
        { name: 'Docker', icon: SiDocker, level: 82 },
        { name: 'Git', icon: SiGit, level: 92 },
        { name: 'AWS', icon: FaAws, level: 75 },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="skills" className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Skills & Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="bg-cyber-darker/30 backdrop-blur-sm border border-cyber-blue/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className={`h-1 w-12 bg-gradient-to-r ${category.color} rounded-full`} />
                <h3 className="text-3xl font-bold text-white">{category.title}</h3>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    variants={itemVariants}
                    className="group relative"
                  >
                    {/* Skill header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-br ${category.color} bg-opacity-10 rounded-lg group-hover:scale-110 transition-transform`}>
                          <skill.icon className="text-2xl text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-200">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-cyber-blue">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-cyber-dark/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${category.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{
                          duration: 1,
                          delay: categoryIndex * 0.2 + skillIndex * 0.1,
                          ease: 'easeOut',
                        }}
                      >
                        {/* Animated glow */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto"
        >
          {[
            { number: '5+', label: 'Years Experience' },
            { number: '50+', label: 'Projects Completed' },
            { number: '30+', label: 'Happy Clients' },
            { number: '100%', label: 'Commitment' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-cyber-darker/30 backdrop-blur-sm border border-cyber-blue/20 rounded-xl p-6 text-center hover:border-cyber-purple/50 transition-all"
              whileHover={{ y: -5, scale: 1.05 }}
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
