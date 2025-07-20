/**
 * Footer Component for RUET Medical Center
 * 
 * A modern, professional footer with:
 * - RUET Medical Center branding and logo
 * - Contact information and quick navigation
 * - Social media links and legal information
 * - Smooth animations using Framer Motion
 * - Responsive design for all devices
 * - Medical theme color scheme
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Shield,
  Award,
  Users,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconHoverVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Navigation links
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/#doctors' },
    { name: 'Services', path: '/#services' },
    { name: 'About Us', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
    { name: 'Book Appointment', path: '/doctor-dashboard' }
  ];

  // Services links
  const services = [
    'General Medicine',
    'Cardiology',
    'Pediatrics',
    'Gynecology',
    'Orthopedics',
    'Emergency Care'
  ];

  // Social media links
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const handleNavigation = (path: string) => {
    if (path.startsWith('/#')) {
      // Handle anchor links
      const element = document.querySelector(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      // In a real app, this would send the email to a backend service
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gradient-to-br from-medical-dark via-medical-medium to-medical-dark text-white relative overflow-hidden">
      {/* Emergency Contact Bar */}
      <motion.div
        className="bg-red-600/90 backdrop-blur-sm py-3 px-4 text-center border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-semibold text-white">Emergency Hotline:</span>
          </div>
          <a
            href="tel:0721-750742-3/111"
            className="text-white font-bold text-xl sm:text-lg hover:text-red-200 transition-colors duration-200"
          >
            0721-750742-3/111
          </a>
          <span className="text-white/80 text-xs sm:text-sm">Available 24/7</span>
        </div>
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-16 h-16 border border-white/20 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Newsletter Subscription Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-white/20"
        >
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Health Tips
            </h3>
            <p className="text-white/90 mb-8 leading-relaxed">
              Subscribe to our newsletter for the latest health tips, medical updates,
              and important announcements from RUET Medical Center.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:border-white/50 h-12"
                required
              />
              <Button
                type="submit"
                className="bg-white text-medical-dark hover:bg-white/90 font-semibold px-8 h-12 whitespace-nowrap"
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>

            {isSubscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-300 text-sm mt-4"
              >
                ✓ Thank you for subscribing! You'll receive our latest updates.
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Stethoscope className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">RUET Medical Center</h3>
                <p className="text-sm text-white/80">Healthcare Excellence</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed mb-6">
              Providing comprehensive healthcare services to the RUET community with 
              state-of-the-art facilities and experienced medical professionals.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Heart, text: 'Quality Care' },
                { icon: Shield, text: 'Safe & Secure' },
                { icon: Award, text: 'Expert Doctors' },
                { icon: Users, text: 'Community Focus' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-2"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-4 h-4 text-medical-accent" />
                  <span className="text-sm text-white/80">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li
                  key={service}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-white/80 hover:text-white transition-colors duration-200">
                    {service}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
            <div className="space-y-4">
              <motion.div
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-5 h-5 text-medical-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Rajshahi University of Engineering & Technology<br />
                    Kazla, Rajshahi-6204, Bangladesh
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="w-5 h-5 text-medical-accent" />
                <a 
                  href="tel:+8801712345678" 
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  +880 1712-345678
                </a>
              </motion.div>

              <motion.div
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-5 h-5 text-medical-accent" />
                <a 
                  href="mailto:medical@ruet.ac.bd" 
                  className="text-white/90 hover:text-white transition-colors duration-200"
                >
                  medical@ruet.ac.bd
                </a>
              </motion.div>

              <motion.div
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Clock className="w-5 h-5 text-medical-accent mt-0.5" />
                <div>
                  <p className="text-white/90 text-sm">
                    <span className="font-medium">Mon - Fri:</span> 8:00 AM - 6:00 PM<br />
                    <span className="font-medium">Sat - Sun:</span> 9:00 AM - 4:00 PM<br />
                    <span className="font-medium text-red-300">Emergency:</span> 24/7
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold text-white mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                    variants={iconHoverVariants}
                    whileHover="hover"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                © {new Date().getFullYear()} Fardin Khan. All rights reserved.
              </p>
              <p className="text-white/60 text-xs mt-1">
                Developed with ❤️ for the RUET community By Fardin Khan 
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <motion.a
                href="#"
                className="text-white/80 hover:text-white transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="text-white/80 hover:text-white transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                className="text-white/80 hover:text-white transition-colors duration-200"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Medical Disclaimer
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-medical-medium hover:bg-medical-dark text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;
