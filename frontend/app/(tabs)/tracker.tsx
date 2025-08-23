import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import { useList } from './listcontext';
import axios from 'axios';
import { FONTS } from '../constants/fonts';

export default function Tracker() {
  const [totalCalories, setTotalCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  
  const [goalCalories, setGoalCalories] = useState(2000);
  const [goalProtein, setGoalProtein] = useState(150);
  const [goalCarbs, setGoalCarbs] = useState(250);
  const [goalFats, setGoalFats] = useState(70);

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const { list, addToList } = useList();

  const handleAddToList = async () => {
    if (inputText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        const url = 'http://10.0.0.40:8000/food_lookup';
        const data = { food_text: inputText.trim() };
        
        axios.post(url, data)
          .then(response => {
            console.log('Success:', response.data);
            
            const lookupResult = response.data;
            
            if (lookupResult.result && lookupResult.result.product_name) {
              setLookupResult(lookupResult.result.product_name);
              addToList(lookupResult.result.product_name);
              
              Alert.alert(
                'Food Found and Added!',
                `Found: ${lookupResult.result.product_name}\n\nSimilarity: ${(lookupResult.result.similarity_score).toFixed(1)}%\n\nAdded to your tracking list.`,
                [{ text: 'OK' }]
              );
              
            } else {
              handleTextAnalysis();
            }
            
            setInputText('');
            setIsInputVisible(false);
            setLookupResult(null);
            setIsSubmitting(false);
          })
          .catch(error => {
            console.error('Error:', error.message);
            handleTextAnalysis();
            setIsSubmitting(false);
          });
        
      } catch (error) {
        await handleTextAnalysis();
        setIsSubmitting(false);
      }
    }
  };

  const handleTextAnalysis = async () => {
    try {
      const url = 'http://localhost:8000/analyze_text';
      const data = { food_text: inputText.trim() };
      
      axios.post(url, data)
        .then(response => {
          console.log('Success:', response.data);
          
          const result = response.data;
          
          addToList(inputText.trim());
          
          if (result.analysis && result.analysis.nutrition_estimate) {
            const nutrition = result.analysis.nutrition_estimate;
            setTotalCalories(prev => prev + (nutrition.calories || 0));
            setProtein(prev => prev + (nutrition.protein || 0));
            setCarbs(prev => prev + (nutrition.carbs || 0));
            setFats(prev => prev + (nutrition.fat || 0));
            
            Alert.alert(
              'Food Added Successfully!',
              `Added: ${inputText.trim()}\n\nEstimated Nutrition:\n• Calories: ${nutrition.calories || 0}\n• Protein: ${nutrition.protein || 0}g\n• Carbs: ${nutrition.carbs || 0}g\n• Fat: ${nutrition.fat || 0}g`,
              [{ text: 'OK' }]
            );
          } else {
            addToList(inputText.trim());
            Alert.alert('Food Added', `Added: ${inputText.trim()}`);
          }
          
          setInputText('');
          setIsInputVisible(false);
          setLookupResult(null);
        })
        .catch(error => {
          console.error('Error:', error.message);
          addToList(inputText.trim());
          Alert.alert('Food Added', `Added: ${inputText.trim()} (server analysis failed)`);
          
          setInputText('');
          setIsInputVisible(false);
          setLookupResult(null);
        });
    } catch (error) {
      addToList(inputText.trim());
      Alert.alert('Food Added', `Added: ${inputText.trim()} (offline mode)`);
      
      setInputText('');
      setIsInputVisible(false);
      setLookupResult(null);
    }
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = current / goal;
    if (percentage >= 1) return '#FF3B30'; // Red when over goal
    if (percentage >= 0.8) return '#FF9500'; // Orange when close
    return '#34C759'; // Green when good
  };

  const getProgressWidth = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Calories Section */}
        <View style={styles.caloriesSection}>
          <View style={styles.caloriesRow}>
            <Text style={styles.caloriesLabel}>Calories</Text>
          </View>
          <View style={styles.caloriesProgressBar}>
            <View 
              style={[
                styles.caloriesProgressFill, 
                { 
                  width: `${getProgressWidth(totalCalories, goalCalories)}%`,
                  backgroundColor: getProgressColor(totalCalories, goalCalories)
                }
              ]} 
            />
            <Text style={styles.caloriesProgressText}>
              {totalCalories} / {goalCalories}
            </Text>
          </View>
        </View>

        {/* Macros Row */}
        <View style={styles.headerMacrosRow}>
          <View style={styles.headerMacroItem}>
            <View style={styles.macroRow}>
              <Text style={styles.headerMacroLabel}>Protein</Text>
            </View>
            <View style={styles.headerMacroProgressBar}>
              <View 
                style={[
                  styles.headerMacroProgressFill, 
                  { 
                    width: `${getProgressWidth(protein, goalProtein)}%`,
                    backgroundColor: getProgressColor(protein, goalProtein)
                  }
                ]} 
              />
              <Text style={styles.macroProgressText}>
                {protein} / {goalProtein}
              </Text>
            </View>
          </View>

          <View style={styles.headerMacroItem}>
            <View style={styles.macroRow}>
              <Text style={styles.headerMacroLabel}>Carbs</Text>
            </View>
            <View style={styles.headerMacroProgressBar}>
              <View 
                style={[
                  styles.headerMacroProgressFill, 
                  { 
                    width: `${getProgressWidth(carbs, goalCarbs)}%`,
                    backgroundColor: getProgressColor(carbs, goalCarbs)
                  }
                ]} 
              />
              <Text style={styles.macroProgressText}>
                {carbs} / {goalCarbs}
              </Text>
            </View>
          </View>

          <View style={styles.headerMacroItem}>
            <View style={styles.macroRow}>
              <Text style={styles.headerMacroLabel}>Fat</Text>
            </View>
            <View style={styles.headerMacroProgressBar}>
              <View 
                style={[
                  styles.headerMacroProgressFill, 
                  { 
                    width: `${getProgressWidth(fats, goalFats)}%`,
                    backgroundColor: getProgressColor(fats, goalFats)
                  }
                ]} 
              />
              <Text style={styles.macroProgressText}>
                {fats} / {goalFats}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Add Food Section */}
      <View style={styles.addFoodSection}>
        {!isInputVisible ? (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsInputVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Food</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter food description..."
              placeholderTextColor="#8E8E93"
              value={inputText}
              onChangeText={setInputText}
              multiline
              autoFocus
            />
            <View style={styles.inputButtons}>
              <TouchableOpacity 
                style={[styles.inputButton, styles.cancelButton]}
                onPress={() => {
                  setIsInputVisible(false);
                  setInputText('');
                  setLookupResult(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.inputButton, styles.submitButton]}
                onPress={handleAddToList}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Adding...' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
            {lookupResult && (
              <View style={styles.lookupResult}>
                <Text style={styles.lookupResultText}>
                  Found: {lookupResult}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Food List */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Today's Foods</Text>
        <FlatList
          data={list}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          )}
          style={styles.foodList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(0, 71, 171, 0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
    fontFamily: FONTS.regular,
  },
  addFoodSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  addButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.5)',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: FONTS.semiBold,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#1C1C1E',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  inputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputButton: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  submitButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.5)',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  cancelButton: {
    backgroundColor: 'rgba(142, 142, 147, 0.5)',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  lookupResult: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(227, 242, 253, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.4)',
  },
  lookupResultText: {
    fontSize: 14,
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: FONTS.medium,
  },
  listSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1C1C1E',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: FONTS.bold,
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  listItemText: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
    fontFamily: FONTS.medium,
  },
  foodList: {
    flex: 1,
  },
  // New styles for the redesigned header
  caloriesSection: {
    marginBottom: 16,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  caloriesLabel: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  caloriesValue: {
    color: 'white',
    fontSize: 24,
    marginBottom: 12,
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  caloriesProgressBar: {
    width: '100%',
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  caloriesProgressFill: {
    height: '100%',
    borderRadius: 12,
  },
  caloriesProgressText: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlignVertical: 'center',
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: FONTS.bold,
  },
  headerMacrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerMacroItem: {
    width: '30%',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerMacroLabel: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  headerMacroValue: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '700',
    fontFamily: FONTS.bold,
  },
  headerMacroProgressBar: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerMacroProgressFill: {
    height: '100%',
    borderRadius: 10,
  },
  macroProgressText: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlignVertical: 'center',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: FONTS.bold,
  },
});
