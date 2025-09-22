import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenLayout from "@/components/ScreenLayout";
import FruitGrid from "@/components/FruitGrid";
import { getUserFruits } from "@/data/userFruits";
import { useFocusEffect } from "expo-router";

const AlmanacScreen = () => {
  const [fruits, setFruits] = useState(getUserFruits());

  useFocusEffect(
    React.useCallback(() => {
      setFruits(getUserFruits());
    }, [])
  );

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Fruit Almanac</Text>
        <FruitGrid fruits={fruits} />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
});

export default AlmanacScreen;
