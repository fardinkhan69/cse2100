
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const FooterCTA = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-r from-medical-dark to-medical-medium text-white">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Take Care of Your Health?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Book your appointment today and experience quality healthcare services at RUET Medical Center.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-medical-dark hover:bg-gray-100 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
              onClick={() => {
                const doctorsSection = document.getElementById('doctors');
                doctorsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Calendar className="mr-3 h-6 w-6" />
              Book Your Appointment Now
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCTA;
