import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { collectionData } from '@/data/collectionData';
import FruitDetailModal from './FruitDetailModal';
import { FruitCollection } from '@/data/collectionData';
import Header from './Header';
import { RARITY_COLORS } from '@/data/fruits';

interface MonthlyViewProps {
  initialMonthIndex: number;
  onBack: () => void;
}

const { width } = Dimensions.get('window');

const MonthlyView: React.FC<MonthlyViewProps> = ({ initialMonthIndex, onBack }) => {
  const [selectedFruit, setSelectedFruit] = useState<FruitCollection | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialMonthIndex);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderMonth = ({ item }: { item: typeof collectionData[0] }) => (
    <View style={styles.monthContainer}>
      {item.weeks.map((week, index) => (
        week && (
          <TouchableOpacity key={index} style={styles.weekRow} onPress={() => setSelectedFruit(week)}>
            <Text style={styles.weekLabel}>Week {index + 1}</Text>
            <Image source={week.fruit.image} style={styles.fruitImage} />
            <Text style={[styles.fruitName, { color: RARITY_COLORS[week.fruit.rarity] }]}>{week.fruit.name}</Text>
          </TouchableOpacity>
        )
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        onBackPress={onBack}
        title={`${collectionData[currentIndex].month} ${collectionData[currentIndex].year}`}
      />
      <FlatList
        data={collectionData}
        renderItem={renderMonth}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.month}
        initialScrollIndex={initialMonthIndex}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
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
      },
});

export default MonthlyView;
