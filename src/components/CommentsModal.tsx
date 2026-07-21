import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { type FeedComment, type FeedPost } from '../types/community';
import { formatRelativeTime } from '../services/communityApi';
import { Text } from './AppText';
import { palette, radii, spacing } from '../theme';

type CommentsModalProps = {
  comments: FeedComment[];
  commentsError: string | null;
  commentsLoading: boolean;
  draftValue: string;
  isSubmittingComment: boolean;
  onChangeDraftValue: (value: string) => void;
  onClose: () => void;
  onRetry: () => void;
  onSubmitComment: () => void;
  post: FeedPost | null;
  visible: boolean;
};

export function CommentsModal({
  comments,
  commentsError,
  commentsLoading,
  draftValue,
  isSubmittingComment,
  onChangeDraftValue,
  onClose,
  onRetry,
  onSubmitComment,
  post,
  visible,
}: CommentsModalProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable onPress={onClose} style={styles.backdrop} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Comments</Text>
              {post ? (
                <Text numberOfLines={2} style={styles.subtitle}>
                  {post.author}: {post.message}
                </Text>
              ) : null}
            </View>

            <Pressable onPress={onClose} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            {commentsLoading ? (
              <View style={styles.centerState}>
                <ActivityIndicator color={palette.accent} />
                <Text style={styles.stateText}>Loading comments...</Text>
              </View>
            ) : commentsError ? (
              <View style={styles.centerState}>
                <Text style={styles.errorText}>{commentsError}</Text>
                <Pressable onPress={onRetry} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.centerState}>
                <Text style={styles.stateText}>No comments yet. Start the conversation.</Text>
              </View>
            ) : (
              <ScrollView
                contentContainerStyle={styles.commentList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {comments.map((comment) => (
                  <View key={comment.id} style={styles.commentCard}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author.displayName}</Text>
                      <Text style={styles.commentMeta}>@{comment.author.username}</Text>
                      <Text style={styles.commentMeta}>{formatRelativeTime(comment.createdAt)}</Text>
                    </View>
                    <Text style={styles.commentBody}>{comment.content}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.composer}>
            <TextInput
              multiline
              onChangeText={onChangeDraftValue}
              placeholder="Write a comment"
              placeholderTextColor={palette.textMuted}
              style={styles.input}
              value={draftValue}
            />
            <Pressable
              disabled={draftValue.trim().length === 0 || isSubmittingComment}
              onPress={onSubmitComment}
              style={({ pressed }) => [
                styles.submitButton,
                (draftValue.trim().length === 0 || isSubmittingComment) && styles.submitButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isSubmittingComment ? 'Posting...' : 'Post'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: palette.backgroundAlt,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    gap: spacing.md,
    maxHeight: '82%',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.textSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: radii.round,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  closeButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  body: {
    minHeight: 200,
  },
  centerState: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 200,
    paddingHorizontal: spacing.lg,
  },
  stateText: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: radii.round,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.lg,
  },
  retryButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  commentList: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  commentCard: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  commentHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  commentAuthor: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  commentMeta: {
    color: palette.textMuted,
    fontSize: 12,
  },
  commentBody: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  composer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    backgroundColor: palette.surface,
    borderColor: palette.borderSoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    color: palette.text,
    flex: 1,
    fontFamily: 'OpenRunde-Regular',
    fontSize: 14,
    maxHeight: 120,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    textAlignVertical: 'top',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: radii.round,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 72,
    paddingHorizontal: spacing.md,
  },
  submitButtonDisabled: {
    opacity: 0.48,
  },
  submitButtonText: {
    color: palette.background,
    fontSize: 13,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.88,
  },
});
