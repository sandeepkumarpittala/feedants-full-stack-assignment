const API_BASE_URL = "http://192.168.1.11:5000/api";

export const getCompetitions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch competitions:", error);
    throw error;
  }
};

export const registerForCompetition = async ({
  competitionId,
  participantName,
  participantEmail,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/registrations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitionId,
          participantName,
          participantEmail,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Registration failed"
      );
    }

    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
export const getUserCompetitionRegistration = async ({
  competitionId,
  userId,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/registrations/competition/${competitionId}/user/${encodeURIComponent(
        userId
      )}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to check registration"
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to check registration:",
      error
    );

    throw error;
  }
};
export const createSubmission = async ({
  competitionId,
  userId,
  submissionTitle,
  submissionUrl,
  description,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitionId,
          userId,
          submissionTitle,
          submissionUrl,
          description,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Submission failed"
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Submission failed:",
      error
    );

    throw error;
  }
};

export const getUserSubmission = async ({
  competitionId,
  userId,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/submissions/competition/${competitionId}/user/${encodeURIComponent(
        userId
      )}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to check submission"
      );
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to check submission:",
      error
    );

    throw error;
  }
};