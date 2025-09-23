import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { collectionData } from '@/data/collectionData';
import { RARITY_COLORS } from '@/data/fruits';

interface YearlyViewProps {
  onSelectMonth: (month: string) => void;
}

const YearlyView: React.FC<YearlyViewProps> = ({ onSelectMonth }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>2025 Fruits</Text>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {collectionData.map((monthData, monthIndex) => (
          <View key={`month-${monthIndex}`} style={styles.monthSection}>
            <Text style={styles.monthHeader}>{monthData.month}</Text>
            <TouchableOpacity onPress={() => onSelectMonth(monthData.month)}>
              <View style={styles.weekGrid}>
                {monthData.weeks.map((week, weekIndex) => (
                  <View key={`week-${weekIndex}`} style={styles.fruitIconContainer}>
                    {week ? (
                      <View style={[
                        styles.fruitIconWrapper,
                        { borderColor: week.fruit.collected ? RARITY_COLORS[week.fruit.rarity] : 'transparent' }
                      ]}>
                        <Image 
                          source={week.fruit.collected ? week.fruit.image : week.fruit.silhouette} 
                          style={styles.fruitIcon} 
                        />
                      </View>
                    ) : (
                      <View style={styles.emptyWeek} />
                    )}
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  monthSection: {
    marginBottom: 20,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    marginVertical: 10,
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fruitIconContainer: {
    width: '25%',
    padding: 5,
    alignItems: 'center',
  },
  fruitIconWrapper: {
    borderWidth: 2,
    borderRadius: 22,
    padding: 2,
  },
  fruitIcon: {
    width: 40,
    height: 40,
  },
  emptyWeek: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default YearlyView;
