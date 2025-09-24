import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { FruitCollection } from '@/data/collectionData';
import { X } from 'lucide-react-native';

interface FruitDetailModalProps {
  visible: boolean;
  onClose: () => void;
  fruitCollection: FruitCollection;
}

const FruitDetailModal: React.FC<FruitDetailModalProps> = ({ visible, onClose, fruitCollection }) => {
  const { fruit, weeklyHighlight } = fruitCollection;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Image source={fruit.image} style={styles.fruitImage} />
          <Text style={styles.fruitName}>{fruit.name}</Text>
          <Text style={styles.dateRange}>{weeklyHighlight.dateRange}</Text>
          <View style={styles.highlightSection}>
            <Text style={styles.sectionTitle}>Highlight of the Week</Text>
            <Text style={styles.highlightText}>{weeklyHighlight.highlight}</Text>
          </View>
          <View style={styles.highlightSection}>
            <Text style={styles.sectionTitle}>Low Point of the Week</Text>
            <Text style={styles.highlightText}>{weeklyHighlight.lowlight}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        width: '80%',
        backgroundColor: '#2A2F45',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      fruitImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
      },
      fruitName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
      },
      dateRange: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 20,
      },
      highlightSection: {
        alignSelf: 'stretch',
        marginBottom: 15,
      },
      sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
      },
      highlightText: {
        fontSize: 14,
        color: 'lightgray',
      },
});

export default FruitDetailModal;
