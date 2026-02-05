import { Button } from "@/components/ui/button";
import { Smartphone, ArrowRight, Zap, Shield, Palette } from "lucide-react";
import { motion } from "framer-motion";

const CustomAppSection = () => {
  return (
    <section id="custom-apps" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" />
              Custom Mobile Apps
            </span>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Get Your Own
              <span className="text-gradient"> Branded App</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Stand out from the crowd with a custom mobile app for your radio station. 
              Fully branded with your logo, colors, and features—available on iOS and Android.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Palette, text: "Custom branding with your logo and colors" },
                { icon: Zap, text: "Push notifications for live shows and updates" },
                { icon: Shield, text: "Integrated with ZimRadio streaming platform" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" className="group">
              Request Custom App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Phone Mockups */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative flex justify-center">
              {/* Main phone */}
              <div className="relative w-64 h-[500px] bg-gradient-to-b from-secondary to-card rounded-[3rem] p-3 border border-border shadow-2xl">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-full" />
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col">
                  {/* App header */}
                  <div className="gradient-primary p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-foreground/20 rounded-2xl mb-3 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="font-display font-bold text-primary-foreground">Your Radio</h4>
                    <p className="text-xs text-primary-foreground/70">Live Now</p>
                  </div>
                  {/* App content */}
                  <div className="flex-1 p-4 space-y-3">
                    <div className="h-12 bg-secondary rounded-xl animate-pulse" />
                    <div className="h-20 bg-secondary rounded-xl animate-pulse" />
                    <div className="h-12 bg-secondary rounded-xl animate-pulse" />
                    <div className="h-12 bg-secondary rounded-xl animate-pulse" />
                  </div>
                  {/* Player bar */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-secondary rounded mb-1" />
                        <div className="h-2 w-16 bg-muted rounded" />
                      </div>
                      <div className="w-10 h-10 rounded-full gradient-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary phone (decorative) */}
              <div className="absolute -left-8 top-16 w-48 h-[380px] bg-gradient-to-b from-secondary to-card rounded-[2.5rem] p-2 border border-border shadow-xl opacity-60 -rotate-6">
                <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden">
                  <div className="gradient-primary h-24" />
                  <div className="p-3 space-y-2">
                    <div className="h-8 bg-secondary rounded-lg animate-pulse" />
                    <div className="h-16 bg-secondary rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomAppSection;