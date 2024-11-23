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

    async startScenario(area) {
      this.loading = true;
      this.error = null;
      this.scenario = "";

      try {
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are the game master. Create a random scenario in the classical era timeline in the perspective of a native warrior
                        living in the Philippines skilled in arnis-stick martial arts. The scenario occurs in the area '${area}'.
                        dont make a character introduction just the scenario.
                        Provide four shuffled choices: A (neutral), B (aggressive), C (neglect), D (help).`,
            },
            { role: "user", content: "start" },
          ],
          model: "llama3-8b-8192",
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true,
          stop: null,
        });

        for await (const chunk of chatCompletion) {
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
