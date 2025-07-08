
import { motion } from "motion/react";
import { Stethoscope, Heart, BookOpen, Shield } from "lucide-react";

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-4 bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive medical services available 24/7 for the entire RUET community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { icon: Stethoscope, title: "General Consultation", description: "Regular check-ups and health assessments" },
            { icon: Heart, title: "Emergency Care", description: "24/7 emergency medical services" },
            { icon: BookOpen, title: "Health Education", description: "Workshops on health and wellness" },
            { icon: Shield, title: "Preventive Care", description: "Vaccination and health screening programs" }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-gradient-to-br from-medical-light to-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-medical-accent/20"
            >
              <service.icon className="w-12 h-12 text-medical-medium mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
