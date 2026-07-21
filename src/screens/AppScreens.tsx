import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  exploreFilters,
  listings,
  profileActions,
  savedBoards,
  stories,
  type CommunityPost,
  type Listing,
  type Story,
} from '../data/mockData';
import { ExpertListingWordmark } from '../components/ExpertListingWordmark';
import { CommentsModal } from '../components/CommentsModal';
import { HomeFeedSection } from '../components/HomeFeedSection';
import { MauriceReferenceAvatar } from '../components/MauriceReferenceAvatar';
import { Text } from '../components/AppText';
import { StoryAvatar } from '../components/StoryAvatar';
import {
  createPostComment,
  fetchFeedPosts,
  fetchPostComments,
  getDefaultFeedPosts,
  likePost,
} from '../services/communityApi';
import { type FeedComment, type FeedPost } from '../types/community';
import { iconSize, palette, radii, spacing } from '../theme';

const floatingActionButtonSource = require('../../assets/Button.png');
const likedByGroupSources = {
  multiple: require('../../assets/Group.png'),
  single: require('../../assets/Group (1).png'),
} as const;
const ENABLE_REMOTE_FEED = false;
const LOCAL_FEED_VIEWER = {
  displayName: 'You',
  id: Number.parseInt(process.env.EXPO_PUBLIC_FEED_USER_ID ?? '3', 10) || 3,
  username: 'you',
} as const;

