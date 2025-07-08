
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-medical-light/30 to-cream">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from students, teachers, and staff who have experienced our healthcare services
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Rashida Sultana",
              role: "CSE Student",
              content: "The medical center has been a lifesaver during my studies. Quick appointments and caring doctors make all the difference.",
              rating: 5
            },
            {
              name: "Dr. Mohammad Rahman",
              role: "Faculty Member",
              content: "As a faculty member, I appreciate the professionalism and dedication of the medical staff. Excellent service for our community.",
              rating: 5
            },
            {
              name: "Ahmed Hasan",
              role: "EEE Student",
              content: "Free healthcare with no compromise on quality. The doctors are knowledgeable and always ready to help.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-medical-accent/20"
            >
              <Quote className="w-8 h-8 text-medical-medium mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed text-lg">"{testimonial.content}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-medical-medium text-sm">{testimonial.role}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
