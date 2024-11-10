import { defineStore } from 'pinia';
import { Groq } from 'groq-sdk'; 

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

export const useTauntStore = defineStore('taunt', {
  state: () => ({
    tauntMessage: '', // Store the taunt message
  }),
  actions: {
    async getTauntMessage() {
      const chatCompletion = await groq.chat.completions.create({
        "messages": [
          {
            "role": "system",
            "content": "imagine a scenario that you encounter a native warrior opponent, pretend that you are a native warrior also in the philippines, that isnt afraid of any battles. limit your respone in 1 sentence, 20 words only. give me a taunt message. to ignite my anger roast me!"
          },
          {
            "role": "user",
            "content": ""
          },
        ],
        "model": "llama3-70b-8192",
        "temperature": 1,
        "max_tokens": 1024,
        "top_p": 1,
        "stream": true,
        "stop": null
      });

      // Process the stream and update tauntMessage
      let taunt = '';
      for await (const chunk of chatCompletion) {
        taunt += chunk.choices[0]?.delta?.content || '';
      }
      this.tauntMessage = taunt; // Update the store's tauntMessage state

      // Log the full AI response to the console
      console.log('AI Taunt Response:', taunt);
    },
  },
});
