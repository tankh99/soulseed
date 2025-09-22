import { Fruit, fruits as allFruits } from "./fruits";

let userFruits: Fruit[] = allFruits.map((fruit) => ({
  ...fruit,
  collected: fruit.id === "1", // Pre-collect the first fruit
}));

export const getUserFruits = () => userFruits;

export const collectFruit = (fruitId: string) => {
  const fruit = userFruits.find((f) => f.id === fruitId);
  if (fruit) {
    fruit.collected = true;
  }
};

export const getNextUncollectedFruit = (): Fruit | undefined => {
  return userFruits.find((f) => !f.collected);
};
