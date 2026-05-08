import { useState, useEffect, useCallback } from 'react';
import { askMissionAI } from '../services/aiService';

export const useChatbot = (dashboardData) => {
  // Step 1 - Fix Initial State
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mission-chat");
    return saved ? JSON.parse(saved) : [
      {
        role: "assistant",
        content: "Mission Control AI online.",
      },
    ];
  });
  const [loading, setLoading] = useState(false);

  // Step 7 - Debug Console
  useEffect(() => {
    console.log("Chat Messages Stream:", messages);
    localStorage.setItem(
      "mission-chat",
      JSON.stringify(messages.slice(-30))
    );
  }, [messages]);

  const handleSend = useCallback(async (input) => {
    if (!input.trim()) return;

    // Step 2 - Fix Message Pushing (User)
    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Step 5 - Fix Loading State with finally
    try {
      const reply = await askMissionAI(input, {
        speed: dashboardData.iss.speed,
        location: dashboardData.iss.locationName,
        astronautCount: dashboardData.iss.peopleCount,
        newsCount: dashboardData.news.length,
        coordinates: {
          lat: dashboardData.iss.lat,
          lng: dashboardData.iss.lng
        }
      });

      // Step 2 - Fix Message Pushing (Assistant)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "No response generated.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Mission AI unavailable.",
        },
      ]);
    } finally {
      // Step 5 - setLoading(false) MUST run after response
      setLoading(false);
    }
  }, [dashboardData]);

  const clearChat = () => {
    const initial = [{ role: "assistant", content: "Mission Control AI online." }];
    setMessages(initial);
    localStorage.removeItem("mission-chat");
  };

  return { messages, loading, sendMessage: handleSend, clearChat };
};
