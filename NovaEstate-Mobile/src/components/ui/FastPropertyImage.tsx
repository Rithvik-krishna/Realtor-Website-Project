import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { Colors } from '@/theme';

import { getImageUrl } from '@/utils';

interface FastPropertyImageProps {
  uri: any;
  style?: ImageStyle | ImageStyle[];
  contentFit?: 'cover' | 'contain' | 'fill';
  blurhash?: string;
}

const DEFAULT_BLURHASH = 'L6PZf_0.00~q00%M%MWB00_3%M_3';

export function FastPropertyImage({
  uri,
  style,
  contentFit = 'cover',
  blurhash = DEFAULT_BLURHASH,
}: FastPropertyImageProps) {
  const [loading, setLoading] = useState(true);
  const safeUri = getImageUrl(uri);

  return (
    <View style={[styles.container, style]}>
      <Image
        source={safeUri ? { uri: safeUri } : undefined}
        style={[StyleSheet.absoluteFill, style]}
        contentFit={contentFit}
        placeholder={{ blurhash }}
        transition={300}
        onLoadEnd={() => setLoading(false)}
        cachePolicy="disk"
      />
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 13, 18, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
