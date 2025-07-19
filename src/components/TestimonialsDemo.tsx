// Demo component showing how to use TestimonialsColumn independently
import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-columns";
import { motion } from "motion/react";

const sampleTestimonials: Testimonial[] = [
  {
    text: "This medical center has transformed our healthcare experience. Professional, caring, and always available when we need them most.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Ahmed",
    role: "Student",
  },
  {
    text: "The quality of care and attention to detail is exceptional. I feel confident knowing our health is in such capable hands.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Dr. Rahman",
    role: "Faculty",
  },
  {
    text: "Quick, efficient, and compassionate care. The medical team goes above and beyond to ensure our wellbeing.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Ahmed Hassan",
    role: "Staff",
  },
];

const TestimonialsDemo = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-medical-light/20 to-cream">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Testimonials Demo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Example of how to use the TestimonialsColumn component with custom data
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="max-h-[500px] overflow-hidden">
            <TestimonialsColumn 
              testimonials={sampleTestimonials} 
              duration={12}
              className="max-w-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsDemo;
