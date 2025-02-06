import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ColorSchemeName } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useState, useEffect } from 'react';
import fetchCountries from '../lib/countriesApi';
import { useRouter } from 'expo-router';
import { useAppearance } from '@/hooks/useAppearance';
import { useTheme } from '@/context/ThemeContext';

const getThemeColor = (scheme: ColorSchemeName, key: string) => Colors[(scheme ?? 'light') as keyof typeof Colors][key as keyof (typeof Colors)['light']];

export default function MoreScreen() {
  const { colorScheme, setTheme } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<{
    languages: string[];
    regions: string[];
    categories: string[];
    appearance: string;
  }>({
    languages: [],
    regions: [],
    categories: [],
    appearance: 'system'
  });
  const { appearance: appearanceState, setAppearanceType } = useAppearance();

  console.log('Current colorScheme:', colorScheme);

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      const countryList = await fetchCountries();
      setCountries(countryList);
      setLoading(false);
    };

    loadCountries();
  }, []);

  const handleAppearanceChange = (newAppearance: string) => {
    console.log('Setting new appearance:', newAppearance.toLowerCase());
    setTheme(newAppearance.toLowerCase() as 'light' | 'dark');
    setModalVisible(false);
  };

  const getModalContent = () => {
    switch(activeSection) {
      case 'language':
        return {
          title: 'Select Languages',
          options: ['English', 'Spanish', 'French', 'German', 'Hindi'],
          multiSelect: true
        };
      case 'region':
        return {
          title: 'Select Countries',
          options: countries,
          multiSelect: true,
          loading: loading
        };
      case 'categories':
        return {
          title: 'Select Categories',
          options: ['Politics', 'Technology', 'Sports', 'Entertainment', 'Business'],
          multiSelect: true
        };
      case 'appearance':
        return {
          title: 'Choose Appearance',
          options: ['Light', 'Dark'],
          multiSelect: false,
          onSelect: handleAppearanceChange
        };
      default:
        return { title: '', options: [], multiSelect: false };
    }
  };

  const handleConfirmSelection = () => {
    setModalVisible(false);
    router.push('/');
  };

  const SelectionModal = ({ modalVisible, setModalVisible, colorScheme, loading, getModalContent, activeSection, selections, setSelections, onConfirm, style }: {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    colorScheme: ColorSchemeName;
    loading: boolean;
    getModalContent: () => {
      title: string;
      options: string[];
      multiSelect: boolean;
    };
    activeSection: string;
    selections: {
      languages: string[];
      regions: string[];
      categories: string[];
      appearance: string;
    };
    setSelections: React.Dispatch<React.SetStateAction<{
      languages: string[];
      regions: string[];
      categories: string[];
      appearance: string;
    }>>;
    onConfirm: () => void;
    style?: any;
  }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: getThemeColor(colorScheme, 'background') }, style]}>
          <Text style={[styles.modalTitle, { color: getThemeColor(colorScheme, 'text') }]}>
            {getModalContent().title}
          </Text>
          
          <ScrollView style={styles.optionsList}>
            {loading ? (
              <ActivityIndicator 
                size="large" 
                color={getThemeColor(colorScheme, 'tint')} 
              />
            ) : (
              (getModalContent().options || []).map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.optionItem}
                  onPress={() => {
                    if (!option) return;
                    setSelections(prev => ({
                      ...prev,
                      [activeSection as keyof typeof selections]: getModalContent().multiSelect 
                        ? (prev[activeSection as keyof typeof selections] as string[] || []).includes(option)
                          ? (prev[activeSection as keyof typeof selections] as string[]).filter((item: string) => item !== option)
                          : [...(prev[activeSection as keyof typeof selections] as string[] || []), option]
                        : option
                    }));
                  }}
                >
                  <Text style={[styles.optionText, { color: getThemeColor(colorScheme, 'text') }]}>
                    {option || ''}
                  </Text>
                  {(selections[activeSection as keyof typeof selections] as string[] || [])?.includes(option) && (
                    <Ionicons name="checkmark-circle" size={24} color={getThemeColor(colorScheme, 'tint')} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity 
            style={[styles.confirmButton, { 
              backgroundColor: getThemeColor(colorScheme, 'tint'),
              marginTop: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }]}
            onPress={onConfirm}
          >
            <Text style={[styles.confirmButtonText, { 
              color: colorScheme === 'dark' ? '#000' : '#fff',
              fontWeight: '700'
            }]}>
              Confirm Selection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const SettingSection = ({ icon, title, description, section }: { icon: string, title: string, description: string, section: string }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={() => {
        setActiveSection(section);
        setModalVisible(true);
      }}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={24} color={getThemeColor(colorScheme, 'tint')} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: getThemeColor(colorScheme, 'text') }]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, { color: getThemeColor(colorScheme, 'text') + '99' }]}>
          {selections[section as keyof typeof selections]?.length > 0 
            ? (Array.isArray(selections[section as keyof typeof selections]) 
                ? (selections[section as keyof typeof selections] as string[]).join(', ')
                : selections[section as keyof typeof selections])
            : description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={getThemeColor(colorScheme, 'text')} />
    </TouchableOpacity>
  );

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: Colors[colorScheme ?? 'light'].background 
    }}>
      <ScrollView 
        style={[styles.container, { 
          backgroundColor: Colors[colorScheme ?? 'light'].background 
        }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.header, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Personalization
        </Text>

        <SettingSection
          icon="language"
          title="Language Selection"
          description="Choose your preferred news languages"
          section="language"
        />

        <SettingSection
          icon="globe"
          title="Region & Country"
          description="Select your news regions of interest"
          section="region"
        />

        <SettingSection
          icon="list"
          title="News Categories"
          description="Customize your news topics"
          section="categories"
        />

        <SettingSection
          icon="moon"
          title="Appearance"
          description="Dark mode and reading preferences"
          section="appearance"
        />

        <SelectionModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          colorScheme={colorScheme}
          loading={loading}
          getModalContent={getModalContent}
          activeSection={activeSection}
          selections={selections}
          setSelections={setSelections}
          onConfirm={handleConfirmSelection}
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            color: Colors[colorScheme ?? 'light'].text
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff15',
    borderRadius: 12,
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  optionsList: {
    marginBottom: 20,
    maxHeight: '70%',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  optionText: {
    fontSize: 16,
  },
  confirmButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 