import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const YOUTUBE_VIDEO_IDS = [
  '3tkgYcKi80U', // Random Dog Video 1
  'tLwwr3NkEOI', // Random Dog Video 2
  'gp_AuKkQndE', // Random Dog Video 3
  'QINhWsucCek', // Random Dog Video 4
  'uA-1LY21e0I', // Random Dog Video 5
];

export default function GalleryScreen() {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

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
    // Simulate fetching random YouTube videos by shuffling the array
    const shuffledVideos = [...YOUTUBE_VIDEO_IDS].sort(() => Math.random() - 0.5);
    setVideos(shuffledVideos);
    setLoading(false);
    loadUserName();
  }, []);

  const renderVideo = ({ item }: { item: string }) => (
    <View style={styles.videoCard}>
      <WebView
        style={styles.videoPlayer}
        source={{ uri: `https://www.youtube.com/embed/${item}` }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
            {userName || 'Guest'}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>Random Dog Videos</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Loading dog videos...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          numColumns={1}
          renderItem={renderVideo}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.gallery}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  gallery: { paddingHorizontal: 10, paddingBottom: 20 },
  videoCard: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 1.78,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
