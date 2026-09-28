import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { getCompetitions } from "../services/api";

export default function CompetitionListScreen({ navigation }) {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchCompetitions = async () => {
    try {
      setError("");

      const data = await getCompetitions();

      if (data.success) {
        setCompetitions(data.competitions);
      } else {
        setError("Unable to load competitions.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCompetitions();
  };

  const renderCompetition = ({ item }) => {
    const spotsLeft =
      (item.totalSpots || 0) - (item.bookedSpots || 0);

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("CompetitionDetails", {
            competition: item,
          })
        }
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={styles.category}>
            {item.category}
          </Text>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>
                Prize Pool
              </Text>

              <Text style={styles.amount}>
                ₹{item.prizePool}
              </Text>
            </View>

            <View>
              <Text style={styles.label}>
                Entry Fee
              </Text>

              <Text style={styles.amount}>
                ₹{item.entryFee}
              </Text>
            </View>

            <View>
              <Text style={styles.label}>
                Spots Left
              </Text>

              <Text style={styles.amount}>
                {spotsLeft}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.judgeTitle}>
            Judge
          </Text>

          <Text style={styles.judgeName}>
            {item.judge?.name || "Not available"}
          </Text>

          <Text style={styles.judgeInfo}>
            {item.judge?.profession || ""}
          </Text>

          <Text style={styles.judgeInfo}>
            {item.judge?.experience || ""}
          </Text>

          <Text style={styles.description}>
            {item.description}
          </Text>

          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>
              View Competition
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#008C95"
        />

        <Text style={styles.loadingText}>
          Loading competitions...
        </Text>

        <StatusBar style="dark" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity onPress={fetchCompetitions}>
          <Text style={styles.retry}>
            Tap here to retry
          </Text>
        </TouchableOpacity>

        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topSection}>
        <Text style={styles.appName}>
          Feedants
        </Text>

        <Text style={styles.heading}>
          Competitions
        </Text>

        <Text style={styles.subHeading}>
          Discover competitions and showcase your talent
        </Text>
      </View>

      <FlatList
        data={competitions}
        keyExtractor={(item) => item._id}
        renderItem={renderCompetition}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No competitions available
            </Text>

            <Text style={styles.emptyText}>
              Check back later for new competitions.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFA",
  },

  topSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#008C95",
    marginBottom: 8,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172B4D",
  },

  subHeading: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },

  list: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#172B4D",
    marginRight: 10,
  },

  statusBadge: {
    backgroundColor: "#E2F7F1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    color: "#008C95",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  category: {
    marginTop: 8,
    color: "#008C95",
    fontSize: 14,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },

  label: {
    color: "#7A8799",
    fontSize: 12,
    marginBottom: 5,
  },

  amount: {
    color: "#008C95",
    fontSize: 18,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EEF0",
    marginVertical: 18,
  },

  judgeTitle: {
    fontSize: 12,
    color: "#7A8799",
    marginBottom: 4,
  },

  judgeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172B4D",
  },

  judgeInfo: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
    marginTop: 16,
  },

  viewButton: {
    marginTop: 18,
    backgroundColor: "#008C95",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },

  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F7FAFA",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748B",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#172B4D",
  },

  errorText: {
    marginTop: 8,
    textAlign: "center",
    color: "#64748B",
  },

  retry: {
    marginTop: 20,
    color: "#008C95",
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#172B4D",
  },

  emptyText: {
    marginTop: 8,
    color: "#64748B",
  },
});