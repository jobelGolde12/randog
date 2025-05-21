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
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  const fetchImagesByCategory = async (category: string, append = false) => {
    try {
      setLoading(true);
      const endpoint =
        category === 'all'
          ? '/breeds/image/random/10'
          : `/breed/${category}/images/random/10`;
      const res = await fetch(`${DOG_API}${endpoint}`);
      const data = await res.json();
      const newImages: DogImage[] = (data.message || []).map((url: string) => ({
        url,
        breed: category === 'all' ? getBreedFromUrl(url) : category,
      }));

      setImages((prevImages) =>
        append ? [...prevImages, ...newImages] : newImages
      );
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
    setPage(1);
    fetchImagesByCategory(activeCategory);
    loadUserName();
  }, [activeCategory]);

  const handleDogPress = (dog: DogImage) => {
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

  const video = () => router.push('./VideoGallery');
  const home = () => router.push('./Gallery');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAqwMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAQMCB//EADIQAQACAQIDBwICCwAAAAAAAAABAgMEEQUhMRITIkFRYXEykWKBFCMzUnKCkqGxwdH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABL0egy6na30U/emOvxC1w8M02OI3r3lvWwM/vB8btRGnwRG0Ycf9MPPJodNkja2Gse8RsDNi11XCZjxaed/wz/qVXaJraa3iazHlIOAAAAAAAAAAAAAASncL0Xf37zJG+Os8vxSh0rN7xSOsztDT6fFXBirjr0rGwPuIiI2jo6AAACBxLQxqKTekRGWI5e/snuSDJ+c79egncXwRi1Xbr9OTn+aCAAAAAAAAAAAACVwysW12KJ6bzP2ho2b4Zbs6/DM+sx94aQAAAAAAFbx2u+mpbzi+39pUi745aI0+OvnN9/tCkgAAAAAAAAAAAAHaWnHet6zzrO8NRp8tc2KmSnS0bsssOF63uLd3kn9XM8p9JBejkTvG8TvDoAAAIPEdbXT4+xTnltHKPT3kFdxfP3mpjHWd6442/PzQTebTMzO8z1kAAAAAAAAAAAAAJAEzR8Qy6fas+PH6T1j4WuHiWmyx+0ik+l+TPOeYNXGbHaN4yUmP4nnl1enx/Vmp8RO8sztvz2OUewLXVcWnbs6av81v+Ku1rXtNrTNpnrMuAAAAAAAAAAAAAAAD20+mzaidsVN487eUJug4ZOTbLqImKeVPOflcUpWlYrSsViOkQCuwcIxV55rTefSOUJ2LT4cURFMda/EPUAfN8dLxtesWj3h9AIWbhmmyRO1OxPrVW6nhmfDvavjp6x1X4DJC/wBbw7HqI7VPBk9Yjr8qPLivhvNMlZraAfAAAAAAAAAAC04XoO1tnzRy60rP+ZRuG6X9Jz+KN8dOdvf2aGI2jYHQAAAAAAAEbW6Omqx7TyvH029EkBlMlLY8lqXja1Z2mHyu+LaTvMffUjx0jnt5wpIkAAAAAAAnoPbRY4y6rHSek25gveHaeNPpq1mPFPO3ylOQ6AAAAAAAAAADk9OjNa3D+j6i9I+nrX4aZU8dxx2cWXbz7M/HUFQAAAAAAm8GjfXR7VsANAAAAAAAAAAAAAg8ZjfRTPpaABQAAAA//9k=' }}
            style={styles.avatar}
          />
          <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Gallery</Text>

      {/* Filters */}
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

      {/* Gallery */}
      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Fetching cute dogs...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={images}
            numColumns={2}
            renderItem={renderImage}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            contentContainerStyle={styles.gallery}
          />

          {/* Show More */}
          <TouchableOpacity
            onPress={() => {
              setPage((prev) => prev + 1);
              fetchImagesByCategory(activeCategory, true);
            }}
            style={{
              backgroundColor: '#000',
              padding: 12,
              margin: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Show More</Text>
          </TouchableOpacity>
        </>
      )}

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
            {/* <TouchableOpacity style={styles.sidebarItem} onPress={video}>
              <Text style={styles.sidebarIcon}>🎥</Text>
              <Text style={styles.sidebarText}>Videos</Text>
            </TouchableOpacity> */}
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
