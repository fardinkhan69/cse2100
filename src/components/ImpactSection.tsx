
import { motion } from "motion/react";
import { Users, Heart, Award } from "lucide-react";

const ImpactSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-r from-medical-medium to-medical-dark text-white">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Healthcare Excellence at RUET
          </h2>
          <p className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed opacity-90">
            For years, we've been providing exceptional medical care to our university community, 
            ensuring every student, teacher, and staff member has access to quality healthcare services completely free of charge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            { 
              icon: Users, 
              title: "Community First", 
              description: "Dedicated to serving every member of the RUET family with personalized care and attention."
            },
            { 
              icon: Heart, 
              title: "Compassionate Care", 
              description: "Our doctors provide not just medical treatment, but emotional support and guidance."
            },
            { 
              icon: Award, 
              title: "Medical Excellence", 
              description: "State-of-the-art facilities and experienced professionals ensuring the best healthcare outcomes."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300"
            >
              <item.icon className="w-16 h-16 mx-auto mb-6 text-medical-accent" />
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-lg opacity-90 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
