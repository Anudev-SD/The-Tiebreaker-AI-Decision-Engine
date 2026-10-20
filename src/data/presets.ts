export interface PresetDilemma {
  title: string;
  category: string;
  options: string[];
  context: string;
  perspective: string;
}

export const PRESET_DILEMMAS: PresetDilemma[] = [
  {
    title: 'Career Crossroads: High-Equity Early-Stage Startup vs Established Tech Giant',
    category: 'Career & Finance',
    options: [
      'Join Series-A Startup (Head of Eng, $145k + 1.2% Equity)',
      'Stay at Big Tech (Senior Staff SWE, $285k total comp + 401k match)'
    ],
    context: 'I am 31, no kids yet but planning a family in ~2 years. I value autonomy and huge upside, but economic volatility worries my partner. Current job is comfortable but getting politically stagnant.',
    perspective: 'Strategic & Financial'
  },
  {
    title: 'Housing Decision: Buy a 3-Bedroom Suburban Home vs Keep Renting in City Core & Max Investing',
    category: 'Lifestyle & Housing',
    options: [
      'Buy Suburban Home ($620k purchase, 6.4% mortgage, 45-min commute)',
      'Rent Downtown Apartment ($2,600/mo, walk to work, invest down payment in index funds)'
    ],
    context: 'We have $130,000 saved for a down payment. Buying locks in space and equity build, but interest and maintenance are high. Renting gives extreme agility and low friction.',
    perspective: 'Long-Term Investor'
  },
  {
    title: 'Workstation Upgrade: M4 Max MacBook Pro vs Custom High-End Linux Workstation',
    category: 'Tech & Hardware',
    options: [
      'Apple MacBook Pro 16" (M4 Max, 64GB Unified RAM, 2TB SSD)',
      'Custom Linux PC (Ryzen 9950X, RTX 4090 24GB, Dual 4K Displays)'
    ],
    context: 'I do full-stack web dev, local LLM inference fine-tuning, and travel 1-2 weeks per quarter for client consulting. Budget is $4,000-$4,500.',
    perspective: 'Pragmatic Technologist'
  },
  {
    title: 'Education & Growth: Full-Time Master\'s Degree in AI vs Self-Directed Portfolio & Open Source',
    category: 'Personal Growth',
    options: [
      'Full-Time Top-Tier University Master\'s Degree ($55k tuition, 18 months)',
      'Self-Directed Study: Build 4 Open-Source AI projects + maintain day job'
    ],
    context: 'Looking to transition from traditional software engineer to Applied AI/ML engineer. Want credibility and network without unnecessary student debt.',
    perspective: 'Balanced Life Coach'
  },
  {
    title: 'Product Strategy: Build Custom In-House Analytics vs Integrate Leading SaaS Platform',
    category: 'Business & SaaS',
    options: [
      'Engineer Custom In-House Event Pipeline (ClickHouse + Grafana)',
      'Subscribe to Enterprise SaaS Analytics ($18,000/yr contract)'
    ],
    context: 'Our engineering team is 8 engineers. We process ~25M events/month. SaaS is fast to start; custom protects customer privacy and avoids vendor lock-in.',
    perspective: 'Ruthless Pragmatist'
  }
];
