// Testimonials Component for Social Proof
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  projectType: string;
  avatar?: string;
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc",
      rating: 5,
      text: "Exceptional work! The website exceeded our expectations. Fast delivery, clean code, and great communication throughout the project. Highly recommend!",
      projectType: "Corporate Website"
    },
    {
      name: "Michael Chen",
      role: "Founder",
      company: "E-Commerce Startup",
      rating: 5,
      text: "Delivered a fully functional e-commerce platform in just 2 weeks. The admin panel is intuitive and the site loads incredibly fast. Worth every penny!",
      projectType: "E-Commerce Platform"
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "Digital Agency",
      rating: 5,
      text: "Professional, responsive, and skilled. Fixed all our issues and implemented new features perfectly. Will definitely work with again!",
      projectType: "Web Application"
    },
    {
      name: "David Thompson",
      role: "CEO",
      company: "Local Business",
      rating: 5,
      text: "Great experience from start to finish. The landing page is beautiful, mobile-friendly, and our conversion rate increased by 40% after launch!",
      projectType: "Landing Page"
    },
    {
      name: "Lisa Anderson",
      role: "Operations Manager",
      company: "SaaS Company",
      rating: 5,
      text: "Impressive technical skills and attention to detail. Integrated our API seamlessly and delivered ahead of schedule. Couldn't ask for more!",
      projectType: "API Integration"
    },
    {
      name: "James Wilson",
      role: "Entrepreneur",
      company: "Portfolio Client",
      rating: 5,
      text: "Best developer I've worked with on Fiverr! Clear communication, fast responses, and delivered exactly what I needed. 5 stars all the way!",
      projectType: "Portfolio Website"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <span className="text-blue-400 font-semibold flex items-center gap-2 justify-center">
                <Star className="w-4 h-4 fill-blue-400" />
                Sample Reviews
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Building My Reputation</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              These are sample testimonials. Real client reviews coming soon as I complete projects!
            </p>
          </div>
        </ScrollReveal>

        {/* Overall Stats */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-8 justify-center mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-3xl font-bold">5.0</div>
            <div className="text-sm text-gray-500 mt-1">Target Rating</div>
            <div className="text-xs text-gray-600">(Building portfolio)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">0+</div>
            <div className="text-sm text-gray-500 mt-1">Projects Completed</div>
            <div className="text-xs text-gray-600">(Starting fresh)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">100%</div>
            <div className="text-sm text-gray-500 mt-1">Commitment Goal</div>
            <div className="text-xs text-gray-600">(Quality first)</div>
          </div>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }
                }
              }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all relative"
            >
              {/* Sample Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                Sample
              </div>
              
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-blue-400/30 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Project Type Badge */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project Type</div>
                <div className="text-sm text-blue-400 font-medium">{testimonial.projectType}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 bg-slate-900/50 border border-blue-500/30 rounded-xl p-6 max-w-3xl mx-auto">
          <p className="text-center text-gray-400 mb-2">
            <span className="text-blue-400 font-semibold">Note:</span> The testimonials above are sample reviews representing the quality of service I aim to provide.
          </p>
          <p className="text-center text-gray-500 text-sm">
            Real client reviews will be added here as I complete projects. Be among my first clients!
          </p>
          </div>
        </ScrollReveal>
        
        {/* Fiverr Reviews CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Ready to work together?
          </p>
          <motion.a
            href="https://www.fiverr.com/s/6YroEYL"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30"
          >
            <Star className="w-5 h-5 fill-white" />
            Hire Me on Fiverr
          </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
