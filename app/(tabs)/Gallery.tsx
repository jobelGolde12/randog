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

const DOG_API = 'https://dog.ceo/api';
const BREEDS = ['all', 'beagle', 'boxer', 'poodle'];

interface DogImage {
  url: string;
  breed: string;
}

export default function GalleryScreen() {
  const [images, setImages] = useState<DogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userName, setUserName] = useState('');

  const fetchImagesByCategory = async (category: string) => {
    try {
      setLoading(true);
      const endpoint =
        category === 'all' ? '/breeds/image/random/10' : `/breed/${category}/images/random/10`;
      const res = await fetch(`${DOG_API}${endpoint}`);
      const data = await res.json();
      const imageList: DogImage[] = (data.message || []).map((url: string) => ({
        url,
        breed: category === 'all' ? getBreedFromUrl(url) : category,
      }));
      setImages(imageList);
    } catch (error) {
      console.error('Failed fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBreedFromUrl = (url: string): string => {
    const match = url.match(/breeds\/([a-zA-Z-]+)\//);
    if (match && match[1]) {
      const breedSlug = match[1];
      const parts = breedSlug.split('-');
      return parts.length > 1
        ? `${parts[1]} ${parts[0]}`
        : parts[0];
    }
    return 'Unknown';
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
      .split(/[.\-_]/) // Handle jane.doe or jane_doe
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchImagesByCategory(activeCategory);
    loadUserName();
  }, [activeCategory]);

  const renderImage = ({ item }: { item: DogImage }) => (
    <View style={styles.imageCard}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.caption}>{item.breed}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALgAAACUCAMAAAAXgxO4AAAAM1BMVEXk5ueutLe1u77q7Ozn6eqrsbTg4uPX2tvHy83U19nd3+HM0NKnrrHCx8myuLvR1Na8wcOVzPP6AAAEUElEQVR4nO2c2Y7dIAxAA5glkAD//7Ulmen0rnNZHEyqnJeRqj4cIWMMse80XVxcXFxcvAYS1A6FJF+rg0sES+2SC0xKu8iWhJRy+8Oi02oafO2FCiuXkt0hF8nNPLK6mBxnD9bf7pJxM2zEC/fa+sc9iCHVtV/ea+8sXlNLPgFq/WW1/626UWMtOmie4b2pRzuSOTif553M/TyQucvV3tXdMObm0668ZxnEHAq9N3Nq5w0oipMvRogWCMXaG5raHHSVt/SKWHyK5YGym3PaJQdT5502qKE0B1uaUG6gPELB13vLSOhdkQlvoMuJird4y0iVWRoXnMmZSFxVpsIfqFLi3JBSdhaatwtoXfAU5YLEvNU7mVNoQ2iNlCQeCKJcNOXCb0hipX3BGSMoEmFuD/FE/5uzMBjesn+NiBLiTK79dyeOeP96xTZUtDfw3lU5zDjivvetGQKOePfrPjgcb9k7H9bfkh/EQ1/vS/wS///FT5tV6h5pn+mex896cp62VpkmFHGC6vC09bhYUcT734Bw7pye4n3ipLf8876rnPYlC+PtcKHQPvFr7VnfxycVG8Wpvkic9hvQab+6tV6DCHs/zvplue1bPmnLCuR0G75kMTQ5/C8qs9/wEep+lVTd1i24JO+brHun6P4q8cq8IieO0AVXs0Fp25puWAs7PUfxnqaiaBnIe9uh+d3MNLeeNwid2YctOXmP5z1gs7boMlrH/jb/E+SnPSrZkEM1IMzjBNADbtSBGqHMmzkgts0BTbRl1a+ACqt/Wncp/RqGC+4HYLKzifJr1G0fdmPRzHbE2H6J0sFsBE3eKF4C3EOt85ndUlllrdZ6TqQ/2lql1DSsPwgBVju3rjFy7/22Jfdd6rnnMa7GzTr9p7Hsk7RKOzL57rZP85zf/8Y5j84OIw9bCmQfjp7bhB6NJQ+bbc7X+KXwjSKVBmuwdNPAADaYpznfbPfoNIk6gF7fne957tJHp3oH/Pvp5CJ35lfVs4ABtS44XR8pZnivceBUjKBp7yx87lCAgdBr9rRsJlLGcPQ+TUGCrb2rs3jsVbTgNl9MPO6eAfbj5H0DcjkoXkA1fqv6rH5IvGRP3reYM/xHrt9/VwJPPeKGC7R//s41R+0uA3t8mPyYS7zZd5iPyN3v1bF+iEWELuF9Y76iBLqo/DzVZI6w5q2dBlUs7ckFAoE3gnntZ8xmGjspwRJ5N7ZSguqaBx9o+Rba67x8TfUZijVOUInklQ+9oEm967v7BK12YqkKFlHdQ4NIhTd5oOzUZPPWbkgUyqtzsiPznlQoFi/4CJGytUAVLrg+8CGiBBnLYqXbHfMjS9kppAZZ8NIyUdAe9veUiMNA3iWdfmMcPn8p2J44U1VYFMwKAcocGxYFv6WJNPKIRP4lDmvIFIn8Y5/45vNI/ixFfTf7MfDceqX5F8ewya1t7WDi2UeQjXwofPagE4ixoO5uubi4uBiYPzDvQoOe0yNPAAAAAElFTkSuQmCC' }}
            style={styles.avatar}
          />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.title}>Gallery</Text>
      </View>

      <View style={styles.filters}>
        {BREEDS.map((breed) => (
          <TouchableOpacity
            key={breed}
            style={[styles.filterButton, activeCategory === breed && styles.activeFilter]}
            onPress={() => setActiveCategory(breed)}
          >
            <Text
              style={[styles.filterText, activeCategory === breed && styles.activeFilterText]}
            >
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Fetching cute dogs...</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          numColumns={2}
          renderItem={renderImage}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          contentContainerStyle={styles.gallery}
        />
      )}

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
  title: { fontSize: 22, fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
   },
  menu: { fontSize: 24, fontWeight: 'bold' },
  filters: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  filterButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: { backgroundColor: '#000' },
  filterText: { color: '#333' },
  activeFilterText: { color: '#fff' },
  gallery: { paddingHorizontal: 10, paddingBottom: 20 },
  imageCard: { flex: 1, margin: 8, alignItems: 'center' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  caption: {
    marginTop: 4,
    fontWeight: 'bold',
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
