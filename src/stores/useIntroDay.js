import { defineStore } from "pinia";
import { Groq } from "groq-sdk";

export const useIntroDay = defineStore("introDay", {
  state: () => ({
    groq: new Groq({
      apiKey: import.meta.env.VITE_GROQ_URL,
      dangerouslyAllowBrowser: true,
    }),
    scenario: "",
    loading: false,
    error: null,
    characterName: "", // Add a new state property to store the extracted name
  }),

  actions: {

    // Starts the character background scenario generation process
    async startScenario({ intro }) {
      this.loading = true;
      this.error = null;
      this.scenario = "";

      try {
        // API call to generate the scenario using Groq
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `Make an introduction story/first day scenario in the classical era in the Philippines based on the provided content.
              limit your response in 1 paragraph 50 words`,
            },
            {
              role: "user",
              content: intro, // Pass the raw intro content directly
            },
          ],
          model: "llama-3.1-8b-instant",
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true,
          stop: null,
        });

        // Collect and format the response
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          this.scenario += content.replace(/\n/g, "<br>"); // Format line breaks for HTML
        }
      } catch (error) {
        this.error =
          error.message || "An error occurred while generating the scenario.";
      } finally {
        this.loading = false;
      }
    },
  },
});
