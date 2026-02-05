import { Button } from "@/components/ui/button";
import { Radio, Link, BarChart3, Headphones, Settings, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Link,
    title: "Instant Stream Link",
    description: "Get your unique streaming URL in seconds. Compatible with RadioBoss, SAM Broadcaster, and more."
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track listeners, peak hours, and geographic data with our powerful dashboard."
  },
  {
    icon: Settings,
    title: "Easy Management",
    description: "Manage your station from a dedicated control panel. Update metadata, schedule shows, and more."
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Deliver crystal-clear audio worldwide with our distributed content delivery network."
  },
  {
    icon: Headphones,
    title: "HD Audio Quality",
    description: "Stream in up to 320kbps for studio-quality sound that your listeners will love."
  },
  {
    icon: Radio,
    title: "Auto DJ",
    description: "Keep your station running 24/7 with intelligent auto DJ and playlist management."
  }
];

const BroadcasterSection = () => {
  return (
    <section id="broadcasters" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for
            <span className="text-gradient"> Broadcasters</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run a professional radio station online. From streaming to analytics, we've got you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover-lift"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 glow-primary">
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button variant="hero" size="lg">
            Start Your Station Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BroadcasterSection;