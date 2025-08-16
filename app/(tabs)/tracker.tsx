import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useList } from './listcontext';

export default function Tracker() {
  // State variables for calories and macros
  const [totalCalories, setTotalCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  // Goal variables for calories and macros
  const [goalCalories, setgoalTotalCalories] = useState(2000);
  const [goalprotein, setgoalProtein] = useState(150);
  const [goalcarbs, setgoalCarbs] = useState(250);
  const [goalfats, setgoalFats] = useState(70);

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const { list, addToList } = useList(); // Access the shared list and method


  const handleAddToList = () => {
    if (inputText.trim()) {
      addToList(inputText.trim()); // Use the shared context method
      setInputText('');
      setIsInputVisible(false); // Hide the input after adding
    }
  };

  return (
    
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* First Row: Total Calories */}
        <View style={styles.row}>
          <Text style={styles.caloriesText}>Total Calories: {totalCalories}/{goalCalories}</Text>
        </View>
        {/* Second Row: Protein, Carbs, Fats */}
        <View style={[styles.row, styles.macrosRow]}>
          <Text style={styles.macroText}>Protein: {protein}/{goalprotein} g</Text>
          <Text style={styles.macroText}>Carbs: {carbs}/{goalcarbs} g</Text>
          <Text style={styles.macroText}>Fats: {fats}/{goalfats} g</Text>
        </View>
      </View>  
      {/* List Section */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Food Eaten Today</Text>

        <FlatList
          data={list} // Use the shared list here



        
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={{ maxHeight: 600 }} // Make list scrollable
        />

        {isInputVisible ? (
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type here..."
            onSubmitEditing={handleAddToList}
          />
        ) : (
          <Button title="Add to List" onPress={() => setIsInputVisible(true)} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    padding: 10,
    paddingTop: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 20,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  macrosRow: {
    justifyContent: 'space-around',
  },
  caloriesText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  macroText: {
    color: '#000',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Times New Roman',
  },
  listItem: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Times New Roman',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
});
