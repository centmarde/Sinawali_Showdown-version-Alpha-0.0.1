import { defineStore } from "pinia";
import { Groq } from "groq-sdk";

export const useCharacterBackground = defineStore("characterBackground", {
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
    async startScenario({ job, personalities }) {
      if (!this.groq) {
        throw new Error(
          "Groq is not initialized. Call 'initializeGroq' first."
        );
      }

      this.loading = true;
      this.error = null;
      this.scenario = "";
      this.characterName = ""; // Reset characterName before generating

      // Ensure personalities is an array before calling join
      const personalityString = Array.isArray(personalities)
        ? personalities.join(", ")
        : ""; // Fallback to empty string if not an array
      const content = `${job}, ${personalityString}`;

      try {
        // API call to generate the character background using Groq
        const chatCompletion = await this.groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `Provide a character background based on the job and personality choices male only.
                   Note that this is from the classical era in the Philippines. relate it the story to arnis-stick martial arts. Give a summary only; limit 200 words.
                   Format is **Name** <value> a.k.a Kidlat, Occupation: <value>, Age: <value>, Challenges: <value>, Bio: <value>. limit your response in 1 paragraph 50 words`,
            },
            {
              role: "user",
              content: content, // Use the concatenated job and personality string
            },
          ],
          model: "llama3-8b-8192",
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true,
          stop: null,
        });

        // Collect and format the response from the API
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          this.scenario += content.replace(/\n/g, "<br>"); // Format line breaks for HTML
        }

        // Extract the **Name** using a regex after the response is complete
        const nameMatch = this.scenario.match(/\*\*Name\*\*:\s*([^,<]*)/);

        if (nameMatch) {
          this.characterName = nameMatch[1].trim(); // Store the extracted name
        } /* else {
          console.warn("Name not found in the scenario response.");
        } */
      } catch (error) {
        // Handle API errors and set the error state
        this.error =
          error.message || "An error occurred while generating the scenario.";
      } finally {
        this.loading = false;
      }
    },
  },
});
