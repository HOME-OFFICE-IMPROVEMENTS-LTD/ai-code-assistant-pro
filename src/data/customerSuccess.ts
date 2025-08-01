export interface CustomerProfile {
  name: string;
  type: 'PowerUser' | 'StandardUser' | 'BudgetUser';
  hardware: {
    ram: number;
    cpu: number;
    gpu?: boolean;
  };
  model: string;
  performance: {
    successRate: number;
    responseTime: string;
    rating: number;
    testedCount: number;
  };
  testimonial?: {
    quote: string;
    company: string;
    role: string;
  };
}

export const customerProfiles: CustomerProfile[] = [
  {
    name: "Power User Configuration",
    type: "PowerUser",
    hardware: { ram: 16384, cpu: 8, gpu: true },
    model: "CodeLlama 7B",
    performance: {
      successRate: 95,
      responseTime: "2-3 seconds",
      rating: 4.8,
      testedCount: 150
    },
    testimonial: {
      quote: "Migrated our entire team from ChatGPT to local LLMs using your recommendations. CodeLlama 7B with Ollama delivers exactly the 2-3 second response times you promised. No more API costs!",
      company: "Fortune 500 Tech Company",
      role: "Development Team Lead"
    }
  },
  {
    name: "Standard User Configuration",
    type: "StandardUser",
    hardware: { ram: 12288, cpu: 4, gpu: false },
    model: "DeepSeek Coder 6.7B",
    performance: {
      successRate: 90,
      responseTime: "3-4 seconds",
      rating: 4.6,
      testedCount: 120
    },
    testimonial: {
      quote: "Your system analysis nailed it. DeepSeek Coder works perfectly on our standard hardware. The whole team is productive without breaking the bank.",
      company: "Growing Startup",
      role: "CTO"
    }
  },
  {
    name: "Budget User Configuration",
    type: "BudgetUser",
    hardware: { ram: 8192, cpu: 4, gpu: false },
    model: "Phi-3 Mini 3.8B",
    performance: {
      successRate: 85,
      responseTime: "5-7 seconds",
      rating: 4.2,
      testedCount: 80
    },
    testimonial: {
      quote: "Phi-3 Mini gives us the AI coding we needed on budget hardware. Perfect for our educational environment.",
      company: "University Computer Science Dept",
      role: "Professor"
    }
  }
];

export const enterpriseClients = [
  {
    name: "Security-First Enterprise",
    industry: "Financial Services",
    setup: "Jan + Custom Models",
    benefit: "Air-gapped AI coding with compliance approval",
    size: "500+ developers"
  },
  {
    name: "Healthcare Innovation Lab",
    industry: "Healthcare Technology",
    setup: "Ollama + HIPAA-compliant deployment",
    benefit: "Patient data never leaves secure environment",
    size: "50+ developers"
  },
  {
    name: "Government Contractor",
    industry: "Defense Technology",
    setup: "Complete air-gapped DevContainer",
    benefit: "Classified development environment",
    size: "200+ developers"
  }
];
