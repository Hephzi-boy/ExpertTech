import React from 'react';
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Text } from './AppText';
import { type CommunityPost } from '../data/mockData';
import { iconSize, palette, radii, spacing } from '../theme';

const feedAvatarSources: Record<NonNullable<CommunityPost['avatarVariant']>, ImageSourcePropType> = {
  maurice: require('../../assets/Ellipse (2).png'),
  boyd: require('../../assets/Base.png'),
  stranger: require('../../assets/Ellipse (1).png'),
  felix: require('../../assets/Ellipse.png'),
};

const feedMediaSources: Record<NonNullable<CommunityPost['imageAssetVariant']>, ImageSourcePropType> = {
  point3d_exterior: require('../../assets/point3d-commercial-imaging-ltd--45_-1tND3k-unsplash.png'),
  point3d_interior: require('../../assets/point3d-commercial-imaging-ltd--45_-1tND3k-unsplash (1).png'),
};

const reactionIconSources = {
  heart: require('../../assets/Heart.png'),
  comment: require('../../assets/Frame 1618868411.png'),
  send: require('../../assets/proicons_send.png'),
  bookmark: require('../../assets/BookmarkSimple.png'),
} as const;

const likedByGroupSources = {
  multiple: require('../../assets/Group.png'),
  single: require('../../assets/Group (1).png'),
} as const;

type HomeFeedSectionProps = {
  onOpenProfile: () => void;
  posts: CommunityPost[];
};

