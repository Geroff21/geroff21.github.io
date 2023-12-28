import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TitleScreen from './TitleScreen';
import GameScreen from './GameScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <StatusBar hidden = {true} />
      <Stack.Navigator initialRouteName="TitleScreen">
        <Stack.Screen name="TitleScreen" component={TitleScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="GameScreen" component={GameScreen}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;