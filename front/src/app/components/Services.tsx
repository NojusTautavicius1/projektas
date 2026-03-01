// Fiverr Service Packages Component
import { motion } from "framer-motion";
import { Check, Star, Clock, Zap, Crown } from "lucide-react";

interface ServicePackage {
  name: string;
  icon: any;
  price: string;
  deliveryTime: string;
  description: string;
  features: string[];
  revisions: string;
  popular?: boolean;
  color: string;
  borderColor: string;
  bgColor: string;
  iconColor: string;
}

export function Services() {
  const packages: ServicePackage[] = [
    {
      name: "Basic",
      icon: Zap,
      price: "$299",
      deliveryTime: "3-5 days",
      description: "Perfect for landing pages and simple websites",
      features: [
        "Single page website or landing page",
        "Responsive design (mobile + desktop)",
        "Contact form integration",
        "Basic SEO optimization",
        "1 revision included",
        "Source code included"
      ],
      revisions: "1 revision",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400"
    },
    {
      name: "Standard",
      icon: Star,
      price: "$799",
      deliveryTime: "7-10 days",
      description: "Full-featured websites with custom functionality",
      features: [
        "Up to 5 pages or sections",
        "Custom design & animations",
        "Database integration (if needed)",
        "Admin panel for content management",
        "API integration",
        "Advanced SEO & performance optimization",
        "3 revisions included",
        "30 days support"
      ],
      revisions: "3 revisions",
      popular: true,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400"
    },
    {
      name: "Premium",
      icon: Crown,
      price: "$1,999",
      deliveryTime: "14-21 days",
      description: "Complete web applications with full-stack features",
      features: [
        "Unlimited pages & sections",
        "Full-stack web application",
        "User authentication & authorization",
        "Payment gateway integration",
        "Real-time features (chat, notifications)",
        "Third-party API integrations",
        "Advanced admin dashboard",
        "Database design & optimization",
        "Unlimited revisions",
        "90 days support & maintenance"
      ],
      revisions: "Unlimited revisions",
      color: "from-yellow-500 to-orange-500",
      borderColor: "border-yellow-500/30",
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-400"
    }
  ];

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
            <span className="text-blue-400 font-semibold">Service Packages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Package</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transparent pricing, fast delivery, and production-ready code. All packages include modern tech stack (React, Node.js, TypeScript).
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-slate-900/50 border ${
                pkg.popular ? "border-purple-500/50 shadow-lg shadow-purple-500/20" : pkg.borderColor
              } rounded-2xl p-8 hover:shadow-2xl transition-all ${
                pkg.popular ? "md:-mt-4 md:scale-105" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl ${pkg.bgColor} flex items-center justify-center mb-6`}>
                <pkg.icon className={`w-8 h-8 ${pkg.iconColor}`} />
              </div>

              {/* Package Name */}
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              
              {/* Price */}
              <div className="mb-4">
                <span className={`text-4xl font-bold bg-gradient-to-r ${pkg.color} bg-clip-text text-transparent`}>
                  {pkg.price}
                </span>
                <span className="text-gray-400 ml-2">starting at</span>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 font-medium">{pkg.deliveryTime} delivery</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 mb-6 min-h-[48px]">{pkg.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full py-3 bg-gradient-to-r ${pkg.color} text-white font-semibold rounded-lg text-center transition-all ${
                  pkg.popular ? "shadow-lg shadow-purple-500/50" : ""
                }`}
              >
                Get Started
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-gray-400">Money-Back Guarantee</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
            <div className="text-gray-400">Communication Available</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">Fast</div>
            <div className="text-gray-400">Express Delivery Available</div>
          </div>
        </div>

        {/* Custom Project CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Need Something Custom?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Have a unique project in mind? Let's discuss your requirements and I'll create a custom package tailored to your needs.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/30"
          >
            Request Custom Quote
          </motion.a>
        </div>
      </div>
    </section>
  );
}
