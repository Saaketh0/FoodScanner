import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the tracker tab when the app opens
    router.replace('/(tabs)/tracker');
  }, []);

  return null; // No UI needed, just redirect
}
