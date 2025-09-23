// Soulseed Data Configuration
// Contains all soulseed types with their names, statements, and characteristics

export interface SoulseedData {
  name: string;
  statement: string;
  scar: string;
  variationSlots: string[];
  growthExpression: string[];
  palette: string[];
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
}

export const SOULSEEDS: Record<string, SoulseedData> = {
  openness: {
    name: "Astra",
    statement: "Drifts into daydreams, but shines in seeing possibilities no one else imagines.",
    scar: "Constellation freckles inside the body.",
    variationSlots: ["star clusters", "spiral galaxies", "prism shards"],
    growthExpression: ["surreal patterns", "ethereal wings", "shifting hues"],
    palette: ["Indigo", "iridescent gradients", "gold sparks"],
    trait: "openness"
  },
  
  conscientiousness: {
    name: "Kippo",
    statement: "Feels weighed down by mistakes, but shines in staying grounded and dependable.",
    scar: "Cracks or etchings around body/shell.",
    variationSlots: ["stripes", "hexagons", "concentric rings"],
    growthExpression: ["crystalline shell", "symmetry", "structured aura"],
    palette: ["Earth browns", "moss greens", "amber"],
    trait: "conscientiousness"
  },
  
  extraversion: {
    name: "Lumo",
    statement: "Feels restless in silence, but shines when sparking energy and joy around others.",
    scar: "Tiny flame or spark in chest.",
    variationSlots: ["candle flame", "heart pulse", "fireworks sparks"],
    growthExpression: ["glowing aura", "animated bounces", "phoenix-like burst"],
    palette: ["Warm yellow/orange", "electric blue", "white glow"],
    trait: "extraversion"
  },
  
  agreeableness: {
    name: "Nyra",
    statement: "Has trouble saying no, but shines in bringing peace and care to others.",
    scar: "Petal or vine-like markings.",
    variationSlots: ["rounded petals", "curling vines", "feather-like wisps"],
    growthExpression: ["leafy tail", "blossoms", "flowing aura"],
    palette: ["Soft greens", "peach/pink", "lavender"],
    trait: "agreeableness"
  },
  
  neuroticism: {
    name: "Miro",
    statement: "Gets overwhelmed by worries, but shines in adapting and finding calm like flowing water.",
    scar: "Ripple inside the core.",
    variationSlots: ["clockwise swirl", "counterclockwise swirl", "concentric waves"],
    growthExpression: ["glassy surface", "flowing liquid", "crystalline guardian"],
    palette: ["Deep blues", "turquoise", "silver glints"],
    trait: "neuroticism"
  }
};

// Helper function to determine soulseed type based on personality scores
export function determineSoulseedType(personality: {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}): string {
  // Use neuroticism directly (no conversion needed)
  const neuroticism = personality.neuroticism;
  
  const traits = [
    { name: 'openness', value: personality.openness },
    { name: 'conscientiousness', value: personality.conscientiousness },
    { name: 'extraversion', value: personality.extraversion },
    { name: 'agreeableness', value: personality.agreeableness },
    { name: 'neuroticism', value: neuroticism },
  ];
  
  // Find the dominant trait
  const dominantTrait = traits.reduce((max, trait) => 
    trait.value > max.value ? trait : max
  );
  
  return dominantTrait.name;
}

// Helper function to get soulseed data by trait
export function getSoulseedByTrait(trait: string): SoulseedData {
  return SOULSEEDS[trait] || SOULSEEDS.openness; // Default to openness if trait not found
}

// Helper function to get soulseed data by personality scores
export function getSoulseedByPersonality(personality: {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}): SoulseedData {
  const trait = determineSoulseedType(personality);
  return getSoulseedByTrait(trait);
}

// Export all soulseed names for easy access
export const SOULSEED_NAMES = {
  ASTRA: "Astra",
  KIPPO: "Kippo", 
  LUMO: "Lumo",
  NYRA: "Nyra",
  MIRO: "Miro"
} as const;

// Export trait mappings
export const TRAIT_MAPPINGS = {
  openness: 'openness',
  conscientiousness: 'conscientiousness',
  extraversion: 'extraversion',
  agreeableness: 'agreeableness',
  neuroticism: 'neuroticism' // Neuroticism trait
} as const;
