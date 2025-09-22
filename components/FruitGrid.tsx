import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface Fruit {
  id: string;
  name: string;
  collected: boolean;
  image: any;
  silhouette: any;
}

interface FruitGridProps {
  fruits: Fruit[];
}

const FruitGrid: React.FC<FruitGridProps> = ({ fruits }) => {
  return (
    <View style={styles.grid}>
      {fruits.map((item) => (
        <View key={item.id} style={styles.fruitItem}>
          <Image
            source={item.collected ? item.image : item.silhouette}
            style={styles.fruitImage}
          />
          <Text style={styles.fruitName}>
            {item.collected ? item.name : "??????"}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  fruitItem: {
    width: '30%',
    alignItems: "center",
    margin: 4,
  },
  fruitImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  fruitName: {
    marginTop: 5,
    color: "white",
  },
});

export default FruitGrid;
