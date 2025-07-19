import { TestimonialsColumn, Testimonial } from "@/components/ui/testimonials-columns";
import { motion } from "motion/react";

// Medical-themed testimonials with real medical scenarios
const testimonials: Testimonial[] = [
  {
    text: "The RUET Medical Center saved my academic year. Quick diagnosis and treatment for my chronic headaches helped me focus on my studies again.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Fatima Rahman",
    role: "CSE Final Year Student",
  },
  {
    text: "As a faculty member, I'm impressed by the professionalism and care provided. The doctors are knowledgeable and genuinely concerned about our wellbeing.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Dr. Aminul Islam",
    role: "EEE Department Faculty",
  },
  {
    text: "Free healthcare without compromising quality. The medical staff treated my sports injury with expertise and helped me recover quickly.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Rashid Ahmed",
    role: "Mechanical Engineering Student",
  },
  {
    text: "The preventive health checkups helped detect my vitamin deficiency early. The doctors' guidance on nutrition has improved my overall health significantly.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Sadia Sultana",
    role: "Architecture Department Student",
  },
  {
    text: "Emergency care during my allergic reaction was prompt and professional. The medical team's quick response prevented a serious situation.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Mohammad Hasan",
    role: "Civil Engineering Student",
  },
  {
    text: "Mental health support during exam stress was invaluable. The counseling services helped me develop better coping strategies for academic pressure.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Nusrat Jahan",
    role: "Chemical Engineering Student",
  },
  {
    text: "Regular health monitoring for my diabetes has been excellent. The medical center's care has helped me maintain stable blood sugar levels throughout my studies.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Karim Uddin",
    role: "Electrical Engineering Faculty",
  },
  {
    text: "The vaccination program and health education sessions have been incredibly helpful. The medical team truly cares about preventive healthcare.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    name: "Taslima Akter",
    role: "Administrative Staff",
  },
  {
    text: "Treatment for my respiratory issues was thorough and effective. The doctors took time to explain my condition and provided comprehensive care.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    name: "Sabbir Rahman",
    role: "Industrial Engineering Student",
  },
];

// Split testimonials into three columns for better visual distribution
const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const ModernTestimonialsSection = () => {
  return (
    <section className="bg-gradient-to-br from-medical-light/30 to-cream py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-medical-medium/5 via-transparent to-medical-accent/5"></div>
      </div>
      
      <div className="container z-10 mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="border border-medical-medium/20 bg-medical-light/50 py-2 px-6 rounded-full">
              <span className="text-medical-medium font-medium">Patient Testimonials</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center text-gray-900 mb-6">
            Healing Stories from Our Community
          </h2>
          <p className="text-center text-lg text-gray-600 leading-relaxed">
            Real experiences from RUET students, faculty, and staff who have received care at our medical center.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn 
            testimonials={firstColumn} 
            duration={15} 
            className="hidden sm:block"
          />
          <TestimonialsColumn 
            testimonials={secondColumn} 
            duration={19} 
          />
          <TestimonialsColumn 
            testimonials={thirdColumn} 
            className="hidden lg:block" 
            duration={17} 
          />
        </div>
      </div>
    </section>
  );
};

export default ModernTestimonialsSection;
