import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

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
  const renderItem = ({ item }: { item: Fruit }) => (
    <View style={styles.fruitItem}>
      <Image
        source={item.collected ? item.image : item.silhouette}
        style={styles.fruitImage}
      />
      <Text style={styles.fruitName}>
        {item.collected ? item.name : "??????"}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={fruits}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 10,
  },
  fruitItem: {
    flex: 1,
    alignItems: "center",
    margin: 10,
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
