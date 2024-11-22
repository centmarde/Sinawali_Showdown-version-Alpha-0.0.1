import { defineStore } from "pinia";
import { Groq } from "groq-sdk";

export const useGameScenarioStore = defineStore("gameScenario", {
  state: () => ({
    groq: null,
    scenario: "",
    loading: false,
    error: null,
  }),

  actions: {
    initializeGroq(apiKey) {
      this.groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
    },

    async startScenario() {
      if (!this.groq) {
        throw new Error(
          "Groq is not initialized. Call 'initializeGroq' first."
        );
      }

      this.loading = true;
      this.error = null;
      this.scenario = "";

      try {
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "you are the game master make a random scenario base on classical era timeline. in perspective of a native warrior living on philippines. " +
                "that is master of arnis-stick martial arts. your scenario must have choices a, b, c and d. a= neutral, b=aggressive, c=neglect and d=help" +
                "but you must shuffle this choices to avoid cheating. its like we play dnd games. dont put introduction to player perspective just straight " +
                "random scenarios. the game starts when i type start.",
            },

            {
              role: "user",
              content: "start",
            },
          ],
          model: "llama3-8b-8192",
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true,
          stop: null,
        });

        for await (const chunk of chatCompletion) {
          // Get the content and replace newlines with <br> tags for formatting
          const content = chunk.choices[0]?.delta?.content || "";
          this.scenario += content.replace(/\n/g, "<br>");
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
