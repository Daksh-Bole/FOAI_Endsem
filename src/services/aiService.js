import axios from "axios";

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

const MODEL_URL =
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export const askMissionAI = async (prompt, dashboardData) => {
  try {
    const context = `
You are Mission Control AI.

STRICT RULES:
- ONLY answer using provided dashboard data.
- NEVER use external knowledge.
- NEVER hallucinate.
- If data is unavailable, say:
  "No dashboard data available."

DASHBOARD DATA:
${JSON.stringify(dashboardData, null, 2)}

USER QUESTION:
${prompt}
`;

    const response = await axios.post(
      MODEL_URL,
      {
        inputs: context,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.3,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Step 3 - Safe Parsing
    let aiText = "No response generated.";

    if (
      Array.isArray(response.data) &&
      response.data[0]?.generated_text
    ) {
      aiText = response.data[0].generated_text;
    } else if (response.data?.generated_text) {
      aiText = response.data.generated_text;
    }

    return aiText;
  } catch (error) {
    console.error("AI REQUEST FAILED:", error);
    return localDashboardFallback(prompt, dashboardData);
  }
};

function localDashboardFallback(prompt, data) {
  const lower = prompt.toLowerCase();

  if (lower.includes("speed")) {
    return `Current ISS speed is approximately ${Math.round(
      data.speed || 0
    )} km/h.`;
  }

  if (lower.includes("location") || lower.includes("where")) {
    return `ISS is currently near ${
      data.location || "unknown location"
    } at coordinates ${data.coordinates?.lat.toFixed(2)}, ${data.coordinates?.lng.toFixed(2)}.`;
  }

  if (lower.includes("astronaut") || lower.includes("people")) {
    return `There are currently ${
      data.astronautCount || 0
    } astronauts in space.`;
  }

  if (lower.includes("news")) {
    return `There are currently ${
      data.newsCount || 0
    } news articles loaded in the dashboard.`;
  }

  return "No dashboard data available.";
}
