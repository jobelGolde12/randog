import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const DOG_API = 'https://random.dog';
const BREEDS = ['all'];

interface DogVideo {
  url: string;
  breed: string;
}

export default function GalleryScreen() {
  const [userName, setUserName] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // const navigation = useNavigation();
 
  const loadUserName = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        const { email } = JSON.parse(storedData);
        const name = email.split('@')[0];
        setUserName(capitalizeName(name));
      }
    } catch (error) {
      console.error('Error retrieving user name:', error);
    }
  };

  const capitalizeName = (name: string) => {
    return name
      .split(/[.\-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  useEffect(() => {
    loadUserName();
  }, []);

    const video = () => {
      router.push('./VideoGallery');
    };
    const home = () => {
      router.push('./Gallery');
    };
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
            style={styles.avatar}
          />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
            {userName || 'user'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Fixed Title */}
      <Text style={styles.title}>Videos</Text>
      {/* Scrollable Videos */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
  {[
    'https://www.youtube.com/embed/rChxzvFdp4c',
    'https://www.youtube.com/embed/pbA36Qg_of4',
    'https://www.youtube.com/embed/ul8izGUdmzU',
    'https://www.youtube.com/embed/tBwr8oIwTuE',
    'https://www.youtube.com/embed/nF-PTvbXYHA',
    'https://www.youtube.com/embed/Sg_4Rz4-xhc',
    'https://www.youtube.com/embed/SJIV7KjXW0s',
    'https://www.youtube.com/embed/YHOYDjJ1ta4',
  ].map((url, index) => (
    <View style={styles.videoWrapper} key={index}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  ))}
</ScrollView>


      {/* Sidebar */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSidebarVisible(false)} />
          <View style={styles.sidebar}>
            <TouchableOpacity style={styles.sidebarItem} onPress={home}>
              <Text style={styles.sidebarIcon}>🏠</Text>
              <Text style={styles.sidebarText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={video}>
              <Text style={styles.sidebarIcon}>🎥</Text>
              <Text style={styles.sidebarText}>Videos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menu: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    zIndex: 9,
  },
  scrollContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  videoWrapper: {
    width: '90%',
    height: 240,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    borderRadius: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 220,
    height: '100%',
    backgroundColor: '#e6f0fa',
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  sidebarIcon: {
    marginRight: 10,
    fontSize: 18,
  },
  sidebarText: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
