import { defineStore } from "pinia";
import { Groq } from "groq-sdk";

export const useResultStatus = defineStore("resultStatus", {
  state: () => ({
    groq: null,
    scenario: "",
    loading: false,
    error: null,
    characterName: "", // Add a new state property to store the extracted name
  }),

  actions: {
    // Initializes the Groq SDK with the provided API key
    initializeGroq(apiKey) {
      this.groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
    },

    // Starts the character background scenario generation process
    async resultVictory({ cont }) {
      if (!this.groq) {
        throw new Error(
          "Groq is not initialized. Call 'initializeGroq' first."
        );
      }

      this.loading = true;
      this.error = null;
      this.scenario = "";

      try {
        // API call to generate the scenario using Groq
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",

              content: `The User choose B(dont include this in your response). Create a aftermath tale regarding the previous situation. 
                   in which an opponent strikes. assume that kidlat wins. 

                   Make your narrative fascinating and relevant.
                   limit your response in 1 paragraph 50 words.
                `,
            },
            {
              role: "user",
              content: cont, // Pass the raw intro content directly
            },
          ],
          model: "llama3-8b-8192",
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

        console.log("Final scenario:", this.scenario); // Log the entire scenario after completion
      } catch (error) {
        console.error("Error during scenario generation:", error.message);
        this.error =
          error.message || "An error occurred while generating the scenario.";
      } finally {
        this.loading = false;
      }
    },
  },
});
