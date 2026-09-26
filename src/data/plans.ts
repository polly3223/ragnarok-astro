export interface Plan {
  name: string;
  description: string;
  monthly: string;
  yearly: string;
  popular?: boolean;
  points: string[];
}

export const plans: Plan[] = [
  {
    name: "Starter",
    description: "For curious builders launching their first agents at scale.",
    monthly: "29.99",
    yearly: "24.99",
    points: ["Single AI Agent", "Core workflows", "Basic integrations", "Community support"],
  },
  {
    name: "Pro",
    description: "For growing teams automating workflows with full control.",
    monthly: "99.99",
    yearly: "79.99",
    popular: true,
    points: ["Multiple AI Agents", "Advanced workflows", "100+ integrations", "Priority support"],
  },
  {
    name: "Enterprise",
    description: "Fully customizable, scalable automation for large teams.",
    monthly: "299.99",
    yearly: "249.99",
    points: ["Unlimited AI Agents", "Custom tools & deployments", "SSO, roles & admin controls", "Dedicated onboarding + SLA"],
  },
];
