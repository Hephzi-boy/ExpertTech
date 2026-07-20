import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const BASE_CROP_WINDOW_SIZE = 59;
const OUTER_SIZE = 94;
const GREEN_RING = 4;
const WHITE_RING = 4;
const CROP_WINDOW_SIZE = OUTER_SIZE - (GREEN_RING + WHITE_RING) * 2;
const SCALE = CROP_WINDOW_SIZE / BASE_CROP_WINDOW_SIZE;

type StoryAvatarProps = {
  id: string;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  offsetX: number;
  offsetY: number;
};

export function StoryAvatar({
  imageUri,
  id: _id,
  imageWidth,
  imageHeight,
  offsetX,
  offsetY,
}: StoryAvatarProps) {
  return (
    <View style={styles.outerRing}>
      <View style={styles.innerBorder}>
        <View style={styles.cropWindow}>
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.avatarImage,
              {
                height: imageHeight * SCALE,
                left: offsetX * SCALE,
                top: offsetY * SCALE,
                width: imageWidth * SCALE,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#2F8F63',
    height: OUTER_SIZE,
    justifyContent: 'center',
    padding: GREEN_RING,
    width: OUTER_SIZE,
  },
  innerBorder: {
    backgroundColor: '#F2EFEA',
    borderRadius: 999,
    flex: 1,
    padding: WHITE_RING,
    width: '100%',
  },
  cropWindow: {
    backgroundColor: '#F2EFEA',
    borderRadius: 999,
    flex: 1,
    overflow: 'hidden',
  },
  avatarImage: {
    position: 'absolute',
  },
});
