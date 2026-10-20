export interface DecisionItem {
  id: string;
  title: string;
  description: string;
  weight: number; // 1 to 5
  category: string;
  isActive?: boolean;
  isUserAdded?: boolean;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  name: string;
  tagline: string;
  bestFor: string;
  pros: DecisionItem[];
  cons: DecisionItem[];
  swot: SwotAnalysis;
}

export interface CriterionScore {
  optionName: string;
  score: number; // 1 to 10
  rationale: string;
}

export interface DecisionCriterion {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultWeight: number; // 1 to 5
  userWeight?: number;
  scores: CriterionScore[];
}

export interface ReversalCondition {
  optionName: string;
  condition: string;
}

export interface TenTenTenRule {
  tenMinutes: string;
  tenMonths: string;
  tenYears: string;
}

export interface PreMortem {
  failureScenario: string;
  preventiveAction: string;
}

export interface Verdict {
  recommendedOption: string;
  confidencePercentage: number;
  headline: string;
  decisiveFactor: string;
  detailedVerdict: string;
  reversalConditions: ReversalCondition[];
  tenTenTenRule: TenTenTenRule;
  preMortem: PreMortem;
}

export interface DecisionAnalysisResult {
  summary: string;
  dilemmaType: string;
  optionsAnalysis: OptionAnalysis[];
  criteria: DecisionCriterion[];
  verdict: Verdict;
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  title: string;
  options: string[];
  context?: string;
  perspective?: string;
  analysis: DecisionAnalysisResult;
  selectedFinalOption?: string;
  notes?: string;
}

export interface WhatIfResult {
  scenarioImpact: string;
  doesWinnerFlip: boolean;
  newRecommendedOption: string;
  optionImpacts: {
    optionName: string;
    impactLevel: string;
    notes: string;
  }[];
  contingencyAdvice: string;
}
