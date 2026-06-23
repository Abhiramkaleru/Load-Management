import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setConfig, setLastSyncTime } from "../redux/store";
import { SyncService } from "../api/SyncService";
import { AuthService } from "../api/AuthService";

const STEPS = ["Prepare", "Setup", "Update", "Organize", "Finish"];

export function SyncPrepareScreen({ onSyncComplete }) {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState("Almost there, just a moment...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const sync = async () => {
      try {
        // Step 1: Prepare
        setCurrentStep(0);
        setProgress(15);
        setStatus("Downloading configuration...");
        const config = await SyncService.prepareSQLite();
        dispatch(setConfig(config));

        // Step 2: Setup
        setCurrentStep(1);
        setProgress(40);
        setStatus("Setting up database...");
        await new Promise((r) => setTimeout(r, 400));

        // Step 3: Update
        setCurrentStep(2);
        setProgress(60);
        setStatus("Syncing data...");
        const now = new Date().toISOString();
        await AuthService.saveLastSyncTime(now);
        dispatch(setLastSyncTime(now));
        await new Promise((r) => setTimeout(r, 400));

        // Step 4: Organize
        setCurrentStep(3);
        setProgress(80);
        setStatus("Organizing...");
        await new Promise((r) => setTimeout(r, 400));

        // Step 5: Finish
        setCurrentStep(4);
        setProgress(100);
        setStatus("Ready!");

        setTimeout(() => onSyncComplete?.(), 800);
      } catch (err) {
        setError(err.message || "Sync failed. Check network & try again.");
        setStatus("");
      }
    };

    sync();
  }, [dispatch, onSyncComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>📦</Text>
        <Text style={styles.title}>Setting Up</Text>
      </View>

      <View style={styles.content}>
        {!error ? (
          <>
            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <Text style={styles.progressText}>{progress}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>

            {/* Steps Indicator */}
            <View style={styles.stepsContainer}>
              {STEPS.map((step, idx) => (
                <View key={step} style={styles.stepWrapper}>
                  <View
                    style={[
                      styles.stepDot,
                      idx < currentStep && styles.stepDotDone,
                      idx === currentStep && styles.stepDotActive,
                    ]}
                  >
                    {idx < currentStep ? (
                      <Text style={styles.stepDotText}>✓</Text>
                    ) : idx === currentStep ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : null}
                  </View>
                </View>
              ))}
            </View>

            {/* Status Text */}
            <Text style={styles.status}>{status}</Text>
            <Text style={styles.hint}>
              Pull down to refresh. Sync uploads local changes and downloads
              latest data
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.error}>❌ {error}</Text>
            <Text style={styles.hintError}>
              Offline mode enabled. Check network & restart.
            </Text>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by WINIT</Text>
        {/* <Text style={styles.poweredBy}>WINIT</Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004B87",
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  progressSection: {
    marginBottom: 40,
    alignItems: "center",
  },
  progressText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#004B87",
    marginBottom: 12,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#004B87",
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  stepWrapper: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotDone: {
    backgroundColor: "#004B87",
  },
  stepDotActive: {
    backgroundColor: "#004B87",
    borderWidth: 2,
    borderColor: "#004B87",
  },
  stepDotText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
  error: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  hintError: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  poweredBy: {
    fontSize: 14,
    fontWeight: "700",
    color: "#004B87",
  },
});
