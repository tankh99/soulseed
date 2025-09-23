import React from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image } from 'react-native';
import { collectionData } from '@/data/collectionData';
import { RARITY_COLORS } from '@/data/fruits';

interface YearlyViewProps {
  onSelectMonth: (month: string) => void;
}

const YearlyView: React.FC<YearlyViewProps> = ({ onSelectMonth }) => {
  const sections = collectionData.map(monthData => ({
    title: monthData.month,
    data: [monthData.weeks],
  }));

  return (
    <View style={styles.container}>
        <Text style={styles.headerTitle}>2025 Fruits</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `month-${index}`}
        renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.monthHeader}>{title}</Text>
        )}
        renderItem={({ item, section }) => (
          <TouchableOpacity onPress={() => onSelectMonth(section.title)}>
            <View style={styles.weekGrid}>
              {item.map((week, index) => (
                <View key={`week-${index}`} style={styles.fruitIconContainer}>
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
        )}
      />
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
