import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import ModalSelector from 'react-native-modal-selector';
import { BackHandler } from 'react-native';

const TitleScreen = ({ navigation }) => {

  const data = [
    { key: 0, label: "Использовать прегенерированные изображения", value: '1' },
    { key: 1, label: "Использовать нейросетевые изображения", value: '2' },
    { key: 2, label: "Использовать хостинг картинок", value: '3' },
  ];

  const [selectedValue, setSelectedValue] = useState(data[0]);

  const startGame = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'GameScreen', params: { selectedValue } }],
    });
  };

  const loadGame = () => {
    navigation.navigate('GameScreen', { selectedValue })
  };
  
  return (
    <ImageBackground source={{uri: 'https://i.gifer.com/xK.gif'}} style={styles.backgroundImage} >
    <View style={styles.container}>

      <View style={styles.buttonContainer}>
        <Text style={styles.title}>Добро пожаловать!</Text>
        <TouchableOpacity onPress={startGame} style={styles.button}><Text style={styles.buttonText}>Начать игру</Text></TouchableOpacity>
        <TouchableOpacity onPress={loadGame} style={styles.button}><Text style={styles.buttonText}>Продолжить игру</Text></TouchableOpacity>

        <View style={styles.picker}>
          <ModalSelector
            data={data}
            initValue={selectedValue?.label ? "Настройки: " + selectedValue?.label : "Настройки: " + data[0].label}
            initValueTextStyle={{ color: 'white', textAlign: 'left' }}
            onChange={(value) => setSelectedValue(value)}
          />
        </View>

        <TouchableOpacity onPress={() => BackHandler.exitApp()} style={styles.button}><Text style={styles.buttonText}>Выйти</Text></TouchableOpacity>

      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '60%',
    borderRadius: 10, 
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    width: '100%',
    backgroundColor: '#E18BEC', 
    borderRadius: 5, 
    padding: 15,
    margin: 2
  },
  buttonText: {

  },
  picker: {
    width: '100%',
    borderRadius: 5,
    padding: 0,
    margin: 2
  },
});

export default TitleScreen;
