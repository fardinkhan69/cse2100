import { motion } from "motion/react";
import { Award, Heart, Shield, Users, Clock, Stethoscope } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Our medical team provides empathetic, patient-centered healthcare with genuine concern for your wellbeing."
    },
    {
      icon: Award,
      title: "Excellence in Medicine",
      description: "Board-certified physicians with years of experience delivering the highest quality medical care."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "State-of-the-art facilities and rigorous safety protocols ensure your health and peace of mind."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Dedicated to serving the RUET community with accessible, comprehensive healthcare services."
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-white to-medical-light/10">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Stethoscope className="h-8 w-8 text-medical-medium" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              About RUET Medical Center
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At RUET Medical Center, we are committed to providing exceptional healthcare services 
            to the RUET community. Our state-of-the-art facility combines modern medical technology 
            with compassionate care to ensure the best possible health outcomes for our patients.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-medical-medium to-medical-dark rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-medical-medium to-medical-dark text-white rounded-3xl p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Patients Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Medical Specialists</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Emergency Care</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;