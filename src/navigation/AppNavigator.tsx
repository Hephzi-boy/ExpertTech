import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  CreateScreen,
  ExploreScreen,
  HomeScreen,
  ListingDetailScreen,
  ProfileScreen,
  SavedScreen,
} from '../screens/AppScreens';
import {
  HomeTabIcon,
  NotificationTabIcon,
  ProfileTabIcon,
} from '../components/AppSvgIcons';
import { iconSize, openRundeFontFamilies, palette, radii } from '../theme';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ExploreStack = createNativeStackNavigator();
const SavedStack = createNativeStackNavigator();

const sharedStackOptions = {
  animation: 'slide_from_right' as const,
  contentStyle: {
    backgroundColor: palette.background,
  },
  headerShown: false,
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={sharedStackOptions}>
      <HomeStack.Screen component={HomeScreen} name="HomeFeed" />
      <HomeStack.Screen component={ListingDetailScreen} name="ListingDetail" />
    </HomeStack.Navigator>
  );
}

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={sharedStackOptions}>
      <ExploreStack.Screen component={ExploreScreen} name="ExploreFeed" />
      <ExploreStack.Screen component={ListingDetailScreen} name="ListingDetail" />
    </ExploreStack.Navigator>
  );
}

function SavedStackNavigator() {
  return (
    <SavedStack.Navigator screenOptions={sharedStackOptions}>
      <SavedStack.Screen component={SavedScreen} name="SavedFeed" />
      <SavedStack.Screen component={ListingDetailScreen} name="ListingDetail" />
    </SavedStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: palette.background,
        },
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: {
          fontFamily: openRundeFontFamilies.medium,
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 8,
        },
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabIcon,
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Home') {
            return <HomeTabIcon color={color} size={size} />;
          }

          if (route.name === 'Saved') {
            return <NotificationTabIcon color={color} size={size} />;
          }

          if (route.name === 'Profile') {
            return <ProfileTabIcon color={color} size={size} />;
          }

          let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'] = 'circle-outline';

          if (route.name === 'Explore') {
            iconName = 'magnify';
          } else if (route.name === 'Create') {
            iconName = focused ? 'plus-box' : 'plus-box-outline';
          }

          return <MaterialCommunityIcons color={color} name={iconName} size={size} />;
        },
      })}
    >
      <Tab.Screen component={HomeStackNavigator} name="Home" options={{ tabBarLabel: 'Feed' }} />
      <Tab.Screen component={ExploreStackNavigator} name="Explore" options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen
        component={CreateScreen}
        name="Create"
        options={{
          tabBarLabel: 'List',
        }}
      />
      <Tab.Screen component={SavedStackNavigator} name="Saved" options={{ tabBarLabel: 'Notification' }} />
      <Tab.Screen component={ProfileScreen} name="Profile" options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0E1116',
    borderTopColor: palette.borderSoft,
    height: 76,
    paddingBottom: 2,
    paddingTop: 8,
    position: 'absolute',
  },
  tabItem: {
    paddingTop: 2,
  },
  tabIcon: {
    marginTop: 4,
  },
});
