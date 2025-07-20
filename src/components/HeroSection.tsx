// import React, { useState } from "react";
// import { motion } from "motion/react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, Play, X, Users, Heart, Shield, Award } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { ShimmerButton } from "@/components/magicui/shimmer-button";

// const HeroSection: React.FC = () => {
//   const navigate = useNavigate();
//   const [isVideoOpen, setIsVideoOpen] = useState(false);

//   return (
//     <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
//         <div className="absolute top-40 right-20 w-48 h-48 bg-blue-700 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">

//           {/* Left Column - Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="space-y-8"
//           >
//             {/* Medical Badge */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 shadow-lg"
//             >
//               <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
//               <span className="text-sm font-semibold text-blue-700">
//                 RUET Medical Center
//               </span>
//             </motion.div>

//             {/* Main Heading */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className="space-y-4"
//             >
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//                 <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
//                   Quality Healthcare
//                 </span>
//                 <br />
//                 <span className="text-gray-900">for Everyone</span>
//               </h1>

//               <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
//                 Serving 10,000+ students, teachers, and staff with free quality healthcare
//               </p>
//             </motion.div>

//             {/* Stats Grid */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="grid grid-cols-2 gap-6"
//             >
//               {[
//                 { icon: Users, label: "Students Served", value: "10,000+" },
//                 { icon: Heart, label: "Success Rate", value: "98%" },
//                 { icon: Shield, label: "Years of Service", value: "15+" },
//                 { icon: Award, label: "Expert Doctors", value: "25+" },
//               ].map((stat, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
//                   className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                       <stat.icon className="h-5 w-5 text-white" />
//                     </div>
//                     <div>
//                       <div className="text-xl font-bold text-gray-900">{stat.value}</div>
//                       <div className="text-xs text-gray-600">{stat.label}</div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="flex flex-col sm:flex-row gap-4"
//             >
//               <motion.div
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <ShimmerButton
//                   className="shadow-xl w-full sm:w-auto"
//                   shimmerColor="#3B82F6"
//                   background="linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(29, 78, 216) 100%)"
//                   shimmerDuration="2.5s"
//                   onClick={() => navigate('/book-appointment')}
//                 >
//                   <span className="flex items-center gap-2 text-white font-semibold px-2">
//                     <Calendar className="h-5 w-5" />
//                     Book Appointment
//                   </span>
//                 </ShimmerButton>
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.02, y: -2 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Button
//                   variant="outline"
//                   size="lg"
//                   onClick={() => navigate('/login')}
//                   className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold w-full sm:w-auto"
//                 >
//                   Student Portal
//                 </Button>
//               </motion.div>
//             </motion.div>
//           </motion.div>

//           {/* Right Column - Hero Image with Video */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="relative"
//           >
//             <div className="relative group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
//               {/* Hero Image */}
//               <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-blue-100 to-blue-200">
//                 <img
//                   src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
//                   alt="Medical professionals providing healthcare"
//                   className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
//                 />

//                 {/* Video Play Button Overlay */}
//                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 group-hover:bg-black/30">
//                   <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ duration: 0.6, delay: 0.8 }}
//                     whileHover={{ scale: 1.1 }}
//                     className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:bg-white transition-colors"
//                   >
//                     <Play className="h-8 w-8 text-blue-600 ml-1" fill="currentColor" />
//                   </motion.div>
//                 </div>

//                 {/* Floating Badge */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 1 }}
//                   className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg"
//                 >
//                   <div className="text-sm font-semibold text-blue-700">Watch Our Story</div>
//                   <div className="text-xs text-gray-600">2 min overview</div>
//                 </motion.div>
//               </div>

//               {/* Decorative Elements */}
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                 className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-20"
//               />
//               <motion.div
//                 animate={{ rotate: -360 }}
//                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//                 className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-600 rounded-full opacity-15"
//               />
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Video Modal */}
//       <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
//         <DialogContent className="max-w-4xl p-0 bg-black border-0">
//           <div className="relative aspect-video">
//             <button
//               onClick={() => setIsVideoOpen(false)}
//               className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
//             >
//               <X className="h-5 w-5 text-white" />
//             </button>

//             {/* Video Placeholder - Replace with actual video */}
//             <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center rounded-lg">
//               <div className="text-center text-white">
//                 <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                 <h3 className="text-xl font-semibold mb-2">RUET Medical Center</h3>
//                 <p className="text-blue-200">Healthcare Excellence Video</p>
//                 <p className="text-sm text-blue-300 mt-2">Video content would be embedded here</p>
//               </div>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Floating Animation Elements */}
//       <motion.div
//         animate={{
//           y: [0, -20, 0],
//           rotate: [0, 5, 0],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="absolute top-1/4 left-8 w-16 h-16 bg-blue-500 rounded-full opacity-10 blur-sm"
//       />

//       <motion.div
//         animate={{
//           y: [0, 15, 0],
//           rotate: [0, -3, 0],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="absolute bottom-1/4 right-12 w-12 h-12 bg-blue-600 rounded-full opacity-10 blur-sm"
//       />
//     </section>
//   );
// };

// export default HeroSection;


import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Heart, Shield, Award, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "../images/fardin-hero.png";
import { ShimmerButton } from "./magicui/shimmer-button";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleAnchorClick = (anchor: string) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-blue-400/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-transparent" />
      </div>

      {/* Subtle Animated Glow */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(600px at 20% 30%, rgb(59 130 246 / 0.05), transparent 50%)",
            "radial-gradient(600px at 80% 70%, rgb(59 130 246 / 0.08), transparent 50%)",
            "radial-gradient(600px at 40% 60%, rgb(59 130 246 / 0.06), transparent 50%)"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.h1
                className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Your Health,{" "}
                <motion.span
                  className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Our Priority
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl"
            >
              Expert medical care for the entire RUET community. Providing
              <span className="text-blue-700 font-semibold"> free, quality healthcare</span> to
              students, faculty, and staff with modern facilities and experienced professionals.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Heart, text: "Free Care" },
                { icon: Shield, text: "24/7 Available" },
                { icon: Award, text: "Expert Doctors" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-blue-200/50 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 text-gray-700"
                >
                  <item.icon className="w-4 h-4 text-blue-600" />
                  {item.text}
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShimmerButton
                  className="shadow-xl w-full sm:w-auto"
                  shimmerColor="#3B82F6"
                  background="linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(29, 78, 216) 100%)"
                  shimmerDuration="2.5s"
                  onClick={() => handleAnchorClick('#doctors')}
                >
                  <span className="flex items-center gap-2 text-white font-semibold px-2">
                    <Calendar className="h-5 w-5" />
                    Book Appointment
                  </span>
                </ShimmerButton>
              </motion.div>

            

            </motion.div>
          </div>

          {/* Right Side - Doctor Image with Modern Design */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Main Image Container */}
            <div className="relative w-full max-w-lg">
              {/* Background Gradient Blob */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-500/30 to-blue-600/20 rounded-[3rem] blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Doctor Image with Modern Masking */}
              <motion.div
                className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 95% 85%, 85% 95%, 15% 95%, 5% 85%)"
                }}
              >
                <img
                  src={heroImg}
                  alt="Professional Doctor"
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent" />
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                className="absolute -top-8 -left-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-blue-100 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Free Care</div>
                    <div className="text-xs text-gray-600">RUET Community</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-8 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-blue-100 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Expert Team</div>
                    <div className="text-xs text-gray-600">15+ Specialists</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-12 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-blue-100 z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-xs text-gray-600">Patients Served</div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