function buildLocalComment(postId: string, content: string): FeedComment {
  const createdAt = new Date().toISOString();

  return {
    author: LOCAL_FEED_VIEWER,
    content,
    createdAt,
    id: Date.now(),
    postId: Number.parseInt(postId.replace(/\D+/g, ''), 10) || Date.now(),
  };
}

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = React.useState<FeedPost[]>(() => getDefaultFeedPosts());
  const [isFeedLoading, setIsFeedLoading] = React.useState(ENABLE_REMOTE_FEED);
  const [feedError, setFeedError] = React.useState<string | null>(null);
  const [selectedPost, setSelectedPost] = React.useState<FeedPost | null>(null);
  const [comments, setComments] = React.useState<FeedComment[]>([]);
  const [commentsError, setCommentsError] = React.useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = React.useState(false);
  const [commentDraft, setCommentDraft] = React.useState('');
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false);
  const [localCommentsByPostId, setLocalCommentsByPostId] = React.useState<Record<string, FeedComment[]>>({});

  React.useEffect(() => {
    if (!ENABLE_REMOTE_FEED) {
      return;
    }

    void loadLiveFeed();
  }, []);

  async function loadLiveFeed() {
    if (!ENABLE_REMOTE_FEED) {
      return;
    }

    setIsFeedLoading(true);
    setFeedError(null);

    try {
      const nextPosts = await fetchFeedPosts();
      setPosts(nextPosts.length > 0 ? nextPosts : getDefaultFeedPosts());
    } catch (error) {
      setPosts(getDefaultFeedPosts());
      setFeedError(
        error instanceof Error
          ? `${error.message} Showing the local preview instead.`
          : 'Unable to load the live feed. Showing the local preview instead.',
      );
    } finally {
      setIsFeedLoading(false);
    }
  }

  async function openComments(post: FeedPost) {
    setSelectedPost(post);
    setCommentDraft('');
    setCommentsError(null);

    if (!post.remoteId) {
      setComments(localCommentsByPostId[post.id] ?? []);
      setCommentsLoading(false);
      return;
    }

    setComments([]);
    setCommentsLoading(true);

    try {
      const nextComments = await fetchPostComments(post.remoteId);
      setComments(nextComments);
    } catch (error) {
      setCommentsError(
        error instanceof Error ? error.message : 'Unable to load comments right now.',
      );
    } finally {
      setCommentsLoading(false);
    }
  }

  function closeComments() {
    if (isSubmittingComment) {
      return;
    }

    setSelectedPost(null);
    setCommentDraft('');
    setComments([]);
    setCommentsError(null);
    setCommentsLoading(false);
  }

  async function submitComment() {
    const trimmedComment = commentDraft.trim();

    if (!selectedPost || trimmedComment.length === 0 || isSubmittingComment) {
      return;
    }

    setIsSubmittingComment(true);

    if (!selectedPost.remoteId) {
      const createdComment = buildLocalComment(selectedPost.id, trimmedComment);

      setLocalCommentsByPostId((currentComments) => ({
        ...currentComments,
        [selectedPost.id]: [...(currentComments[selectedPost.id] ?? []), createdComment],
      }));
      setComments((currentComments) => [...currentComments, createdComment]);
      setCommentDraft('');
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                comments: post.comments + 1,
              }
            : post,
        ),
      );
      setSelectedPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              comments: currentPost.comments + 1,
            }
          : currentPost,
      );
      setIsSubmittingComment(false);
      return;
    }

    try {
      const createdComment = await createPostComment(selectedPost.remoteId, trimmedComment);
      setComments((currentComments) => [...currentComments, createdComment]);
      setCommentDraft('');
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.remoteId === selectedPost.remoteId
            ? {
                ...post,
                comments: post.comments + 1,
              }
            : post,
        ),
      );
      setSelectedPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              comments: currentPost.comments + 1,
            }
          : currentPost,
      );
    } catch (error) {
      Alert.alert(
        'Unable to post comment',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleLike(post: FeedPost) {
    if (post.isLiked || post.isLikePending) {
      return;
    }

    if (!post.remoteId) {
      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
                ...currentPost,
                isLiked: true,
                likes: currentPost.likes + 1,
              }
            : currentPost,
        ),
      );
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((currentPost) =>
        currentPost.id === post.id
          ? {
              ...currentPost,
              isLiked: true,
              isLikePending: true,
              likes: currentPost.likes + 1,
            }
          : currentPost,
      ),
    );

    try {
      await likePost(post.remoteId);
      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
                ...currentPost,
                isLikePending: false,
              }
            : currentPost,
        ),
      );
    } catch (error) {
      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
                ...currentPost,
                isLiked: false,
                isLikePending: false,
                likes: Math.max(currentPost.likes - 1, 0),
              }
            : currentPost,
        ),
      );
      Alert.alert(
        'Unable to like post',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  }

  return (
    <View style={styles.homeScreenRoot}>
      <ScreenScroll bottomPaddingOffset={-90}>
        <View style={styles.homeHeaderRow}>
          <ExpertListingWordmark />
          <View style={styles.homeHeaderActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.getParent()?.navigate('Profile')}
              style={({ pressed }) => [styles.headerTextButton, pressed && styles.cardPressed]}
            >
              <Text style={styles.homeHeaderSignIn}>Sign In</Text>
            </Pressable>
            <Pressable
              accessibilityHint="Switch to the Explore tab"
              accessibilityLabel="Open navigation menu"
              accessibilityRole="button"
              onPress={() => navigation.getParent()?.navigate('Explore')}
              style={({ pressed }) => [styles.homeMenuButton, pressed && styles.cardPressed]}
            >
              <HamburgerIcon />
            </Pressable>
          </View>
        </View>

        <View style={styles.storyStrip}>
          <ScrollView
            contentContainerStyle={styles.storyRail}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </ScrollView>
        </View>

        {ENABLE_REMOTE_FEED && isFeedLoading ? (
          <View style={styles.liveFeedStateCard}>
            <ActivityIndicator color={palette.accent} />
            <Text style={styles.liveFeedStateText}>Loading the live feed...</Text>
          </View>
        ) : null}

        {ENABLE_REMOTE_FEED && feedError ? (
          <Pressable
            onPress={() => {
              void loadLiveFeed();
            }}
            style={({ pressed }) => [styles.liveFeedStateCard, styles.liveFeedErrorCard, pressed && styles.cardPressed]}
          >
            <Text style={styles.liveFeedErrorText}>{feedError}</Text>
            <Text style={styles.liveFeedRetryText}>Tap to retry the live feed.</Text>
          </Pressable>
        ) : null}

        <HomeFeedSection
          onPressComment={(post) => {
            void openComments(post);
          }}
          onPressLike={(post) => {
            void handleLike(post);
          }}
          onOpenProfile={() => navigation.getParent()?.navigate('Profile')}
          posts={posts}
        />
      </ScreenScroll>

      <Pressable
        accessibilityHint="Open the create listing tab"
        accessibilityLabel="Create listing"
        accessibilityRole="button"
        onPress={() => navigation.getParent()?.navigate('Create')}
        style={({ pressed }) => [
          styles.floatingActionButton,
          {
            bottom: 40 + insets.bottom,
          },
          pressed && styles.cardPressed,
        ]}
      >
        <Image source={floatingActionButtonSource} style={styles.floatingActionButtonImage} />
      </Pressable>

      <CommentsModal
        comments={comments}
        commentsError={commentsError}
        commentsLoading={commentsLoading}
        draftValue={commentDraft}
        isSubmittingComment={isSubmittingComment}
        onChangeDraftValue={setCommentDraft}
        onClose={closeComments}
        onRetry={() => {
          if (selectedPost) {
            void openComments(selectedPost);
          }
        }}
        onSubmitComment={() => {
          void submitComment();
        }}
        post={selectedPost}
        visible={selectedPost !== null}
      />
    </View>
  );
}