export function HomeFeedSection({
  onOpenProfile,
  posts,
}: HomeFeedSectionProps) {
  return (
    <View style={styles.feedStack}>
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Pressable
              accessibilityHint="Open profile"
              accessibilityRole="button"
              onPress={onOpenProfile}
              style={({ pressed }) => [styles.authorRow, pressed && styles.pressed]}
            >
              {post.avatarVariant ? (
                <Image source={feedAvatarSources[post.avatarVariant]} style={styles.feedAvatarAsset} />
              ) : post.avatarRingColor ? (
                <View
                  style={[
                    styles.avatarRing,
                    {
                      borderColor: post.avatarRingColor,
                    },
                  ]}
                >
                  <Image source={{ uri: post.avatarUri }} style={styles.avatar} />
                </View>
              ) : (
                <Image source={{ uri: post.avatarUri }} style={styles.avatar} />
              )}

              <View style={styles.authorCopy}>
                <Text style={styles.identityLine}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.metaInline}>{' • '}{post.audience}</Text>
                </Text>
                <Text style={styles.secondaryMeta}>
                  {post.category}
                  {' • '}
                  {post.postedAt}
                </Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityLabel="More options"
              accessibilityRole="button"
              style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons
                color={palette.text}
                name="dots-horizontal"
                size={iconSize.md}
              />
            </Pressable>
          </View>

          <Text style={styles.message}>{post.message}</Text>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons
              color={palette.textSoft}
              name="map-marker-outline"
              size={iconSize.md}
            />
            <Text style={styles.locationText}>{post.location}</Text>
            {post.statusLabel ? (
              <View
                style={[
                  styles.statusChip,
                  post.statusTone === 'sale'
                    ? styles.statusChipSale
                    : styles.statusChipRent,
                ]}
              >
                <MaterialCommunityIcons
                  color={post.statusTone === 'sale' ? '#8FB3FF' : '#66D893'}
                  name={post.statusTone === 'sale' ? 'tag-outline' : 'key-outline'}
                  size={15}
                />
                <Text
                  style={[
                    styles.statusText,
                    post.statusTone === 'sale'
                      ? styles.statusTextSale
                      : styles.statusTextRent,
                  ]}
                >
                  {post.statusLabel}
                </Text>
              </View>
            ) : null}
          </View>

          {post.imageUri ? (
            <View style={styles.mediaFrame}>
              <Image
                source={
                  post.imageAssetVariant
                    ? feedMediaSources[post.imageAssetVariant]
                    : { uri: post.imageUri }
                }
                style={[
                  styles.mediaImage,
                  post.mediaAspectRatio
                    ? {
                        aspectRatio: post.mediaAspectRatio,
                      }
                    : null,
                ]}
              />
              {post.mediaKind === 'carousel' ? (
                <>
                  <View style={styles.carouselArrow}>
                    <MaterialCommunityIcons
                      color="#F4F5F7"
                      name="chevron-right"
                      size={iconSize.md}
                    />
                  </View>
                  <View style={styles.carouselDots}>
                    {Array.from({ length: post.mediaDotCount ?? 4 }).map((_, index) => (
                      <View
                        key={`${post.id}-dot-${index}`}
                        style={[
                          styles.carouselDot,
                          index === (post.activeDotIndex ?? 0) && styles.carouselDotActive,
                        ]}
                      />
                    ))}
                  </View>
                </>
              ) : null}
              {post.mediaKind === 'video' ? (
                <>
                  <View style={styles.videoPlayButton}>
                    <MaterialCommunityIcons
                      color="#14161B"
                      name="play"
                      size={iconSize.md}
                    />
                  </View>
                  <View style={styles.videoDuration}>
                    <MaterialCommunityIcons
                      color="#FFFFFF"
                      name="play"
                      size={14}
                    />
                    <Text style={styles.videoDurationText}>{post.durationLabel}</Text>
                  </View>
                </>
              ) : null}
            </View>
          ) : null}

          <View style={styles.reactionRow}>
            <View style={styles.reactionGroup}>
              <Image source={reactionIconSources.heart} style={styles.reactionIcon} />
              <Text style={styles.reactionValue}>{post.likes}</Text>
            </View>

            <View style={styles.reactionGroup}>
              <Image source={reactionIconSources.comment} style={styles.reactionIcon} />
              {post.comments > 0 ? (
                <Text style={styles.reactionValue}>{post.comments}</Text>
              ) : null}
            </View>

            <Pressable accessibilityLabel="Share post" accessibilityRole="button">
              <Image source={reactionIconSources.send} style={styles.reactionIcon} />
            </Pressable>

            <View style={styles.reactionSpacer} />

            <View style={styles.reactionGroup}>
              <Image source={reactionIconSources.bookmark} style={styles.reactionIcon} />
              {post.saves > 0 ? (
                <Text style={styles.reactionValue}>{post.saves}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.likedRow}>
            <View style={styles.likedAvatars}>
              <Image
                source={
                  post.otherLikes > 0 ? likedByGroupSources.multiple : likedByGroupSources.single
                }
                style={post.otherLikes > 0 ? styles.likedGroupMultiple : styles.likedGroupSingle}
              />
            </View>
            <Text style={styles.likedText}>
              Liked by <Text style={styles.likedHandle}>{post.likedByHandle}</Text>
              {post.otherLikes > 0 ? ` and ${post.otherLikes} others` : ''}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  feedStack: {
    gap: 0,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.xs,
  },
  postCard: {
    borderBottomColor: '#1A1D23',
    borderBottomWidth: 1,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  postHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorRow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginRight: spacing.sm,
  },
  avatarRing: {
    borderRadius: radii.round,
    borderWidth: 2,
    padding: 2,
  },
  avatar: {
    borderRadius: radii.round,
    height: 44,
    width: 44,
  },
  feedAvatarAsset: {
    height: 44,
    width: 44,
  },
  authorCopy: {
    flex: 1,
  },
  identityLine: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 20,
  },
  authorName: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  metaInline: {
    color: '#7A7F89',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryMeta: {
    color: '#81848C',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
  },
  menuButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  message: {
    color: '#D5D7DB',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    paddingLeft: 56,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 56,
  },
  locationText: {
    color: '#B6BAC2',
    fontSize: 15,
    fontWeight: '500',
  },
  statusChip: {
    alignItems: 'center',
    borderRadius: radii.round,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusChipRent: {
    backgroundColor: '#10251A',
  },
  statusChipSale: {
    backgroundColor: '#13213A',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusTextRent: {
    color: '#66D893',
  },
  statusTextSale: {
    color: '#8FB3FF',
  },
  mediaFrame: {
    marginLeft: 56,
    marginTop: 2,
    position: 'relative',
  },
  mediaImage: {
    alignSelf: 'stretch',
    aspectRatio: 1.32,
    borderRadius: 12,
  },
  carouselArrow: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
    borderRadius: radii.round,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    width: 30,
  },
  carouselDots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  carouselDot: {
    backgroundColor: '#5D6168',
    borderRadius: radii.round,
    height: 7,
    width: 7,
  },
  carouselDotActive: {
    backgroundColor: '#36D884',
  },
  videoPlayButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: radii.round,
    height: 34,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -17,
    marginTop: -17,
    position: 'absolute',
    top: '50%',
    width: 34,
  },
  videoDuration: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 22, 27, 0.86)',
    borderRadius: radii.round,
    bottom: 10,
    flexDirection: 'row',
    gap: 6,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reactionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingLeft: 56,
  },
  reactionGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  reactionValue: {
    color: '#C7C9CE',
    fontSize: 17,
    fontWeight: '500',
  },
  reactionIcon: {
    height: 28,
    resizeMode: 'contain',
    width: 28,
  },
  reactionSpacer: {
    flex: 1,
  },
  likedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: 56,
  },
  likedAvatars: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  likedGroupMultiple: {
    height: 24,
    resizeMode: 'contain',
    width: 60,
  },
  likedGroupSingle: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  likedText: {
    color: '#B6B9C0',
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  likedHandle: {
    color: palette.text,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.86,
  },
});
