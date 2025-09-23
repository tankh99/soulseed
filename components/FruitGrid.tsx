import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Fruit as FruitType, RARITY_COLORS } from "@/data/fruits";

interface FruitGridProps {
  fruits: FruitType[];
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
          <Text style={[
            styles.fruitName,
            { color: item.collected ? RARITY_COLORS[item.rarity] : 'white' }
          ]}>
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
