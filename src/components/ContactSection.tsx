import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["RUET Medical Center", "Rajshahi University of Engineering & Technology", "Kazla, Rajshahi-6204, Bangladesh"],
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+880 721-750115", "+880 721-750116", "Emergency: +880 721-750117"],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@ruetmedical.ac.bd", "appointments@ruetmedical.ac.bd", "emergency@ruetmedical.ac.bd"],
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Emergency: 24/7"],
      action: "View Schedule"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-white to-medical-light/5">
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
            Get in 
            <span className="bg-gradient-to-r from-medical-medium to-medical-dark bg-clip-text text-transparent ml-3">
              Touch
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions or need assistance? We're here to help. Contact us through any of the following methods.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-medical-medium to-medical-dark rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <contact.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{contact.title}</h3>
              
              <div className="space-y-2 mb-6">
                {contact.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                    {detail}
                  </p>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-medical-medium text-medical-medium hover:bg-medical-medium hover:text-white transition-all duration-300"
              >
                {contact.action}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-medical-medium to-medical-dark rounded-3xl p-12 text-white text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Navigation className="h-8 w-8" />
            <h3 className="text-3xl font-bold">Find Us on Campus</h3>
          </div>
          
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Located in the heart of RUET campus, our medical center is easily accessible 
            from all dormitories and academic buildings.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="w-full h-64 bg-white/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-70" />
                <p className="text-lg opacity-80">Interactive Map Coming Soon</p>
                <p className="text-sm opacity-60 mt-2">
                  Visit us at the RUET Medical Center building
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;