export function ExploreScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = React.useState(exploreFilters[0]);
  const filteredListings = getFilteredListings(activeFilter);

  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Discover</Text>
          <Text style={styles.pageSubtitle}>Find what is available around you.</Text>
        </View>
        <ActionIcon
          name="tune-variant"
          onPress={() => setActiveFilter(exploreFilters[0])}
        />
      </View>

      <View style={styles.searchShell}>
        <MaterialCommunityIcons
          color={palette.textSoft}
          name="magnify"
          size={iconSize.md}
        />
        <Text style={styles.searchText}>Search by location, agent, or style</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.filterRail}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {exploreFilters.map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.mapPreview}>
        <View style={styles.mapGlow} />
        <View style={styles.mapMarker}>
          <MaterialCommunityIcons
            color={palette.background}
            name="map-marker"
            size={iconSize.md}
          />
        </View>
        <Text style={styles.mapTitle}>Lekki, Lagos</Text>
        <Text style={styles.mapCopy}>
          {filteredListings.length} curated {filteredListings.length === 1 ? 'property' : 'properties'} for {activeFilter.toLowerCase()} stays
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Near you</Text>
        <Text style={styles.sectionAction}>Map view</Text>
      </View>

      {filteredListings.length > 0 ? (
        filteredListings.map((listing) => (
          <PropertyCard
            key={listing.id}
            listing={listing}
            onPress={() =>
              navigation.navigate('ListingDetail', {
                listingId: listing.id,
              })
            }
            variant="media"
          />
        ))
      ) : (
        <View style={styles.emptyStateCard}>
          <Text style={styles.emptyStateTitle}>No matches yet</Text>
          <Text style={styles.emptyStateBody}>
            Try another filter to see more properties in this area.
          </Text>
        </View>
      )}
    </ScreenScroll>
  );
}

export function SavedScreen({ navigation }: any) {
  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Saved</Text>
          <Text style={styles.pageSubtitle}>Boards and shortlists you can revisit fast.</Text>
        </View>
        <ActionIcon name="bookmark-multiple-outline" />
      </View>

      <View style={styles.boardGrid}>
        {savedBoards.map((board, index) => (
          <View key={board.id} style={styles.boardCard}>
            <View
              style={[
                styles.boardIconWrap,
                index === 0
                  ? styles.boardAccentGreen
                  : index === 1
                    ? styles.boardAccentOrange
                    : styles.boardAccentBlue,
              ]}
            >
              <MaterialCommunityIcons
                color={palette.text}
                name={index === 0 ? 'heart-outline' : index === 1 ? 'briefcase-outline' : 'camera-outline'}
                size={iconSize.md}
              />
            </View>
            <Text style={styles.boardTitle}>{board.name}</Text>
            <Text style={styles.boardCount}>{board.count} listings</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your shortlist</Text>
        <Text style={styles.sectionAction}>Updated today</Text>
      </View>

      {listings.slice(0, 3).map((listing) => (
        <PropertyCard
          key={listing.id}
          listing={listing}
          onPress={() =>
            navigation.navigate('ListingDetail', {
              listingId: listing.id,
            })
          }
          variant="media"
        />
      ))}
    </ScreenScroll>
  );
}

export function CreateScreen() {
  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>Create listing</Text>
          <Text style={styles.pageSubtitle}>Start a polished post before you publish.</Text>
        </View>
        <ActionIcon name="file-document-edit-outline" />
      </View>

      <View style={styles.composeHero}>
        <Text style={styles.composeEyebrow}>Fast publish flow</Text>
        <Text style={styles.composeTitle}>Build a premium listing with complete details.</Text>
        <Text style={styles.composeCopy}>
          Add media, pricing, amenities, and a trusted contact path in one flow.
        </Text>
      </View>

      {[
        {
          icon: 'image-multiple-outline',
          title: 'Upload hero images',
          body: 'Show the exterior, living room, and signature design moments first.',
        },
        {
          icon: 'map-marker-radius-outline',
          title: 'Drop the exact location',
          body: 'Help visitors understand the area before they request a tour.',
        },
        {
          icon: 'cash-multiple',
          title: 'Set rent, sale, or shortlet pricing',
          body: 'Price clarity keeps inquiry quality high and reduces back-and-forth.',
        },
        {
          icon: 'shield-check-outline',
          title: 'Attach verification',
          body: 'Trust signals need to show up before users open the detail page.',
        },
      ].map((step) => (
        <View key={step.title} style={styles.composeStep}>
          <View style={styles.composeIconWrap}>
            <MaterialCommunityIcons color={palette.accent} name={step.icon as never} size={iconSize.md} />
          </View>
          <View style={styles.composeStepCopy}>
            <Text style={styles.composeStepTitle}>{step.title}</Text>
            <Text style={styles.composeStepBody}>{step.body}</Text>
          </View>
        </View>
      ))}

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Start draft</Text>
      </Pressable>
    </ScreenScroll>
  );
}

export function ProfileScreen() {
  return (
    <ScreenScroll>
      <View style={styles.profileHero}>
        <View style={styles.profileRow}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
            }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileIdentity}>
            <Text style={styles.profileName}>Marvis Adeniran</Text>
            <Text style={styles.profileHandle}>@marvislists</Text>
          </View>
          <ActionIcon name="cog-outline" />
        </View>

        <View style={styles.profileStats}>
          <StatBox label="Listings" value="18" />
          <StatBox label="Saved" value="42" />
          <StatBox label="Views" value="9.2k" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.sectionAction}>Verified</Text>
      </View>

      {profileActions.map((action) => (
        <Pressable key={action} style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>{action}</Text>
          <MaterialCommunityIcons
            color={palette.textSoft}
            name="chevron-right"
            size={iconSize.md}
          />
        </Pressable>
      ))}
    </ScreenScroll>
  );
}

