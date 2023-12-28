import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform, TouchableOpacity, ImageBackground, Animated   } from 'react-native';
import scenesinfo from './scenario.json';
import scenario from './chapters.json';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { images } from './images';

const GameScreen = ({ navigation }) => {

  const router = useRoute();

  const [chapter, setChapter] = useState(0);
  const [route, setRoute] = useState(0);
  const [scene, setScene] = useState(0);
  const [content, setContent] = useState(0);
  const [imageUrl, setImageUrl] = useState(0);
  const [showChoice, setShowChoice] = useState(false);
  const [selectedValue, setSelectedValue] = useState(router.params);
  const [currentScene, setCurrentScene] = useState(scenario.chapters[0].scenes[0]);
  const PEXELS_API_KEY = 'i29oPMz39605n2AAdCNKnucNN5dQl5Ae8iC2F3AkzKrVRR2ShwRJfoSP';
  const STABILITY_API_KEY = 'sk-pbShFZZokJNy1UJrWhZPn5Ua8EDP1OQs5XhUxt1HKV5ZFCgN';
  const UNSPLASH_ACCESS_KEY = '3lA3lolgAX0pFLX4RpE5ztKcYB8TrvH_3RsWgRS_eKA';

  console.log(selectedValue);

  useEffect(() => {
    setCurrentScene(scenario.chapters[chapter].scenes[scene]);

    let url;

    const fetchImage = async () => {

      if (selectedValue.selectedValue.value == '1') {
        const imageAsset = Asset.fromModule(images[scenesinfo.chapters[chapter].scenes[scene].image]);
        url = imageAsset.localUri ? { uri: imageAsset.localUri } : imageAsset.uri;
      } 

      if (selectedValue.selectedValue.value == '2') {
        const imageAsset = Asset.fromModule(await fetchStabilityImage(scene, chapter, scenesinfo.chapters[chapter].scenes[scene].content));
        url = imageAsset.localUri ? { uri: imageAsset.localUri } : imageAsset.uri;
      } 

      if (selectedValue.selectedValue.value == '3') {
        url = await fetchUnsplashImage(scenesinfo.chapters[chapter].scenes[scene].content);
      } 

      setImageUrl(url);

    };

    fetchImage();

  }, [chapter, route, scene, content]);

  const fetchUnsplashImage = async (description) => {
    const apiUrl = `https://api.unsplash.com/search/photos?page=1&query=${description}&per_page=50&orientation=landscape`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': 'Client-ID ' + UNSPLASH_ACCESS_KEY
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const popa = Math.floor(Math.random() * data.results.length);

      if (data.results && data.results.length > 0) {
        const imageUrl = data.results[popa].urls.regular;
        return imageUrl;
      }

    } catch (error) {
      console.error('Error fetching image:', error);
    }

    return null;
  };

  const fetchPexelsImage = async (description) => {
    const apiUrl = `https://api.pexels.com/v1/search?query=${description}&per_page=50&orientation=landscape`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const popa = Math.floor(Math.random() * data.photos.length);

      if (data.photos && data.photos.length > 0) {
        const imageUrl = data.photos[popa].src.large2x;
        return imageUrl;
      }

    } catch (error) {
      console.error('Error fetching image:', error);
    }

    return null;
  };

  const fetchStabilityImage = async (scene, chapter, description) => {

    const path = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image";

    const headers = {
      Accept: "application/json",
      Authorization: "Bearer " + STABILITY_API_KEY,
    };

    const body = {
      steps: 20,
      width: 512,
      height: 512,
      seed: 0,
      cfg_scale: 5,
      samples: 1,
      text_prompts: [
        {
          "text": description,
          "weight": 1
        }
      ],
    };

    try {
      
      const response = await axios.post(path, body, { headers });

      let filePath = '';
      const seed = `${chapter}_${scene}`;

      response.data.artifacts.forEach(async (image, index) => {
        try {
          filePath = `${FileSystem.documentDirectory}txt2img_${seed}.png`;
          await FileSystem.writeAsStringAsync(filePath, image.base64, { encoding: FileSystem.EncodingType.Base64 });
          console.log('File written successfully.');

        } catch (error) {
          console.error('Error writing to file:', error);
        }
      });

      return filePath;

    } catch (error) {
      console.error('Error fetching image:', error);
    }

    return null;
  };

  const opacity = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  return (

    <View style={styles.wrapper}>

    <Animated.View style={[styles.box, { opacity }]}>

    <ImageBackground source={{uri: imageUrl ? imageUrl : ''}} style={styles.backgroundImage} >
      
      <Text style={styles.chs}>
        Глава: {chapter + 1} Сцена: {scene + 1}
      </Text>
      <View style={styles.container}>
      
      <Text style={styles.text}>
        {scenesinfo.chapters[chapter].scenes[scene].content_rus}
      </Text>
      <View style={styles.choiceContainer}>

        {scenario.chapters[chapter].scenes[scene].options.map((route, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {        

              handlePress();

              setTimeout(() => {
                if (route.next_chapter) {
                setChapter(route.next_chapter - 1);
                setScene(route.next_scene - 1);
                };

                if (!scenario.chapters[chapter].scenes[scene].end) {
                  setImageUrl(0);
                }

                setRoute(index);
                setScene(route.next_scene - 1);
                setContent(0);
              }, 500);
            }}
            style={styles.choiceButton}
          >
          
          <Text style={styles.buttonText}>{route.root_title}</Text>
          
          </TouchableOpacity>

        ))}
        <TouchableOpacity onPress={() => navigation.navigate('TitleScreen')} style={styles.button} ><Text style={styles.buttonText}>Меню</Text></TouchableOpacity>
      </View>     
    </View>
    
    </ImageBackground>

    </Animated.View>

    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
      width: '100%',
      backgroundColor: 'black',
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
  },
  backgroundImage: {
    backgroundColor: 'black',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  box: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  text: {
    width: '100%',
    fontSize: 15,
    padding: 10,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.75)',
    textAlign: 'center',
  },
  chs: {
    width: '100%',
    fontSize: 10,
    padding: 5,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.75)',
    textAlign: 'left',
  },
  choiceContainer: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  choiceButton: {
    backgroundColor: '#E18BEC', 
    borderRadius: 5, 
    padding: 10,
    margin: 2,
  },
  button: {
    backgroundColor: '#E18BEC', 
    borderRadius: 5, 
    padding: 10,
    margin: 2,
  },
});

export default GameScreen;
