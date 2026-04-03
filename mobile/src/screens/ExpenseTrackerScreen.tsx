import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { apiService } from '../services/api';
import { Expense } from '../types/expense';
import { InputSection } from '../components/InputSection';
import { ExpenseItem } from '../components/ExpenseItem';
import { SuccessCard } from '../components/SuccessCard';

export const ExpenseTrackerScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastAdded, setLastAdded] = useState<Expense | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const fetchExpenses = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await apiService.getExpenses();
      setExpenses(data);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to fetch expenses');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const newExpense = await apiService.addExpense(input);
      setExpenses((prev) => [newExpense, ...prev]);
      setInput('');
      setLastAdded(newExpense);
      setTimeout(() => setLastAdded(null), 3000);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to parse/add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    Alert.alert(
      'Delete this expense?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingIds((prev) => [...prev, id]);
            try {
              await apiService.deleteExpense(id);
              setExpenses((prev) => prev.filter((e) => e.id !== id));
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete expense');
            } finally {
              setDeletingIds((prev) => prev.filter((di) => di !== id));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>AI Expense Tracker</Text>
      <Text style={styles.subtitle}>Add expenses in plain English</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No expenses yet. Add your first one!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {renderHeader()}
        
        <InputSection
          input={input}
          setInput={setInput}
          onAdd={handleAddExpense}
          loading={loading}
        />

        {lastAdded && <SuccessCard expense={lastAdded} />}

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <ExpenseItem
                expense={item}
                onDelete={handleDeleteExpense}
                deleting={deletingIds.includes(item.id)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchExpenses(true)}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={renderEmpty}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  itemWrapper: {
    marginBottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