export function ListingDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const listing = listings.find((item) => item.id === route.params.listingId) ?? listings[0];

  return (
    <View style={styles.detailRoot}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 160 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{
            uri:
              listing.imageUri ??
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.detailHero}
        >
          <View style={styles.heroOverlay} />
          <SafeAreaView edges={['top']} style={styles.detailTopBar}>
            <ActionIcon name="arrow-left" onPress={() => navigation.goBack()} />
            <ActionIcon name="bookmark-outline" />
          </SafeAreaView>
          <View style={styles.detailHeroBody}>
            <View style={styles.tagRail}>
              {listing.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.detailTitle}>{listing.title}</Text>
            <Text style={styles.detailLocation}>{listing.location}</Text>
          </View>
        </ImageBackground>

        <View style={styles.detailBody}>
          <View style={styles.detailPriceRow}>
            <View>
              <Text style={styles.detailPriceLabel}>Starting price</Text>
              <Text style={styles.detailPrice}>{listing.price}</Text>
            </View>
            <View style={styles.detailViews}>
              <MaterialCommunityIcons
                color={palette.accent}
                name="eye-outline"
                size={iconSize.sm}
              />
              <Text style={styles.detailViewsText}>{listing.views} views this week</Text>
            </View>
          </View>

          <View style={styles.metricRail}>
            <MetricPill icon="bed-king-outline" label={`${listing.beds} beds`} />
            <MetricPill icon="shower" label={`${listing.baths} baths`} />
            <MetricPill icon="floor-plan" label={listing.area} />
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>About this property</Text>
            <Text style={styles.detailBodyCopy}>{listing.caption}</Text>
            <Text style={styles.detailBodyCopy}>
              Thoughtful circulation, premium finishes, and a quiet premium address make this a strong
              option for short stays, relocation, or executive hosting.
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Why it stands out</Text>
            <View style={styles.detailFeatureList}>
              {[
                'Private parking and guest welcome zone',
                'Fast Wi-Fi and backup power',
                'Clean, neutral interior for brand shoots',
                'Verified host with responsive tour support',
              ].map((item) => (
                <View key={item} style={styles.detailFeatureRow}>
                  <MaterialCommunityIcons
                    color={palette.accent}
                    name="check-circle-outline"
                    size={iconSize.sm}
                  />
                  <Text style={styles.detailFeatureText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.agentCard}>
            <Image source={{ uri: listing.authorAvatar }} style={styles.agentAvatar} />
            <View style={styles.agentCopy}>
              <Text style={styles.agentName}>{listing.author}</Text>
              <Text style={styles.agentRole}>{listing.authorRole}</Text>
            </View>
            <View style={styles.agentBadge}>
              <MaterialCommunityIcons
                color={palette.background}
                name="shield-check"
                size={iconSize.sm}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.detailFooter,
          {
            paddingBottom: spacing.md + insets.bottom,
          },
        ]}
      >
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Message</Text>
        </Pressable>
        <Pressable style={styles.primaryButtonWide}>
          <Text style={styles.primaryButtonText}>Book tour</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

function ScreenScroll({
  children,
  contentContainerStyle,
  bottomPaddingOffset = 0,
}: {
  children: React.ReactNode;
  contentContainerStyle?: object;
  bottomPaddingOffset?: number;
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={['top']} style={styles.screenRoot}>
      <ScrollView
        contentContainerStyle={[
          styles.screenContent,
          contentContainerStyle,
          {
            paddingBottom: 120 + insets.bottom + bottomPaddingOffset,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function CommunityPostCard({
  post,
  onOpenProfile,
}: {
  post: CommunityPost;
  onOpenProfile: () => void;
}) {
  return (
    <View style={styles.communityPostCard}>
      <View style={styles.communityPostHeader}>
        <Pressable
          accessibilityHint="Open profile"
          accessibilityRole="button"
          onPress={onOpenProfile}
          style={({ pressed }) => [styles.communityAuthorRow, pressed && styles.cardPressed]}
        >
          {post.id === 'post-1' ? (
            <MauriceReferenceAvatar size={46} />
          ) : (
            <Image source={{ uri: post.avatarUri }} style={styles.communityAvatar} />
          )}
          {post.id === 'post-1' ? (
            <View style={styles.communityAuthorCopy}>
              <Text style={styles.communityIdentityLine}>
                <Text style={styles.communityAuthorName}>{post.author}</Text>
                <Text style={styles.communityMetaInline}>{' \u2022 '}{post.audience}</Text>
              </Text>
              <Text style={styles.communitySecondaryMeta}>
                {post.category}
                {' \u2022 '}
                {post.postedAt}
              </Text>
            </View>
          ) : null}
          <View style={[styles.communityAuthorCopy, post.id === 'post-1' && styles.communityHidden]}>
            <Text style={styles.communityIdentityLine}>
              <Text style={styles.communityAuthorName}>{post.author}</Text>
              <Text style={styles.communityMetaInline}> • {post.audience}</Text>
            </Text>
            <Text style={styles.communitySecondaryMeta}>
              {post.category} • {post.postedAt}
            </Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityLabel="More options"
          accessibilityRole="button"
          style={({ pressed }) => [styles.communityMenuButton, pressed && styles.cardPressed]}
        >
          <MaterialCommunityIcons
            color={palette.text}
            name="dots-horizontal"
            size={iconSize.md}
          />
        </Pressable>
      </View>

      <Text style={styles.communityMessage}>{post.message}</Text>

      <View style={styles.communityLocationRow}>
        <MaterialCommunityIcons
          color={palette.textSoft}
          name="map-marker-outline"
          size={iconSize.md}
        />
        <Text style={styles.communityLocationText}>{post.location}</Text>
      </View>

      <View style={styles.communityReactionRow}>
        <View style={styles.communityReactionGroup}>
          <MaterialCommunityIcons
            color={palette.text}
            name="heart-outline"
            size={30}
          />
          <Text style={styles.communityReactionValue}>{post.likes}</Text>
        </View>
        <View style={styles.communityReactionGroup}>
          <MaterialCommunityIcons
            color={palette.text}
            name="comment-outline"
            size={30}
          />
          {post.comments > 0 ? (
            <Text style={styles.communityReactionValue}>{post.comments}</Text>
          ) : null}
        </View>
        <Pressable accessibilityLabel="Share post" accessibilityRole="button">
          <MaterialCommunityIcons
            color={palette.text}
            name="send-outline"
            size={30}
          />
        </Pressable>
        <View style={styles.communityReactionSpacer} />
        <View style={styles.communityReactionGroup}>
          <MaterialCommunityIcons
            color={palette.text}
            name="bookmark-outline"
            size={30}
          />
          <Text style={styles.communityReactionValue}>{post.saves}</Text>
        </View>
      </View>

      <View style={styles.communityLikedRow}>
        <View style={styles.communityLikedAvatars}>
          <Image
            source={post.otherLikes > 0 ? likedByGroupSources.multiple : likedByGroupSources.single}
            style={
              post.otherLikes > 0
                ? styles.communityLikedGroupMultiple
                : styles.communityLikedGroupSingle
            }
          />
        </View>
        <Text style={styles.communityLikedText}>
          Liked by <Text style={styles.communityLikedHandle}>{post.likedByHandle}</Text>
          {post.otherLikes > 0 ? ` and ${post.otherLikes} others` : ''}
        </Text>
      </View>
    </View>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <View style={styles.storyCard}>
      <View style={styles.storyAvatar}>
        <StoryAvatar
          id={story.id}
          imageHeight={story.avatarHeight}
          imageUri={story.imageUri}
          imageWidth={story.avatarWidth}
          offsetX={story.avatarOffsetX}
          offsetY={story.avatarOffsetY}
        />
      </View>
      <Text numberOfLines={1} style={styles.storyName}>
        {story.name}
      </Text>
    </View>
  );
}

function getFilteredListings(activeFilter: string) {
  if (activeFilter === 'All') {
    return listings;
  }

  if (activeFilter === 'Top rated') {
    return [...listings]
      .filter((listing) => listing.verified || listing.likes >= 25 || listing.views >= 150)
      .sort((left, right) => right.likes - left.likes || right.views - left.views);
  }

  const targetMarket = activeFilter.toLowerCase();

  return listings.filter((listing) => listing.marketType === targetMarket);
}

function PropertyCard({
  listing,
  onPress,
  variant,
}: {
  listing: Listing;
  onPress: () => void;
  variant: 'compact' | 'media';
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.propertyCard, pressed && styles.cardPressed]}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardAuthorRow}>
          <View
            style={[
              styles.authorAvatarRing,
              {
                borderColor: listing.authorAccent,
              },
            ]}
          >
            <Image source={{ uri: listing.authorAvatar }} style={styles.authorAvatar} />
          </View>
          <View style={styles.authorCopy}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{listing.author}</Text>
              {listing.verified ? (
                <MaterialCommunityIcons
                  color={palette.accent}
                  name="check-decagram"
                  size={iconSize.sm}
                />
              ) : null}
            </View>
            <Text style={styles.authorRoleText}>
              {listing.authorRole} · {listing.postedAt}
            </Text>
          </View>
        </View>
        <ActionIcon name="dots-horizontal" small />
      </View>

      <View style={styles.tagRail}>
        {listing.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={styles.cardTagChip}>
            <Text style={styles.cardTagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.cardTitle}>{listing.title}</Text>
      <Text style={styles.cardCaption}>{listing.caption}</Text>

      <View style={styles.cardMetaRow}>
        <MetaItem icon="map-marker-outline" label={listing.location} />
        <MetaItem icon="cash-multiple" label={listing.price} />
      </View>

      <View style={styles.metricRail}>
        <MetricPill icon="bed-king-outline" label={`${listing.beds} beds`} />
        <MetricPill icon="shower" label={`${listing.baths} baths`} />
        <MetricPill icon="floor-plan" label={listing.area} />
      </View>

      {variant === 'media' && listing.imageUri ? (
        <Image source={{ uri: listing.imageUri }} style={styles.listingImage} />
      ) : (
        <View style={styles.textOnlyCallout}>
          <MaterialCommunityIcons color={palette.accent} name="home-city-outline" size={iconSize.md} />
          <Text style={styles.textOnlyCalloutText}>
            Tap into a high-intent feed of trusted hosts, architects, and premium stays.
          </Text>
        </View>
      )}

      <View style={styles.reactionRow}>
        <ReactionStat icon="heart-outline" value={listing.likes} />
        <ReactionStat icon="message-outline" value={listing.comments} />
        <ReactionStat icon="eye-outline" value={listing.views} />
        <View style={styles.reactionSpacer} />
        <MaterialCommunityIcons color={palette.textMuted} name="send-outline" size={iconSize.md} />
      </View>
    </Pressable>
  );
}

function MetaItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons color={palette.textSoft} name={icon as never} size={iconSize.sm} />
      <Text numberOfLines={1} style={styles.metaLabel}>
        {label}
      </Text>
    </View>
  );
}

function MetricPill({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.metricPill}>
      <MaterialCommunityIcons color={palette.accent} name={icon as never} size={iconSize.sm} />
      <Text style={styles.metricPillText}>{label}</Text>
    </View>
  );
}

function ReactionStat({ icon, value }: { icon: string; value: number }) {
  return (
    <View style={styles.reactionStat}>
      <MaterialCommunityIcons color={palette.textMuted} name={icon as never} size={iconSize.md} />
      <Text style={styles.reactionValue}>{value}</Text>
    </View>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionIcon({
  name,
  onPress,
  small = false,
}: {
  name: string;
  onPress?: () => void;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionIcon,
        small && styles.actionIconSmall,
        pressed && styles.cardPressed,
      ]}
    >
      <MaterialCommunityIcons
        color={palette.text}
        name={name as never}
        size={small ? iconSize.sm : iconSize.md}
      />
    </Pressable>
  );
}

function HamburgerIcon() {
  return (
    <View style={styles.hamburgerIcon}>
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreenRoot: {
    flex: 1,
  },
  screenRoot: {
    flex: 1,
    backgroundColor: palette.background,
  },
  screenContent: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  homeHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
    paddingTop: spacing.xs,
  },
  homeHeaderActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerTextButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 2,
  },
  homeHeaderSignIn: {
    color: '#B8B8B8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  homeMenuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  floatingActionButton: {
    position: 'absolute',
    right: spacing.md,
    zIndex: 20,
  },
  floatingActionButtonImage: {
    height: 76,
    width: 76,
  },
  communityPostCard: {
    gap: spacing.lg,
  },
  communityPostHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  communityAuthorRow: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginRight: spacing.sm,
  },
  communityAvatar: {
    borderRadius: radii.round,
    height: 46,
    width: 46,
  },
  communityHidden: {
    display: 'none',
  },
  communityAuthorCopy: {
    flex: 1,
  },
  communityIdentityLine: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 20,
  },
  communityAuthorName: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '700',
  },
  communityMetaInline: {
    color: '#70737C',
    fontSize: 16,
    fontWeight: '500',
  },
  communitySecondaryMeta: {
    color: '#7D8087',
    fontSize: 14,
    lineHeight: 19,
    marginTop: 2,
  },
  communityMenuButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  communityMessage: {
    color: '#D8D8DA',
    fontSize: 19,
    fontWeight: '500',
    letterSpacing: -0.25,
    lineHeight: 34,
    paddingLeft: 62,
  },
  communityLocationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 62,
  },
  communityLocationText: {
    color: '#B2B4BA',
    fontSize: 16,
    fontWeight: '500',
  },
  communityStatusChip: {
    alignItems: 'center',
    backgroundColor: '#112417',
    borderRadius: radii.round,
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  communityStatusText: {
    color: '#66D893',
    fontSize: 15,
    fontWeight: '600',
  },
  communityPostImage: {
    aspectRatio: 1.32,
    borderRadius: 22,
    marginLeft: 62,
    width: 'auto',
  },
  communityReactionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    paddingLeft: 62,
  },
  communityReactionGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  communityReactionValue: {
    color: '#C8C8CB',
    fontSize: 18,
    fontWeight: '500',
  },
  communityReactionSpacer: {
    flex: 1,
  },
  communityLikedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: 62,
  },
  communityLikedAvatars: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  communityLikedGroupMultiple: {
    height: 30,
    resizeMode: 'contain',
    width: 75,
  },
  communityLikedGroupSingle: {
    height: 30,
    resizeMode: 'contain',
    width: 30,
  },
  communityLikedText: {
    color: '#BFBFC4',
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  communityLikedHandle: {
    color: palette.text,
    fontWeight: '700',
  },
  hamburgerIcon: {
    gap: 4,
    width: 18,
  },
  hamburgerLine: {
    backgroundColor: '#F5F5F5',
    borderRadius: radii.round,
    height: 2,
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  storyStrip: {
    backgroundColor: 'transparent',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: spacing.xs,
  },
  storyRail: {
    gap: spacing.md,
    paddingRight: spacing.sm,
  },
  liveFeedStateCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  liveFeedStateText: {
    color: palette.textSoft,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  liveFeedErrorCard: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  liveFeedErrorText: {
    color: palette.textSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  liveFeedRetryText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  storyCard: {
    alignItems: 'center',
    width: 94,
  },
  storyAvatar: {
    marginBottom: 8,
  },
  storyName: {
    color: '#B8B8B8',
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionAction: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  propertyCard: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
  },
  cardPressed: {
    opacity: 0.86,
  },
  cardTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardAuthorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm,
  },
  authorAvatarRing: {
    borderRadius: radii.round,
    borderWidth: 2,
    padding: 2,
  },
  authorAvatar: {
    borderRadius: radii.round,
    height: 42,
    width: 42,
  },
  authorCopy: {
    flex: 1,
  },
  authorNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  authorName: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  authorRoleText: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: radii.round,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionIconSmall: {
    height: 34,
    width: 34,
  },
  tagRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cardTagChip: {
    backgroundColor: 'rgba(59, 225, 120, 0.12)',
    borderRadius: radii.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  cardTagText: {
    color: palette.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  cardTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  cardCaption: {
    color: palette.textSoft,
    fontSize: 13,
    lineHeight: 20,
  },
  cardMetaRow: {
    gap: spacing.sm,
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  metaLabel: {
    color: palette.textSoft,
    flex: 1,
    fontSize: 13,
  },
  metricRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metricPill: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.round,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metricPillText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '600',
  },
  listingImage: {
    borderRadius: radii.lg,
    height: 210,
    width: '100%',
  },
  textOnlyCallout: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  textOnlyCalloutText: {
    color: palette.textSoft,
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  reactionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  reactionStat: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  reactionValue: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  reactionSpacer: {
    flex: 1,
  },
  pageTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  pageSubtitle: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  searchShell: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  searchText: {
    color: palette.textSoft,
    flex: 1,
    fontSize: 14,
  },
  filterRail: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  filterChip: {
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: palette.accent,
  },
  filterChipText: {
    color: palette.textSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: palette.background,
  },
  mapPreview: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    minHeight: 200,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  mapGlow: {
    backgroundColor: palette.accentGlow,
    borderRadius: radii.round,
    height: 180,
    left: 40,
    position: 'absolute',
    top: 10,
    width: 180,
  },
  mapMarker: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: radii.round,
    height: 48,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 48,
  },
  mapTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
  },
  mapCopy: {
    color: palette.textSoft,
    fontSize: 14,
    marginTop: spacing.xs,
    maxWidth: 220,
  },
  emptyStateCard: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  emptyStateTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyStateBody: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  boardGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  boardCard: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flex: 1,
    padding: spacing.md,
  },
  boardIconWrap: {
    alignItems: 'center',
    borderRadius: radii.round,
    height: 42,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 42,
  },
  boardAccentGreen: {
    backgroundColor: 'rgba(59, 225, 120, 0.18)',
  },
  boardAccentOrange: {
    backgroundColor: 'rgba(255, 138, 61, 0.18)',
  },
  boardAccentBlue: {
    backgroundColor: 'rgba(106, 224, 255, 0.18)',
  },
  boardTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  boardCount: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  composeHero: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  composeEyebrow: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  composeTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  composeCopy: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  composeStep: {
    alignItems: 'flex-start',
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  composeIconWrap: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.round,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  composeStepCopy: {
    flex: 1,
    gap: 6,
  },
  composeStepTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  composeStepBody: {
    color: palette.textSoft,
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: radii.round,
    paddingVertical: spacing.md,
  },
  primaryButtonWide: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: radii.round,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    color: palette.background,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: radii.round,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  profileHero: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  profileAvatar: {
    borderRadius: radii.round,
    height: 68,
    width: 68,
  },
  profileIdentity: {
    flex: 1,
  },
  profileName: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  profileHandle: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  profileStats: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statBox: {
    backgroundColor: palette.surfaceRaised,
    borderRadius: radii.lg,
    flex: 1,
    padding: spacing.md,
  },
  statValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  settingsRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  settingsLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  detailRoot: {
    flex: 1,
    backgroundColor: palette.background,
  },
  detailHero: {
    height: 360,
    justifyContent: 'space-between',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.overlay,
  },
  detailTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  detailHeroBody: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  detailTitle: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  detailLocation: {
    color: palette.textSoft,
    fontSize: 14,
  },
  detailBody: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  detailPriceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailPriceLabel: {
    color: palette.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  detailPrice: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  detailViews: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.round,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detailViewsText: {
    color: palette.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  detailSection: {
    gap: spacing.sm,
  },
  detailSectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
  detailBodyCopy: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  detailFeatureList: {
    gap: spacing.sm,
  },
  detailFeatureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailFeatureText: {
    color: palette.textSoft,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  agentCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  agentAvatar: {
    borderRadius: radii.round,
    height: 56,
    width: 56,
  },
  agentCopy: {
    flex: 1,
  },
  agentName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  agentRole: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  agentBadge: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: radii.round,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  tagChip: {
    backgroundColor: 'rgba(247, 248, 250, 0.14)',
    borderRadius: radii.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  tagText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  detailFooter: {
    backgroundColor: palette.backgroundAlt,
    borderTopColor: palette.borderSoft,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});
