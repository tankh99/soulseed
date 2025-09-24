import { ImageSourcePropType } from 'react-native';

export interface Fruit {
  id: string;
  name: string;
  image: ImageSourcePropType;
  silhouette: ImageSourcePropType;
  collected: boolean;
}

export const fruits: Omit<Fruit, 'collected'>[] = [
  {
    id: '1',
    name: 'Apple',
    image: require('../assets/images/fruits/fruits_apple.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '2',
    name: 'Orange',
    image: require('../assets/images/fruits/fruits_orange_full.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '3',
    name: 'Banana',
    image: require('../assets/images/fruits/fruits_banana.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '4',
    name: 'Strawberry',
    image: require('../assets/images/fruits/fruits_strawberry_1.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '5',
    name: 'Green Apple',
    image: require('../assets/images/fruits/fruits_apple_green_2.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '6',
    name: 'Lemon',
    image: require('../assets/images/fruits/fruits_lemon.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '7',
    name: 'Pineapple',
    image: require('../assets/images/fruits/fruits_pineapple.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '8',
    name: 'Grapes',
    image: require('../assets/images/fruits/fruits_grapes.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
  {
    id: '9',
    name: 'Watermelon',
    image: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
    silhouette: require('../assets/images/fruits/fruits_watermelon_hidden.png'),
  },
];
