import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";
import { Groq } from 'groq-sdk'; 


const apiKey = process.env. VITE_GROQ_URL || 'default_api_key';
const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true
  });
export const useCardStore2 = defineStore("cardStore2", () => {
  const onHandCards = ref([]);

  const addCard = (card) => {
    if (
      card.id !== 91 && 
      onHandCards.value.length < 5 &&
      !onHandCards.value.some((c) => c.id === card.id)
    ) {
      onHandCards.value.push(card);
    }
  };

  const fetchNewCard = async () => {
    try {
      const { data, error } = await supabase.from("cards").select("*");
      if (error) {
        console.error("Error fetching cards:", error);
        return null;
      }
  
      const availableCards = data.filter(
        (card) => card.id !== 91 && !onHandCards.value.some((c) => c.id === card.id)
      );
  
      if (availableCards.length) {
        const weightedCards = [];
        availableCards.forEach((card) => {
          const drawCount = Math.floor(card.draw_chance / 10);
          for (let i = 0; i < drawCount; i++) weightedCards.push(card);
        });
  
        const randomCard = weightedCards[Math.floor(Math.random() * weightedCards.length)];
        return randomCard;
      }
      return null;
    } catch (error) {
      console.error("Error in fetchNewCard:", error);
    }
  };

  const removeCardAndAddNew = async (index) => {
    const newCard = await fetchNewCard();
    if (newCard) onHandCards.value.splice(index, 1, newCard);
  };

  // AI Move method
  const AImove = async () => {
    try {
      const cardDetails = onHandCards.value.map((card) => ({
        id: card.id,
        name: card.name,
        power: card.power,
        mana: card.mana,
      }));

      const messages = [
        {
          role: "system",
          content: "You're playing a turn-based game. Choose the best card to defeat the enemy based on card details."
        },
        {
          role: "user",
          content: JSON.stringify(cardDetails)
        }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
      });

      let aiResponse = '';
      for await (const chunk of chatCompletion) {
        aiResponse += chunk.choices[0]?.delta?.content || '';
      }

      console.log("AI selected card response:", aiResponse);
      const chosenCard = onHandCards.value.find(card => aiResponse.includes(card.name));

      return chosenCard || null;
    } catch (error) {
      console.error("Error in AImove:", error);
    }
  };

  return { onHandCards, addCard, removeCardAndAddNew, AImove };
});
