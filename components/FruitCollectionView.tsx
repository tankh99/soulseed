import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { collectionData } from '@/data/collectionData';
import YearlyView from './YearlyView';
import MonthlyView from './MonthlyView';

const FruitCollectionView = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  if (selectedMonth) {
    const selectedMonthIndex = collectionData.findIndex(m => m.month === selectedMonth);
    return (
      <MonthlyView
        initialMonthIndex={selectedMonthIndex}
        onBack={() => setSelectedMonth(null)}
      />
    );
  }

  return <YearlyView onSelectMonth={setSelectedMonth} />;
};

export default FruitCollectionView;
