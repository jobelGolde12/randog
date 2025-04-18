import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const DOG_API = 'https://random.dog'; // Updated to random.dog API
const BREEDS = ['all', 'beagle', 'boxer', 'poodle'];

interface DogVideo {
  url: string;
  breed: string;
}

export default function GalleryScreen() {
  const [videos, setVideos] = useState<DogVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  const fetchVideosByCategory = async (category: string) => {
    try {
      setLoading(true);
      // If "all" category is selected, fetch 10 random dog videos, else fetch breed-specific
      const endpoint =
        category === 'all' ? '/woof.json?filter=mp4' : `/woof.json?filter=mp4&breed=${category}`;
      const res = await fetch(`${DOG_API}${endpoint}`);
      const data = await res.json();

      // Simulate that each video is categorized with a breed
      const videoList: DogVideo[] = (Array.isArray(data) ? data : [data]).map((video: any) => ({
        url: video.url,
        breed: category === 'all' ? 'Mixed' : category,
      }));

      setVideos(videoList);
    } catch (error) {
      console.error('Failed fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchVideosByCategory(activeCategory);
    loadUserName();
  }, [activeCategory]);

  const handleVideoPress = (video: DogVideo) => {
    console.log('dog video => ', video);
    router.push({
      pathname: '/VideoDetail',
      params: { video: JSON.stringify(video) },
    });
  };

  const renderVideo = ({ item }: { item: DogVideo }) => (
    <TouchableOpacity style={styles.videoCard} onPress={() => handleVideoPress(item)}>
      <Image source={{ uri: item.url }} style={styles.videoThumbnail} />
      <Text style={styles.caption}>{item.breed}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }}
            style={styles.avatar}
          />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
            {userName || 'Christine'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Videos</Text>

      <View style={styles.filters}>
        {BREEDS.map((breed) => (
          <TouchableOpacity
            key={breed}
            style={[styles.filterButton, activeCategory === breed && styles.activeFilter]}
            onPress={() => setActiveCategory(breed)}
          >
            <Text style={[styles.filterText, activeCategory === breed && styles.activeFilterText]}>
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Fetching cute dog videos...</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          numColumns={2}
          renderItem={renderVideo}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          contentContainerStyle={styles.gallery}
        />
      )}

      {/* Sidebar Menu */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSidebarVisible(false)} />
          <View style={styles.sidebar}>
            <TouchableOpacity style={styles.sidebarItem}>
              <Text style={styles.sidebarIcon}>🏠</Text>
              <Text style={styles.sidebarText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  menu: { fontSize: 24, fontWeight: 'bold' },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 5,
  },
  activeFilter: { backgroundColor: '#000' },
  filterText: { color: '#333' },
  activeFilterText: { color: '#fff' },
  gallery: { paddingHorizontal: 10, paddingBottom: 20 },
  videoCard: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 1.5, // slightly wider for a "video" feel
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  caption: {
    marginTop: 4,
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  sidebarIcon: { marginRight: 10, fontSize: 18 },
  sidebarText: { fontSize: 16 },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
