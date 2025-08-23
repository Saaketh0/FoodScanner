import { Tabs } from 'expo-router';
import React from 'react';
import { ListProvider } from './listcontext';
import { FONTS } from '../constants/fonts';

export default function TabLayout() {
  return (
    <ListProvider>
      <Tabs
        initialRouteName="tracker"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            height: 80,
            paddingBottom: 0,
            paddingTop: -50,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.5)',
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
            letterSpacing: 0.5,
            fontFamily: FONTS.semiBold,
          },
        }}>
        <Tabs.Screen
          name="camera"
          options={{
            title: 'Scan',
            tabBarIcon: () => null,
          }}
        />
        <Tabs.Screen
          name="tracker"
          options={{
            title: 'Tracker',
            tabBarIcon: () => null,
          }}
        />
      </Tabs>
    </ListProvider>
  );
}
