import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { collectionData } from '@/data/collectionData';
import FruitDetailModal from './FruitDetailModal';
import { FruitCollection } from '@/data/collectionData';
import Header from './Header';

interface MonthlyViewProps {
  initialMonthIndex: number;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

const MonthlyView: React.FC<MonthlyViewProps> = ({ initialMonthIndex, onBack }) => {
  const [selectedFruit, setSelectedFruit] = useState<FruitCollection | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialMonthIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <Header
        onBackPress={onBack}
        title={`${collectionData[currentIndex].month} ${collectionData[currentIndex].year}`}
      />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: width * initialMonthIndex, y: 0 }}
      >
        {collectionData.map((monthData, index) => (
          <View key={index} style={styles.monthContainer}>
            {monthData.weeks.map((week, weekIndex) => (
              week && (
                <TouchableOpacity key={weekIndex} style={styles.weekRow} onPress={() => setSelectedFruit(week)}>
                  <Text style={styles.weekLabel}>Week {weekIndex + 1}</Text>
                  <Image
                    source={week.fruit.collected ? week.fruit.image : week.fruit.silhouette}
                    style={styles.fruitImage}
                  />
                  <Text style={styles.fruitName}>
                    {week.fruit.collected ? week.fruit.name : "??????"}
                  </Text>
                </TouchableOpacity>
              )
            ))}
          </View>
        ))}
      </ScrollView>
      {selectedFruit && (
        <FruitDetailModal
          visible={!!selectedFruit}
          onClose={() => setSelectedFruit(null)}
          fruitCollection={selectedFruit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      monthContainer: {
        width,
        padding: 20,
      },
      weekRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      weekLabel: {
        color: 'white',
        fontSize: 16,
        marginRight: 10,
      },
      fruitImage: {
        width: 60,
        height: 60,
        marginRight: 10,
      },
      fruitName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
      },
});

export default MonthlyView;
