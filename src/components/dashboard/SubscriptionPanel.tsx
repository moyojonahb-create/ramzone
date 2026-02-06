import { Station, Subscription } from "@/pages/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Radio, Zap, Users, Headphones, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionPanelProps {
  station: Station | null;
  subscription: Subscription | null;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    listeners: "Up to 100 listeners",
    features: [
      "Basic streaming",
      "128kbps quality",
      "Basic analytics",
      "Email support",
      "1 stream mount",
    ],
    icon: Radio,
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    listeners: "Up to 500 listeners",
    popular: true,
    features: [
      "HD streaming",
      "320kbps quality",
      "Advanced analytics",
      "Priority support",
      "3 stream mounts",
      "Custom player",
      "Auto DJ integration",
    ],
    icon: Zap,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    listeners: "Unlimited listeners",
    features: [
      "Ultra HD streaming",
      "Highest quality",
      "Real-time analytics",
      "24/7 phone support",
      "Unlimited mounts",
      "White-label player",
      "API access",
      "Custom mobile app",
    ],
    icon: Crown,
  },
];

const SubscriptionPanel = ({ station, subscription }: SubscriptionPanelProps) => {
  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Radio className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No Station Yet
        </h3>
        <p className="text-muted-foreground">
          Create your station first to manage your subscription
        </p>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "starter";
  const status = subscription?.status || "pending";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Subscription</h2>
        <p className="text-muted-foreground">Manage your plan and billing</p>
      </div>

      {/* Current Plan Status */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                {currentPlan === "enterprise" ? (
                  <Crown className="w-7 h-7 text-primary-foreground" />
                ) : currentPlan === "professional" ? (
                  <Zap className="w-7 h-7 text-primary-foreground" />
                ) : (
                  <Radio className="w-7 h-7 text-primary-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground capitalize">
                  {currentPlan} Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span
                    className={cn(
                      "font-medium",
                      status === "active" ? "text-primary" : "text-yellow-500"
                    )}
                  >
                    {status === "active" ? "Active" : "Pending Payment"}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-foreground">
                ${plans.find((p) => p.id === currentPlan)?.price || 29}
                <span className="text-lg text-muted-foreground font-normal">/mo</span>
              </p>
              {subscription?.expires_at && (
                <p className="text-sm text-muted-foreground">
                  Renews: {new Date(subscription.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative glass-card border-border transition-all",
                  isCurrentPlan && "border-primary ring-2 ring-primary/20",
                  plan.popular && "md:-mt-2 md:mb-2"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.listeners}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-display font-bold text-foreground mb-6">
                    ${plan.price}
                    <span className="text-base text-muted-foreground font-normal">/mo</span>
                  </p>
                  <ul className="space-y-3 text-left mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn(
                      "w-full",
                      isCurrentPlan ? "bg-secondary text-foreground" : "gradient-primary"
                    )}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom App Request */}
      <Card className="glass-card border-border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-semibold text-foreground">
                Need a Custom Mobile App?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Get a branded mobile app for your radio station with your logo, colors, and features.
              Available for iOS and Android.
            </p>
            <Button variant="outline">Request Custom App</Button>
          </div>
          <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Smartphone className="w-16 h-16 text-primary/50" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionPanel;
