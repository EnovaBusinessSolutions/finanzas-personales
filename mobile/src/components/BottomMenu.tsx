// mobile/src/components/BottomMenu.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type BottomTabKey = 'home' | 'reports' | 'goals' | 'settings';

type BottomMenuProps = {
  activeTab: BottomTabKey;
  onTabChange: (tab: BottomTabKey) => void;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    muted: string;
    income: string;
    expense: string;
    apiChipBg: string;
    apiChipText: string;
    navBg: string;
    navIconInactive: string;
    navIconActive: string;
    navLabelInactive: string;
    navLabelActive: string;
  };
};

export default function BottomMenu({
  activeTab,
  onTabChange,
  colors,
}: BottomMenuProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  return (
    <>
      {/* Barra inferior */}
      <View style={styles.navBarContainer}>
        <View
          style={[
            styles.navBar,
            { backgroundColor: colors.navBg },
          ]}
        >
          {/* Inicio */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => onTabChange('home')}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={
                activeTab === 'home'
                  ? colors.navIconActive
                  : colors.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                {
                  color:
                    activeTab === 'home'
                      ? colors.navLabelActive
                      : colors.navLabelInactive,
                  fontWeight: activeTab === 'home' ? '600' : '400',
                },
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          {/* Reportes */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => onTabChange('reports')}
          >
            <Ionicons
              name={
                activeTab === 'reports'
                  ? 'stats-chart'
                  : 'stats-chart-outline'
              }
              size={22}
              color={
                activeTab === 'reports'
                  ? colors.navIconActive
                  : colors.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                {
                  color:
                    activeTab === 'reports'
                      ? colors.navLabelActive
                      : colors.navLabelInactive,
                  fontWeight: activeTab === 'reports' ? '600' : '400',
                },
              ]}
            >
              Reportes
            </Text>
          </TouchableOpacity>

          {/* Botón central (+) */}
          <View style={styles.navPlusWrapper}>
            <TouchableOpacity
              style={[
                styles.navPlusCircle,
                { backgroundColor: colors.card },
              ]}
              onPress={() => setIsAddMenuOpen(true)}
            >
              <Ionicons name="add" size={30} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Metas */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => onTabChange('goals')}
          >
            <Ionicons
              name={activeTab === 'goals' ? 'flag' : 'flag-outline'}
              size={22}
              color={
                activeTab === 'goals'
                  ? colors.navIconActive
                  : colors.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                {
                  color:
                    activeTab === 'goals'
                      ? colors.navLabelActive
                      : colors.navLabelInactive,
                  fontWeight: activeTab === 'goals' ? '600' : '400',
                },
              ]}
            >
              Metas
            </Text>
          </TouchableOpacity>

          {/* Ajustes */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => onTabChange('settings')}
          >
            <Ionicons
              name={
                activeTab === 'settings'
                  ? 'settings'
                  : 'settings-outline'
              }
              size={22}
              color={
                activeTab === 'settings'
                  ? colors.navIconActive
                  : colors.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                {
                  color:
                    activeTab === 'settings'
                      ? colors.navLabelActive
                      : colors.navLabelInactive,
                  fontWeight: activeTab === 'settings' ? '600' : '400',
                },
              ]}
            >
              Ajustes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-menú del botón + */}
      <Modal
        visible={isAddMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddMenuOpen(false)}
      >
        <View style={styles.addMenuOverlay}>
          <View
            style={[
              styles.addMenuCard,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.addMenuHeader}>
              <Text
                style={[
                  styles.addMenuTitle,
                  { color: colors.text },
                ]}
              >
                Nuevo registro
              </Text>
              <TouchableOpacity onPress={() => setIsAddMenuOpen(false)}>
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.addMenuGrid}>
              <TouchableOpacity style={styles.addMenuItem}>
                <View
                  style={[
                    styles.addMenuItemIcon,
                    { backgroundColor: '#e5edf0' },
                  ]}
                >
                  <Ionicons
                    name="flag-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.addMenuItemLabel,
                    { color: colors.text },
                  ]}
                >
                  Meta financiera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addMenuItem}>
                <View
                  style={[
                    styles.addMenuItemIcon,
                    { backgroundColor: '#e5edf0' },
                  ]}
                >
                  <Ionicons
                    name="trending-up-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.addMenuItemLabel,
                    { color: colors.text },
                  ]}
                >
                  Inversión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addMenuItem}>
                <View
                  style={[
                    styles.addMenuItemIcon,
                    { backgroundColor: '#e5edf0' },
                  ]}
                >
                  <Ionicons
                    name="cash-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.addMenuItemLabel,
                    { color: colors.text },
                  ]}
                >
                  Finanza 3
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addMenuItem}>
                <View
                  style={[
                    styles.addMenuItemIcon,
                    { backgroundColor: '#e5edf0' },
                  ]}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.addMenuItemLabel,
                    { color: colors.text },
                  ]}
                >
                  Finanza 4
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addMenuItem}>
                <View
                  style={[
                    styles.addMenuItemIcon,
                    { backgroundColor: '#e5edf0' },
                  ]}
                >
                  <Ionicons
                    name="analytics-outline"
                    size={22}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.addMenuItemLabel,
                    { color: colors.text },
                  ]}
                >
                  Finanza 5
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Barra inferior
  navBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  navPlusWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
  },
  navPlusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Sub-menú +
  addMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  addMenuCard: {
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  addMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addMenuTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  addMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addMenuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMenuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addMenuItemLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
});
