import React from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Image } from 'react-native';
import { collectionData } from '@/data/collectionData';

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
          <TouchableOpacity onPress={() => onSelectMonth(title)}>
            <Text style={styles.monthHeader}>{title}</Text>
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <View style={styles.weekGrid}>
            {item.map((week, index) => (
              <View key={`week-${index}`} style={styles.fruitIconContainer}>
                {week ? (
                  <Image source={week.fruit.image} style={styles.fruitIcon} />
                ) : (
                  <View style={styles.emptyWeek} />
                )}
              </View>
            ))}
          </View>
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
