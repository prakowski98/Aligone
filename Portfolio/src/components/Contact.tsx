import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaEnvelope, FaLinkedin, FaGithub, FaTwitter, FaPaperPlane } from 'react-icons/fa'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', message: '' })
    }, 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'your@email.com',
      link: 'mailto:your@email.com',
      color: 'from-cyber-blue to-cyan-400',
    },
    {
      icon: FaLinkedin,
      title: 'LinkedIn',
      value: 'linkedin.com/in/yourprofile',
      link: 'https://linkedin.com',
      color: 'from-cyber-purple to-purple-400',
    },
    {
      icon: FaGithub,
      title: 'GitHub',
      value: 'github.com/yourusername',
      link: 'https://github.com',
      color: 'from-cyber-pink to-pink-400',
    },
    {
      icon: FaTwitter,
      title: 'Twitter',
      value: '@yourusername',
      link: 'https://twitter.com',
      color: 'from-cyber-green to-green-400',
    },
  ]

  return (
    <section id="contact" className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyber-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyber-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto mb-8" />
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? Let's build something amazing together!
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-cyber-darker/30 backdrop-blur-sm border border-cyber-blue/20 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-blue/30 rounded-lg focus:outline-none focus:border-cyber-blue transition-colors text-white placeholder-gray-500"
                  placeholder="Your name"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-blue/30 rounded-lg focus:outline-none focus:border-cyber-blue transition-colors text-white placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border border-cyber-blue/30 rounded-lg focus:outline-none focus:border-cyber-blue transition-colors text-white placeholder-gray-500 resize-none"
                  placeholder="Your message..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-cyber-darker/30 backdrop-blur-sm border border-cyber-blue/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Contact Information</h3>
              <p className="text-gray-400 mb-8">
                Feel free to reach out through any of these platforms. I'm always open to
                discussing new projects, creative ideas, or opportunities.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-cyber-dark/30 border border-cyber-blue/20 rounded-lg hover:border-cyber-purple/50 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className={`p-3 bg-gradient-to-br ${info.color} bg-opacity-10 rounded-lg group-hover:scale-110 transition-transform`}
                    >
                      <info.icon className="text-2xl text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.title}</div>
                      <div className="text-white font-semibold">{info.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Card */}
            <motion.div
              className="bg-gradient-to-br from-cyber-blue/10 to-cyber-purple/10 backdrop-blur-sm border border-cyber-blue/30 rounded-xl p-8"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 217, 255, 0.2)',
                  '0 0 40px rgba(181, 55, 242, 0.3)',
                  '0 0 20px rgba(0, 217, 255, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyber-green"></span>
                </span>
                <h4 className="text-xl font-bold text-white">Currently Available</h4>
              </div>
              <p className="text-gray-400">
                I'm currently available for freelance work and full-time opportunities. Let's
                create something extraordinary together!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
