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
    <ScreenLayout contentStyle={styles.container}>
      <Text style={styles.title}>Fruit Almanac</Text>
      <FruitGrid fruits={fruits} />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center"
  },
});

export default AlmanacScreen;
