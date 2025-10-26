
export interface Pesticide {
  name: string;
  dosage: string;
  application: string;
}

export interface Analysis {
  diseaseName: string;
  confidenceScore: number;
  analysis: string;
  pesticideRecommendations: Pesticide[];
  organicAlternatives: string[];
}
