export const RARITY_COLORS = {
  common: 'white',
  uncommon: '#4ADE80', // green
  rare: '#38BDF8',     // blue
  mythic: '#A78BFA',   // purple
  legendary: '#F59E0B' // orange
};

export type Rarity = keyof typeof RARITY_COLORS;

export interface Fruit {
  id: string;
  name: string;
  collected: boolean;
  image: any;
  silhouette: any;
  rarity: Rarity;
}

export const fruits: Fruit[] = [
  // Commons
  {
    id: "1",
    name: "Apple",
    collected: true,
    image: require("@/assets/images/fruits/fruits_apple.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'common',
  },
  {
    id: "2",
    name: "Orange",
    collected: false,
    image: require("@/assets/images/fruits/fruits_orange_full.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'common',
  },
  {
    id: "3",
    name: "Banana",
    collected: false,
    image: require("@/assets/images/fruits/fruits_banana.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'common',
  },
  // Uncommons
  {
    id: "4",
    name: "Strawberry",
    collected: false,
    image: require("@/assets/images/fruits/fruits_strawberry_1.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'uncommon',
  },
  {
    id: "5",
    name: "Green Apple",
    collected: false,
    image: require("@/assets/images/fruits/fruits_apple_green_2.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'uncommon',
  },
  // Rares
  {
    id: "6",
    name: "Lemon",
    collected: false,
    image: require("@/assets/images/fruits/fruits_lemon.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'rare',
  },
  {
    id: "7",
    name: "Pineapple",
    collected: false,
    image: require("@/assets/images/fruits/fruits_pineapple.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'rare',
  },
  // Mythic
  {
    id: "8",
    name: "Grapes",
    collected: false,
    image: require("@/assets/images/fruits/fruits_grapes.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'mythic',
  },
  // Legendary
  {
    id: "9",
    name: "Durian",
    collected: false,
    image: require("@/assets/images/fruits/fruits_durian.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    rarity: 'legendary',
  },
];
