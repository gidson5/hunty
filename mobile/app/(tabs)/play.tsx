import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView, ThemedCustomText, ThemedButton } from '@components/themed';
import { ClueTextAnswerModal } from '@components/modals';

export default function PlayScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (answer: string) => {
    setIsSubmitting(true);
    try {
      // Placeholder until contract submit is wired on mobile
      await new Promise((resolve) => setTimeout(resolve, 400));
      setLastSubmitted(answer);
      setModalVisible(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedCustomText variant="h2">Map/Play</ThemedCustomText>
      <ThemedCustomText variant="body">
        Open the map, solve clues, and play active hunts.
      </ThemedCustomText>

      <ThemedButton
        text="Submit text answer"
        variant="primary"
        size="md"
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Open clue answer modal"
      />

      {lastSubmitted ? (
        <ThemedCustomText variant="caption" color="success">
          Last submitted: {lastSubmitted}
        </ThemedCustomText>
      ) : null}

      <ClueTextAnswerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        clueTitle="Sample clue"
        isSubmitting={isSubmitting}
        placeholder="Enter answer"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    justifyContent: 'center',
  },
});
