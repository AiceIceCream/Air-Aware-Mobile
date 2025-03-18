import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

export default function LocationModal({ visible, locations, onSelect, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <FlatList
          data={locations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.locationItem}
              onPress={() => {
                onSelect(item.location);
                onClose();
              }}
            >
              <Text style={styles.locationText}>{item.location}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(136, 136, 140, 0.8)' },
  locationItem: { backgroundColor: '#fff', padding: 15, marginVertical: 5 },
  locationText: { textAlign: 'center', fontSize: 14 },
});
