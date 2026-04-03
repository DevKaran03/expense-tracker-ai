import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { Expense } from "../types/expense";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Food & Dining": "🍔",
  Transport: "🚗",
  Shopping: "🛒",
  Entertainment: "📺",
  "Bills & Utilities": "📄",
  Health: "💊",
  Travel: "✈️",
  Other: "📦",
};

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: number) => void;
  deleting?: boolean;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  expense,
  onDelete,
  deleting,
}) => {
  const emoji = CATEGORY_EMOJIS[expense.category] || "📦";

  return (
    <View style={[styles.container, deleting && styles.deleting]}>
      <View style={styles.iconContainer}>
        <Text style={styles.emojiText}>{emoji}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryName}>{expense.category}</Text>
          <Text style={styles.amountText}>₹{expense.amount.toFixed(2)}</Text>
        </View>
        <Text style={styles.descriptionText} numberOfLines={1}>
          {expense.description}
        </Text>
        <Text style={styles.timeText}>
          {formatDistanceToNow(new Date(expense.created_at), {
            addSuffix: true,
          })}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(expense.id)}
        disabled={deleting}
      >
        <Trash2 size={18} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  deleting: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emojiText: {
    fontSize: 24,
  },
  detailsContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  descriptionText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    color: "#999",
  },
  deleteButton: {
    padding: 8,
  },
});
