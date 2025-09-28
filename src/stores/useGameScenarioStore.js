import { defineStore } from "pinia";
import { Groq } from "groq-sdk";

export const useGameScenarioStore = defineStore("gameScenario", {
  state: () => ({
    groq: new Groq({
      apiKey: import.meta.env.VITE_GROQ_URL,
      dangerouslyAllowBrowser: true,
    }),
    scenario: "",
    loading: false,
    error: null,
  }),

  actions: {

    async startScenario(area, bio) {
      this.loading = true;
      this.error = null;
      this.scenario = "";

      try {
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: ` summarize your answer in 2 paragraphs in 40 words. You are the game master. Create a random scenario in the classical era timeline (Philippines). in the perspective of ${bio} who is skilled in arnis-stick martial arts.
                        The scenario occurs in the area '${area}'. The scenario must have choices pattern. a= neutral, b=aggressive that its starts a fight, c=neglect.

                        `,
            },
            { role: "user", content: "start" },
          ],
          model: "llama-3.1-8b-instant",
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
