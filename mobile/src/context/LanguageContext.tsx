// mobile/src/context/LanguageContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'es' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasSeenLanguageInfo: boolean;
  setHasSeenLanguageInfo: (value: boolean) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>('es');
  const [hasSeenLanguageInfo, setHasSeenLanguageInfoState] =
    useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Cargar idioma y flag desde AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem('appLanguage');
        const savedFlag = await AsyncStorage.getItem(
          'hasSeenLanguageInfo',
        );

        if (savedLang === 'es' || savedLang === 'en') {
          setLanguageState(savedLang);
        }
        if (savedFlag === 'true') {
          setHasSeenLanguageInfoState(true);
        }
      } catch (e) {
        console.warn('Error cargando idioma', e);
      } finally {
        setIsHydrated(true);
      }
    })();
  }, []);

  // Guardar idioma
  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('appLanguage', lang);
    } catch (e) {
      console.warn('Error guardando idioma', e);
    }
  };

  // Guardar flag de “ya vio el popup”
  const setHasSeenLanguageInfo = async (value: boolean) => {
    setHasSeenLanguageInfoState(value);
    try {
      await AsyncStorage.setItem(
        'hasSeenLanguageInfo',
        value ? 'true' : 'false',
      );
    } catch (e) {
      console.warn('Error guardando flag de idioma', e);
    }
  };

  // Mientras hidrata, evitamos renderizar la app con estado incorrecto
  if (!isHydrated) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        hasSeenLanguageInfo,
        setHasSeenLanguageInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      'useLanguage debe usarse dentro de LanguageProvider',
    );
  }
  return ctx;
};
