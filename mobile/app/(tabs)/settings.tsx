import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { SettingsSection } from "@components/settings/SettingsSection";
import { SettingsRow } from "@components/settings/SettingsRow";
import { DisconnectWalletModal } from "@components/settings/DisconnectWalletModal";
import { useNotifications } from "../../hooks/useNotifications";
import { useTheme } from "@providers/ThemeProvider";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { enabled: notificationsEnabled, toggle: toggleNotifications } =
    useNotifications();

  const [showDisconnect, setShowDisconnect] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      setShowDisconnect(false);
      router.replace("/");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, { color: colors.text }]}>Settings</Text>

        <SettingsSection title="Appearance">
          <SettingsRow
            icon="color-palette-outline"
            label="Theme"
            description="Light, Dark, or System default"
            type="navigate"
            onPress={() => router.push("/settings/theme")}
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsRow
            icon="notifications-outline"
            label="Push Notifications"
            description="Job alerts, messages, and updates"
            type="toggle"
            value={notificationsEnabled}
            onToggle={toggleNotifications}
          />
        </SettingsSection>

        <SettingsSection title="Wallet">
          <SettingsRow
            icon="wallet-outline"
            label="Connected Wallet"
            description="View your linked address"
            type="navigate"
            onPress={() => router.push("/settings/wallet")}
          />
          <SettingsRow
            icon="log-out-outline"
            label="Disconnect Wallet"
            description="Sign out and unlink this device"
            type="destructive"
            onPress={() => setShowDisconnect(true)}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsRow
            icon="document-text-outline"
            label="Documentation"
            type="link"
            onPress={() => Linking.openURL("https://docs.hunty.com")}
          />
          <SettingsRow
            icon="help-circle-outline"
            label="Help Center"
            type="link"
            onPress={() => Linking.openURL("https://support.hunty.com")}
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            type="link"
            onPress={() => Linking.openURL("https://hunty.com/privacy")}
          />
          <SettingsRow
            icon="newspaper-outline"
            label="Terms of Service"
            type="link"
            onPress={() => Linking.openURL("https://hunty.com/terms")}
          />
        </SettingsSection>

        <Text style={[styles.version, { color: colors.border }]}>Hunty v1.0.0 · development build</Text>
      </ScrollView>

      <DisconnectWalletModal
        visible={showDisconnect}
        onCancel={() => setShowDisconnect(false)}
        onConfirm={handleDisconnect}
        isLoading={disconnecting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 28,
    marginTop: 8,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
  },
});
