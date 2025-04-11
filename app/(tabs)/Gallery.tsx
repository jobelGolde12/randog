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
} from 'react-native';

const DOG_API = 'https://random.dog/woof.json';

export default function GalleryScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const fetchDogImage = async () => {
    try {
      const res = await fetch(DOG_API);
      const data = await res.json();
      if (data.url.endsWith('.mp4') || data.url.endsWith('.webm')) {
        return fetchDogImage(); // Skip video
      }
      return data.url;
    } catch (error) {
      console.error('Failed fetching image:', error);
    }
  };

  const loadImages = async () => {
    const newImages: string[] = [];
    for (let i = 0; i < 10; i++) {
      const img = await fetchDogImage();
      if (img) newImages.push(img);
    }
    setImages(newImages);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const renderImage = ({ item }: { item: string }) => (
    <View style={styles.imageCard}>
      <Image source={{ uri: item }} style={styles.image} />
      <Text style={styles.caption}>Curly</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.title}>Gallery</Text>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {['All', 'Beagle', 'Boxer', 'Poodle'].map((breed, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              index === 0 && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                index === 0 && styles.activeFilterText,
              ]}
            >
              {breed}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Gallery Grid */}
      <FlatList
        data={images}
        numColumns={2}
        renderItem={renderImage}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={styles.gallery}
      />

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setSidebarVisible(false)}
        >
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
        </TouchableOpacity>
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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  menu: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#000',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  gallery: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  imageCard: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  caption: {
    marginTop: 4,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  sidebar: {
    width: 200,
    height: '100%',
    backgroundColor: '#e6f0fa',
    paddingTop: 80,
    paddingHorizontal: 20,
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
  },
});
