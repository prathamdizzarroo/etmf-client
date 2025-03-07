import axios from '../config/axios';

export const generateContent = async (prompt, context, output) => {
  try {
    const response = await axios.post("http://localhost:7000/api/ai/get-result", {
      context,
      prompt,
      output
    });

    if (!response.data || typeof response.data.result !== "string") {
      throw new Error("Invalid response format");
    }

    console.log("Raw AI Response:", response.data.result);

    return response.data.result;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return `Error: ${error.response?.data?.message || error.message || "Unknown error"}`;
  }
};
