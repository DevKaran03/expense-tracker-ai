import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Plus } from "lucide-react-native";

interface InputSectionProps {
  input: string;
  setInput: (text: string) => void;
  onAdd: () => void;
  loading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  input,
  setInput,
  onAdd,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="e.g., Spent 500 on groceries at BigBazaar"
        placeholderTextColor="#999"
        value={input}
        onChangeText={setInput}
        multiline
        blurOnSubmit
      />
      <TouchableOpacity
        style={[
          styles.addButton,
          (!input.trim() || loading) && styles.disabledButton,
        ]}
        onPress={onAdd}
        disabled={!input.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Plus size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#eee",
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
});
