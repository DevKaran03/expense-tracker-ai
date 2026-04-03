import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Expense } from '../types/expense';

interface SuccessCardProps {
  expense: Expense;
}

export const SuccessCard: React.FC<SuccessCardProps> = ({ expense }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Added Successfully!</Text>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>₹{expense.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{expense.category}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Merchant:</Text>
          <Text style={styles.value}>{expense.merchant || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{expense.description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#4E7D4E',
    fontSize: 13,
    width: 80,
    fontWeight: '500',
  },
  value: {
    color: '#1B5E20',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
