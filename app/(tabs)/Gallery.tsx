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
  const navigation = useNavigation();

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
      .split(/[.\-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchImagesByCategory(activeCategory);
    loadUserName();
  }, [activeCategory]);

  const handleDogPress = (dog: DogImage) => {
    console.log("dog => ", dog)
    router.push({
      pathname: '/DogDetail',
      params: { dog: JSON.stringify(dog) },
    });
  };

  const renderImage = ({ item }: { item: DogImage }) => (
    <TouchableOpacity style={styles.imageCard} onPress={() => handleDogPress(item)}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <Text style={styles.caption}>{item.breed}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAACUCAMAAAAAoYNxAAAAM1BMVEXk5ueutLfp6uu/xMarsbTZ3N3h4+Sxt7q6v8Ld4OHIzM7V2Nq3vL/P0tTFycvS1delrLCbz0J0AAAEK0lEQVR4nO2c2ZLjIAxFjdgNXv7/awe7kx4nkwUQkUiN70s6/XRKdREgpAzDqVOnTp06derUqVOnTp069T8IYDA+TNO0aJP+7l5GT7NQ66o2pQ8rF8/N9EIwhNElUnFU+upG3Wm0IUR7x3ultk73yKztI9xf7NgbNHj5CnhjXmffFfT0MsTXQE8dMb8L8RVa9sLsHy66h8y2j4wXbCbwztzDKtQFxHuc2Zl9ril+xe2NcmJhDSuxicXEQjlW5Lk8yIl5ZLTzVEMsxLqwEVcY+SIuYnC1yGrmsQYs1UEWIrAgD7EeWUmWTDfVxzgxaw7kaifvyI7BzQFDnBIdvTPq08UlzAxnZxxxOmpQA8OyIpHFQhxmqDgP3YrcGaboYP8QORIfnAOWOJmZdgeEEY+saM9zkFkGeIk8kiIbZFbekSUpskcnjKRIilxWCXgm0j37C5Eb5LhkZtLEjDzGcSBj7lB/kUmP+V+I/IXGaLP8ziRHgExbAvUOT0xdAW1xkptJiaGqSnuHPNEio0pFF2TiupzHI0fiGhfgr6vU7w8NzEz+/ODRpRfy2ifaGZG8JgeVTztXrdT1rSSPC7PieC1BLUDiIsZFqKMRz6swJs/xBHkYTD1yZHp6r08aiiFdXJgrK3OcPUZ1iU6RP5McVGcNnmfKX+axnFkxt8uVZzqu/HZQ4S1wZeprqGcmvqM+UZE3ONuKDkp318yeT8HXVHQnCBmNtXsPMzfpQckc76BVL6a4CoJ7Ca2E42/2vBMMwa3PoJWSYeiNeJd+HOkEzN2a+lwAi4tWqJ9Jjf3DWrf0GeCrALZhGCndJinn6TsmePaJoyRjhm/A/Uf9Mu+R1WEZZ7m5+WrnGJ0cp6C1Nz3BJ1ofkn/dz7pT9+li/1+Uclx0F0ZJDGGOdqN9s/kpZa2Vk+em1qN9un88Jl/TrmJ4SgIAPoyPJ88yqCdNbm0ALWMN74VaWTcZSmgYpph5RH5OLYSkg/ZjfXxvqNdkawLq5AhsgA/Qyk2fNjUYmXUByYcWH54CNLKNJW6p7cfuV2Byr6WlWuVnbizbVekjwGIL9Nh+UwRouOoeKTYP9OuR5RZSY9NtPLu4gmJuurU06L7IYW43Xu4Rk0VlzI26sDOrV42gW1SUQBPY+MjcIMaEvDsztmSOmumrZcYRa2pggYwzeMKVd2BGrEFDld3uVf9e/Llz0DtVHkdrniEbqfLJGDQbcfXDPB+wqGt/gJkVWVSM1nFk5KMqdu4GDcpI5tIwB3R/JBq5cFIbWLa9W61FYQbNHuTSRIef/22ikjA36AFvoYIjXYth2gZSBQ2ALSZTmyh/wKDNOBFeBdsJspu6mZTLdYahqbRkKHtWreYnnz6jNdfMiCbfxso2cw9b30W554xeVl+SzUSef34LtQetuVGW3Sh7jgr6US5y3/oDD+I6UeymLPkAAAAASUVORK5CYII=' }}
            style={styles.avatar}
          />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Gallery</Text>

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
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
