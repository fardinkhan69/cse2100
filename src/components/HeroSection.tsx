
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Shield, Award, Users, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-medical-accent/30 to-medical-medium/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-medical-medium/25 to-medical-dark/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-medical-accent/20 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Animated Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            Your Health,{" "}
            <motion.span
              className="bg-gradient-to-r from-medical-medium via-medical-accent to-medical-dark bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Our Mission
            </motion.span>
          </h1>
        </motion.div>
        
        {/* Animated Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl md:text-3xl text-gray-700 mb-6 font-medium max-w-3xl mx-auto leading-relaxed"
        >
          Expert medical care for the entire{" "}
          <span className="text-medical-dark font-bold">RUET community</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Serving 10,000+ students, teachers, and staff with free quality healthcare
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {[
            { icon: Heart, text: "Free Healthcare", color: "bg-red-50 text-red-700 border-red-200" },
            { icon: Shield, text: "24/7 Available", color: "bg-green-50 text-green-700 border-green-200" },
            { icon: Award, text: "Expert Doctors", color: "bg-blue-50 text-blue-700 border-blue-200" }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08, y: -4 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${item.color} border-2 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <item.icon className="w-5 h-5" />
              {item.text}
            </motion.div>
          ))}
        </motion.div>
        
        {/* Animated CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-medical-medium to-medical-dark hover:from-medical-dark hover:to-medical-medium text-white px-10 py-5 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl"
              onClick={() => {
                const doctorsSection = document.getElementById('doctors');
                doctorsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Calendar className="mr-3 h-6 w-6" />
              Book Appointment
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline"
              size="lg" 
              className="border-3 border-medical-medium text-medical-dark hover:bg-medical-medium hover:text-white px-10 py-5 text-xl font-bold transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
              onClick={() => navigate('/login')}
            >
              Student Portal
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-wrap justify-center gap-8"
        >
          {[
            { number: "10,000+", label: "Community Members", icon: Users },
            { number: "15+", label: "Expert Doctors", icon: Stethoscope },
            { number: "Free", label: "Healthcare Service", icon: Heart }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, y: -5 }}
              className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-medical-medium mx-auto mb-3" />
              <div className="text-4xl font-bold text-medical-dark mb-2">{stat.number}</div>
              <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
