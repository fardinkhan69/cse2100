import { motion } from "motion/react";
import { Building2, Microscope, Zap, Wifi, Car, Coffee } from "lucide-react";

const FacilitiesSection = () => {
  const facilities = [
    {
      icon: Building2,
      title: "Modern Infrastructure",
      description: "State-of-the-art medical facility with the latest technology and comfortable patient areas.",
      image: "🏥"
    },
    {
      icon: Microscope,
      title: "Advanced Laboratory",
      description: "Fully equipped diagnostic laboratory for comprehensive testing and analysis.",
      image: "🔬"
    },
    {
      icon: Zap,
      title: "Emergency Services",
      description: "24/7 emergency care with rapid response team and critical care facilities.",
      image: "⚡"
    },
    {
      icon: Wifi,
      title: "Digital Health Records",
      description: "Secure, digital patient records system for seamless care coordination.",
      image: "💻"
    },
    {
      icon: Car,
      title: "Convenient Parking",
      description: "Ample parking space available for patients and visitors.",
      image: "🚗"
    },
    {
      icon: Coffee,
      title: "Patient Comfort",
      description: "Comfortable waiting areas with refreshment facilities for patients and families.",
      image: "☕"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-cream to-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            World-Class 
            <span className="bg-gradient-to-r from-medical-medium to-medical-dark bg-clip-text text-transparent ml-3">
              Facilities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our medical center is equipped with cutting-edge technology and modern amenities 
            to provide you with the best possible healthcare experience.
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden relative"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-medical-light/20 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-medical-light to-medical-medium rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <facility.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl">{facility.image}</div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-medical-medium transition-colors">
                  {facility.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-medical-medium to-medical-dark text-white rounded-3xl p-12">
            <h3 className="text-3xl font-bold mb-4">
              Experience Healthcare Excellence
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Visit our facility and experience the difference that modern healthcare technology 
              and compassionate care can make in your health journey.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-medical-dark px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              onClick={() => {
                const doctorsSection = document.getElementById('doctors');
                doctorsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Schedule a Visit
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacilitiesSection;