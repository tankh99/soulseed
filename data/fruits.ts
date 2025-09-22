export interface Fruit {
  id: string;
  name: string;
  collected: boolean;
  image: any;
  silhouette: any;
}

export const fruits: Fruit[] = [
  {
    id: "1",
    name: "Apple",
    collected: true,
    image: require("@/assets/images/fruits/fruits_apple.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "2",
    name: "Banana",
    collected: false,
    image: require("@/assets/images/fruits/fruits_banana.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "3",
    name: "Orange",
    collected: false,
    image: require("@/assets/images/fruits/fruits_orange_full.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "4",
    name: "Green Apple",
    collected: false,
    image: require("@/assets/images/fruits/fruits_apple_green_2.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "5",
    name: "Coconut",
    collected: false,
    image: require("@/assets/images/fruits/fruits_coconut.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "6",
    name: "Durian",
    collected: false,
    image: require("@/assets/images/fruits/fruits_durian.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "7",
    name: "Grapes",
    collected: false,
    image: require("@/assets/images/fruits/fruits_grapes.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "8",
    name: "Lemon",
    collected: false,
    image: require("@/assets/images/fruits/fruits_lemon.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "9",
    name: "Monkfruit",
    collected: false,
    image: require("@/assets/images/fruits/fruits_monkfruit.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "10",
    name: "Pineapple",
    collected: false,
    image: require("@/assets/images/fruits/fruits_pineapple.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "11",
    name: "Strawberry",
    collected: false,
    image: require("@/assets/images/fruits/fruits_strawberry_1.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
  {
    id: "12",
    name: "Watermelon",
    collected: false,
    image: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
    silhouette: require("@/assets/images/fruits/fruits_watermelon_hidden.png"),
  },
];
