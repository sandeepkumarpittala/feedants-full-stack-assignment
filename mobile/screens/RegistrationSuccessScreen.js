import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";

export default function RegistrationSuccessScreen({
  route,
  navigation,
}) {
  const { registration, competition } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Registration
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.successCard}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>✓</Text>
          </View>

          <Text style={styles.successTitle}>
            Registration Successful
          </Text>

          <Text style={styles.successMessage}>
            You are registered successfully.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Registration Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Registration Number
            </Text>

            <Text style={styles.value}>
              {registration.registrationNumber}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Competition
            </Text>

            <Text style={styles.value}>
              {competition.title}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Participant
            </Text>

            <Text style={styles.value}>
              {registration.participantName}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Email
            </Text>

            <Text style={styles.value}>
              {registration.participantEmail}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Registration Status
            </Text>

            <Text style={styles.status}>
              {registration.registrationStatus}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Payment Status
            </Text>

            <Text style={styles.paymentStatus}>
              {registration.paymentStatus}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Competitions")}
          activeOpacity={0.85}
        >
          <Text style={styles.homeButtonText}>
            Back to Competitions
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFA",
  },

  header: {
    height: 100,
    paddingTop: 45,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 30,
    color: "#172B4D",
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#172B4D",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginBottom: 16,
  },

  checkCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E2F7F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  check: {
    fontSize: 40,
    fontWeight: "800",
    color: "#008C95",
  },

  successTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#172B4D",
    textAlign: "center",
  },

  successMessage: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#172B4D",
    marginBottom: 18,
  },

  row: {
    gap: 5,
  },

  label: {
    fontSize: 12,
    color: "#7A8799",
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#172B4D",
    marginTop: 3,
  },

  status: {
    fontSize: 15,
    fontWeight: "700",
    color: "#008C95",
    marginTop: 3,
    textTransform: "capitalize",
  },

  paymentStatus: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F59E0B",
    marginTop: 3,
    textTransform: "capitalize",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EEF0",
    marginVertical: 15,
  },

  homeButton: {
    backgroundColor: "#008C95",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});