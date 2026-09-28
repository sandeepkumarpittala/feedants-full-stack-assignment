import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import {
  registerForCompetition,
  getUserCompetitionRegistration,
  createSubmission,
  getUserSubmission,
} from "../services/api";
export default function CompetitionDetailsScreen({
  route,
  navigation,
}) {
  const { competition } = route.params;

  // Temporary user identifier for testing.
  // Later this will come from real authentication.
  const currentUserEmail =
  "sandeep.test@gmail.com";
  const [showRegistration, setShowRegistration] =
    useState(false);

  const [participantName, setParticipantName] =
    useState("");

  const [participantEmail, setParticipantEmail] =
    useState("");

  const [registering, setRegistering] =
    useState(false);

  const [registered, setRegistered] =
    useState(false);

  const [registrationDetails, setRegistrationDetails] =
    useState(null);

  const [checkingRegistration, setCheckingRegistration] =
    useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const [submission, setSubmission] =
  useState(null);

const [checkingSubmission, setCheckingSubmission] =
  useState(false);

const [showSubmissionForm, setShowSubmissionForm] =
  useState(false);

const [submissionTitle, setSubmissionTitle] =
  useState("");

const [submissionUrl, setSubmissionUrl] =
  useState("");

const [submissionDescription, setSubmissionDescription] =
  useState("");

const [submitting, setSubmitting] =
  useState(false);

  // ----------------------------------------
  // CALCULATE REMAINING SPOTS
  // ----------------------------------------

  const spotsLeft =
    (competition.totalSpots || 0) -
    (competition.bookedSpots || 0);
  const now = new Date();

const submissionStartsAt = competition.submissionStartsAt
  ? new Date(competition.submissionStartsAt)
  : null;

const submissionEndsAt = competition.submissionEndsAt
  ? new Date(competition.submissionEndsAt)
  : null;

const submissionNotStarted =
  submissionStartsAt &&
  now < submissionStartsAt;

const submissionEnded =
  submissionEndsAt &&
  now > submissionEndsAt;

const submissionOpen =
  !submissionNotStarted &&
  !submissionEnded;

  // ----------------------------------------
  // REGISTRATION COUNTDOWN
  // ----------------------------------------

  useEffect(() => {
    if (!competition.registrationClosesAt) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference =
        new Date(
          competition.registrationClosesAt
        ).getTime() -
        new Date().getTime();

      // Registration deadline passed
      if (difference <= 0) {
        setTimeLeft({
          expired: true,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      );

      const minutes = Math.floor(
        (difference /
          (1000 * 60)) %
          60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft({
        expired: false,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(
      calculateTimeLeft,
      1000
    );

    // Cleanup
    return () => clearInterval(timer);
  }, [competition.registrationClosesAt]);

  // ----------------------------------------
  // CHECK USER REGISTRATION
  // ----------------------------------------

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        setCheckingRegistration(true);

        const data =
          await getUserCompetitionRegistration({
            competitionId: competition._id,
            userId: currentUserEmail,
          });

        if (
          data.success &&
          data.registered
        ) {
          setRegistered(true);

          setRegistrationDetails(
            data.registration
          );
        } else {
          setRegistered(false);

          setRegistrationDetails(null);
        }
      } catch (error) {
        console.error(
          "Registration status check failed:",
          error
        );
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [competition._id]);
  useEffect(() => {
  const checkSubmission = async () => {
    try {
      setCheckingSubmission(true);

      const data =
        await getUserSubmission({
          competitionId: competition._id,
          userId: currentUserEmail,
        });

      if (
        data.success &&
        data.submitted
      ) {
        setSubmission(
          data.submission
        );
      } else {
        setSubmission(null);
      }
    } catch (error) {
      console.error(
        "Submission status check failed:",
        error
      );
    } finally {
      setCheckingSubmission(false);
    }
  };

  checkSubmission();
}, [competition._id]);

  // ----------------------------------------
  // REGISTRATION
  // ----------------------------------------

  const handleRegistration = async () => {
    if (!participantName.trim()) {
      Alert.alert(
        "Required",
        "Please enter your name."
      );

      return;
    }

    if (!participantEmail.trim()) {
      Alert.alert(
        "Required",
        "Please enter your email."
      );

      return;
    }

    setRegistering(true);

    try {
      const data =
        await registerForCompetition({
          competitionId:
            competition._id,

          participantName:
            participantName.trim(),

          participantEmail:
            participantEmail.trim(),
        });

      if (data.success) {
        setShowRegistration(false);

        // Clear form
        setParticipantName("");
        setParticipantEmail("");

        // Navigate to success page
        navigation.navigate(
          "RegistrationSuccess",
          {
            registration:
              data.registration,

            competition:
              competition,
          }
        );
      } else {
        Alert.alert(
          "Registration Failed",
          data.message ||
            "Unable to register."
        );
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      Alert.alert(
        "Registration Failed",
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setRegistering(false);
    }
  };
  const handleSubmission = async () => {
  if (!submissionTitle.trim()) {
    Alert.alert(
      "Required",
      "Please enter a submission title."
    );
    return;
  }

  if (!submissionUrl.trim()) {
    Alert.alert(
      "Required",
      "Please enter your submission URL."
    );
    return;
  }

  setSubmitting(true);

  try {
    const data =
      await createSubmission({
        competitionId:
          competition._id,

        userId:
          currentUserEmail,

        submissionTitle:
          submissionTitle.trim(),

        submissionUrl:
          submissionUrl.trim(),

        description:
          submissionDescription.trim(),
      });

    if (data.success) {
      setSubmission(
        data.submission
      );

      setShowSubmissionForm(false);

      setSubmissionTitle("");
      setSubmissionUrl("");
      setSubmissionDescription("");

      Alert.alert(
        "Submission Successful",
        "Your competition entry has been submitted successfully."
      );
    } else {
      Alert.alert(
        "Submission Failed",
        data.message ||
          "Unable to submit your entry."
      );
    }
  } catch (error) {
    console.error(
      "Submission error:",
      error
    );

    Alert.alert(
      "Submission Failed",
      error.message ||
        "Unable to connect to the server."
    );
  } finally {
    setSubmitting(false);
  }
};

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Competition
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* -------------------------------- */}
        {/* COMPETITION HEADER */}
        {/* -------------------------------- */}

        <View style={styles.titleSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {competition.status}
            </Text>
          </View>

          <Text style={styles.title}>
            {competition.title}
          </Text>

          <Text style={styles.category}>
            {competition.category}
          </Text>

          <Text style={styles.description}>
            {competition.description}
          </Text>
        </View>

        {/* -------------------------------- */}
        {/* STATS */}
        {/* -------------------------------- */}

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>
              Prize Pool
            </Text>

            <Text style={styles.statValue}>
              ₹{competition.prizePool}
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>
              Entry Fee
            </Text>

            <Text style={styles.statValue}>
              ₹{competition.entryFee}
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>
              Spots Left
            </Text>

            <Text style={styles.statValue}>
              {spotsLeft}
            </Text>
          </View>
        </View>

        {/* -------------------------------- */}
        {/* REGISTRATION COUNTDOWN */}
        {/* -------------------------------- */}

        {timeLeft && (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownIcon}>
              ⌛
            </Text>

            <View
              style={
                styles.countdownContent
              }
            >
              <Text
                style={
                  styles.countdownTitle
                }
              >
                Registration closes in
              </Text>

              {timeLeft.expired ? (
                <Text
                  style={
                    styles.expiredText
                  }
                >
                  Registration Closed
                </Text>
              ) : (
                <Text
                  style={
                    styles.countdownValue
                  }
                >
                  {String(
                    timeLeft.days
                  ).padStart(2, "0")}
                  d :{" "}
                  {String(
                    timeLeft.hours
                  ).padStart(2, "0")}
                  h :{" "}
                  {String(
                    timeLeft.minutes
                  ).padStart(2, "0")}
                  m :{" "}
                  {String(
                    timeLeft.seconds
                  ).padStart(2, "0")}
                  s
                </Text>
              )}
            </View>
          </View>
        )}

        {/* -------------------------------- */}
        {/* JUDGE */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Judge
          </Text>

          <Text style={styles.judgeName}>
            {competition.judge?.name ||
              "Not available"}
          </Text>

          <Text style={styles.info}>
            {competition.judge?.profession ||
              ""}
          </Text>

          <Text style={styles.info}>
            {competition.judge?.experience ||
              ""}
          </Text>
        </View>

        {/* -------------------------------- */}
        {/* REWARDS */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Rewards
          </Text>

          {competition.rewards?.map(
            (reward) => (
              <View
                key={reward._id}
                style={styles.rewardRow}
              >
                <Text
                  style={
                    styles.rewardTitle
                  }
                >
                  {reward.title}
                </Text>

                <Text
                  style={
                    styles.rewardAmount
                  }
                >
                  ₹{reward.amount}
                </Text>
              </View>
            )
          )}
        </View>

        {/* -------------------------------- */}
        {/* JUDGING PARAMETERS */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Judging Parameters
          </Text>

          {competition.judgingParameters?.map(
            (parameter, index) => (
              <View
                key={index}
                style={styles.bulletRow}
              >
                <Text
                  style={styles.bullet}
                >
                  •
                </Text>

                <Text
                  style={
                    styles.bulletText
                  }
                >
                  {parameter}
                </Text>
              </View>
            )
          )}
        </View>

        {/* -------------------------------- */}
        {/* RULES */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Rules
          </Text>

          {competition.rules?.map(
            (rule, index) => (
              <View
                key={index}
                style={styles.bulletRow}
              >
                <Text
                  style={styles.bullet}
                >
                  •
                </Text>

                <Text
                  style={
                    styles.bulletText
                  }
                >
                  {rule}
                </Text>
              </View>
            )
          )}
        </View>

        {/* -------------------------------- */}
        {/* ELIGIBILITY */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Eligibility
          </Text>

          {competition.eligibility?.map(
            (item, index) => (
              <View
                key={index}
                style={styles.bulletRow}
              >
                <Text
                  style={styles.bullet}
                >
                  •
                </Text>

                <Text
                  style={
                    styles.bulletText
                  }
                >
                  {item}
                </Text>
              </View>
            )
          )}
        </View>

        {/* -------------------------------- */}
        {/* PREVIOUS WINNERS */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Previous Winners
          </Text>

          {competition.previousWinners?.map(
            (winner) => (
              <View
                key={winner._id}
                style={styles.winnerRow}
              >
                <Text
                  style={
                    styles.winnerName
                  }
                >
                  {winner.name}
                </Text>

                <Text
                  style={styles.position}
                >
                  Position {winner.position}
                </Text>
              </View>
            )
          )}
        </View>

        {/* -------------------------------- */}
        {/* IMPORTANT DATES */}
        {/* -------------------------------- */}

        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Important Dates
          </Text>

          <Text style={styles.dateText}>
            Registration closes:{" "}
            {formatDate(
              competition.registrationClosesAt
            )}
          </Text>

          <Text style={styles.dateText}>
            Submission starts:{" "}
            {formatDate(
              competition.submissionStartsAt
            )}
          </Text>

          <Text style={styles.dateText}>
            Submission ends:{" "}
            {formatDate(
              competition.submissionEndsAt
            )}
          </Text>

          <Text style={styles.dateText}>
            Result date:{" "}
            {formatDate(
              competition.resultDate
            )}
          </Text>
        </View>

        {/* -------------------------------- */}
        {/* REGISTER BUTTON */}
        {/* -------------------------------- */}

        <TouchableOpacity
          style={[
            styles.registerButton,
            (
              registered ||
              checkingRegistration ||
              spotsLeft <= 0 ||
              timeLeft?.expired
            ) &&
              styles.disabledButton,
          ]}
          activeOpacity={0.85}
          disabled={
            registered ||
            checkingRegistration ||
            spotsLeft <= 0 ||
            timeLeft?.expired
          }
          onPress={() =>
            setShowRegistration(true)
          }
        >
          <Text
            style={
              styles.registerButtonText
            }
          >
            {checkingRegistration
              ? "Checking..."
              : registered
              ? "✓ Already Registered"
              : timeLeft?.expired
              ? "Registration Closed"
              : spotsLeft <= 0
              ? "Competition Full"
              : "Register Now"}
          </Text>
        </TouchableOpacity>

        {/* -------------------------------- */}
        {/* REGISTERED USER DETAILS */}
        {/* -------------------------------- */}

        {registered &&
          registrationDetails && (
            <View
              style={
                styles.registeredCard
              }
            >
              <Text
                style={
                  styles.registeredTitle
                }
              >
                ✓ You are already registered
              </Text>

              <Text
                style={
                  styles.registeredText
                }
              >
                Registration Number:{" "}
                {
                  registrationDetails.registrationNumber
                }
              </Text>

              <Text
                style={
                  styles.registeredText
                }
              >
                Participant:{" "}
                {
                  registrationDetails.participantName
                }
              </Text>

              <Text
                style={
                  styles.registeredText
                }
              >
                Email:{" "}
                {
                  registrationDetails.participantEmail
                }
              </Text>
            </View>
          )}
          {/* Submission Section */}
{registered && (
  <View style={styles.submissionCard}>
    <Text style={styles.sectionTitle}>
      Submission
    </Text>

    {checkingSubmission ? (
      <Text style={styles.submissionInfo}>
        Checking submission status...
      </Text>
    ) : submission ? (
      <>
        <View style={styles.submittedBadge}>
          <Text style={styles.submittedBadgeText}>
            ✓ Submission Submitted
          </Text>
        </View>

        <Text style={styles.submissionLabel}>
          Title
        </Text>

        <Text style={styles.submissionValue}>
          {submission.submissionTitle}
        </Text>

        <Text style={styles.submissionLabel}>
          Status
        </Text>

        <Text style={styles.submissionValue}>
          {submission.status}
        </Text>

        <Text style={styles.submissionLabel}>
          Submitted At
        </Text>

        <Text style={styles.submissionValue}>
          {formatDateTime(
            submission.submittedAt
          )}
        </Text>

        <Text style={styles.submissionLabel}>
          Video URL
        </Text>

        <Text style={styles.submissionUrl}>
          {submission.submissionUrl}
        </Text>
      </>
    ) : submissionNotStarted ? (
      <>
        <View style={styles.submissionInfoBox}>
          <Text style={styles.submissionInfoTitle}>
            Submission is not open yet
          </Text>

          <Text style={styles.submissionInfo}>
            You can submit your entry from{" "}
            {formatDate(
              competition.submissionStartsAt
            )}
            .
          </Text>
        </View>
      </>
    ) : submissionEnded ? (
      <View style={styles.submissionInfoBox}>
        <Text style={styles.submissionInfoTitle}>
          Submission period has ended
        </Text>

        <Text style={styles.submissionInfo}>
          The submission deadline was{" "}
          {formatDate(
            competition.submissionEndsAt
          )}
          .
        </Text>
      </View>
    ) : (
      <>
        <Text style={styles.submissionInfo}>
          Submission period is currently open.
        </Text>

        <TouchableOpacity
          style={styles.submitEntryButton}
          activeOpacity={0.85}
          onPress={() =>
            setShowSubmissionForm(true)
          }
        >
          <Text style={styles.submitEntryButtonText}>
            Submit Entry
          </Text>
        </TouchableOpacity>
      </>
    )}
  </View>
)}
      </ScrollView>

      {/* -------------------------------- */}
      {/* REGISTRATION MODAL */}
      {/* -------------------------------- */}

      <Modal
        visible={showRegistration}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!registering) {
            setShowRegistration(false);
          }
        }}
      >
        <View
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text
              style={styles.modalTitle}
            >
              Register for Competition
            </Text>

            <Text
              style={
                styles.modalCompetitionTitle
              }
            >
              {competition.title}
            </Text>

            {/* PARTICIPANT NAME */}

            <Text
              style={styles.inputLabel}
            >
              Participant Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              value={participantName}
              onChangeText={
                setParticipantName
              }
              editable={!registering}
            />

            {/* EMAIL */}

            <Text
              style={styles.inputLabel}
            >
              Email Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              value={participantEmail}
              onChangeText={
                setParticipantEmail
              }
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!registering}
            />

            {/* BUTTONS */}

            <View
              style={styles.modalButtons}
            >
              <TouchableOpacity
                style={styles.cancelButton}
                disabled={registering}
                onPress={() =>
                  setShowRegistration(false)
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.confirmButton
                }
                disabled={registering}
                onPress={
                  handleRegistration
                }
              >
                <Text
                  style={
                    styles.confirmButtonText
                  }
                >
                  {registering
                    ? "Registering..."
                    : "Confirm Registration"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
  visible={showSubmissionForm}
  transparent
  animationType="slide"
  onRequestClose={() => {
    if (!submitting) {
      setShowSubmissionForm(false);
    }
  }}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>
        Submit Your Entry
      </Text>

      <Text style={styles.modalCompetitionTitle}>
        {competition.title}
      </Text>

      <Text style={styles.inputLabel}>
        Submission Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your entry title"
        placeholderTextColor="#94A3B8"
        value={submissionTitle}
        onChangeText={
          setSubmissionTitle
        }
        editable={!submitting}
        maxLength={100}
      />

      <Text style={styles.inputLabel}>
        Video URL
      </Text>

      <TextInput
        style={styles.input}
        placeholder="https://example.com/video"
        placeholderTextColor="#94A3B8"
        value={submissionUrl}
        onChangeText={
          setSubmissionUrl
        }
        editable={!submitting}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      <Text style={styles.inputLabel}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
        ]}
        placeholder="Describe your entry"
        placeholderTextColor="#94A3B8"
        value={submissionDescription}
        onChangeText={
          setSubmissionDescription
        }
        editable={!submitting}
        multiline
        textAlignVertical="top"
        maxLength={1000}
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          disabled={submitting}
          onPress={() =>
            setShowSubmissionForm(false)
          }
        >
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          disabled={submitting}
          onPress={handleSubmission}
        >
          <Text style={styles.confirmButtonText}>
            {submitting
              ? "Submitting..."
              : "Submit Entry"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
}

// ----------------------------------------
// DATE FORMATTER
// ----------------------------------------

function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  return new Date(
    date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(date) {
  if (!date) {
    return "Not available";
  }

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

// ----------------------------------------
// STYLES
// ----------------------------------------

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

  titleSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E2F7F1",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeText: {
    color: "#008C95",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#172B4D",
    marginTop: 14,
  },

  category: {
    color: "#008C95",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 7,
  },

  description: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16,
  },

  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  stat: {
    flex: 1,
  },

  statLabel: {
    color: "#7A8799",
    fontSize: 12,
    marginBottom: 5,
  },

  statValue: {
    color: "#008C95",
    fontSize: 19,
    fontWeight: "800",
  },

  // ----------------------------------------
  // COUNTDOWN
  // ----------------------------------------

  countdownCard: {
    backgroundColor: "#EAF8F7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  countdownIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  countdownContent: {
    flex: 1,
  },

  countdownTitle: {
    color: "#172B4D",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },

  countdownValue: {
    color: "#008C95",
    fontSize: 18,
    fontWeight: "800",
  },

  expiredText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "800",
  },

  // ----------------------------------------
  // SECTIONS
  // ----------------------------------------

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172B4D",
    marginBottom: 14,
  },

  judgeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172B4D",
  },

  info: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 5,
  },

  // ----------------------------------------
  // REWARDS
  // ----------------------------------------

  rewardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF0",
  },

  rewardTitle: {
    color: "#172B4D",
    fontSize: 14,
    fontWeight: "600",
  },

  rewardAmount: {
    color: "#008C95",
    fontSize: 14,
    fontWeight: "800",
  },

  // ----------------------------------------
  // JUDGING / RULES / ELIGIBILITY
  // ----------------------------------------

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  bullet: {
    fontSize: 18,
    color: "#008C95",
    marginRight: 10,
    lineHeight: 22,
  },

  bulletText: {
    flex: 1,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 22,
  },

  // ----------------------------------------
  // WINNERS
  // ----------------------------------------

  winnerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  winnerName: {
    color: "#172B4D",
    fontSize: 14,
    fontWeight: "600",
  },

  position: {
    color: "#64748B",
    fontSize: 13,
  },

  // ----------------------------------------
  // DATES
  // ----------------------------------------

  dateText: {
    color: "#64748B",
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },

  // ----------------------------------------
  // REGISTER BUTTON
  // ----------------------------------------

  registerButton: {
    backgroundColor: "#008C95",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  disabledButton: {
    backgroundColor: "#94A3B8",
  },

  // ----------------------------------------
  // REGISTERED USER
  // ----------------------------------------

  registeredCard: {
    backgroundColor: "#EAF8F7",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },

  registeredTitle: {
    color: "#008C95",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },

  registeredText: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },

  // ----------------------------------------
  // MODAL
  // ----------------------------------------

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 35,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#172B4D",
  },

  modalCompetitionTitle: {
    fontSize: 14,
    color: "#008C95",
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#172B4D",
    marginBottom: 7,
    marginTop: 10,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D8E2E5",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#172B4D",
    backgroundColor: "#F8FAFA",
  },

  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8E2E5",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: "700",
  },

  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#008C95",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
submissionCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 18,
  marginTop: 16,
},

submissionInfoBox: {
  backgroundColor: "#F1F7F7",
  borderRadius: 12,
  padding: 14,
},

submissionInfoTitle: {
  color: "#172B4D",
  fontSize: 15,
  fontWeight: "800",
  marginBottom: 6,
},

submissionInfo: {
  color: "#64748B",
  fontSize: 14,
  lineHeight: 21,
},

submittedBadge: {
  alignSelf: "flex-start",
  backgroundColor: "#E2F7F1",
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 7,
  marginBottom: 16,
},

submittedBadgeText: {
  color: "#008C95",
  fontSize: 13,
  fontWeight: "800",
},

submissionLabel: {
  color: "#7A8799",
  fontSize: 12,
  marginTop: 12,
  marginBottom: 4,
},

submissionValue: {
  color: "#172B4D",
  fontSize: 15,
  fontWeight: "700",
},

submissionUrl: {
  color: "#008C95",
  fontSize: 14,
  lineHeight: 20,
},

submitEntryButton: {
  backgroundColor: "#008C95",
  borderRadius: 14,
  paddingVertical: 15,
  alignItems: "center",
  marginTop: 14,
},

submitEntryButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "800",
},

descriptionInput: {
  height: 100,
  paddingTop: 14,
},
submissionCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 18,
  marginTop: 16,
},

submissionInfoBox: {
  backgroundColor: "#F1F7F7",
  borderRadius: 12,
  padding: 14,
},

submissionInfoTitle: {
  color: "#172B4D",
  fontSize: 15,
  fontWeight: "800",
  marginBottom: 6,
},

submissionInfo: {
  color: "#64748B",
  fontSize: 14,
  lineHeight: 21,
},

submittedBadge: {
  alignSelf: "flex-start",
  backgroundColor: "#E2F7F1",
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 7,
  marginBottom: 16,
},

submittedBadgeText: {
  color: "#008C95",
  fontSize: 13,
  fontWeight: "800",
},

submissionLabel: {
  color: "#7A8799",
  fontSize: 12,
  marginTop: 12,
  marginBottom: 4,
},

submissionValue: {
  color: "#172B4D",
  fontSize: 15,
  fontWeight: "700",
},

submissionUrl: {
  color: "#008C95",
  fontSize: 14,
  lineHeight: 20,
},

submitEntryButton: {
  backgroundColor: "#008C95",
  borderRadius: 14,
  paddingVertical: 15,
  alignItems: "center",
  marginTop: 14,
},

submitEntryButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "800",
},

descriptionInput: {
  height: 100,
  paddingTop: 14,
},
});