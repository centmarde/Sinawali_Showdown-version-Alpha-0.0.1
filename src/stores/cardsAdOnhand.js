import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";

export const useCardStore1 = defineStore("cardStore1", () => {
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
      const { data: deckBuilds, error: deckBuildsError } = await supabase
        .from("deck_builds")
        .select("card_id");

      if (deckBuildsError) {
        console.error("Error fetching deck builds:", deckBuildsError);
        return null;
      }

      // Extract card_id values from the deckBuilds data
      const cardIds = deckBuilds.map((deckBuild) => deckBuild.card_id);

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .in("id", cardIds); // Use `.in()` to filter by array

      if (error) {
        console.error("Error fetching cards:", error);
        return null;
      }

      const availableCards = data.filter(
        (card) =>
          card.id !== 91 && !onHandCards.value.some((c) => c.id === card.id)
      );

      if (availableCards.length) {
        const weightedCards = [];
        availableCards.forEach((card) => {
          const drawCount = Math.floor(card.draw_chance / 10);
          for (let i = 0; i < drawCount; i++) weightedCards.push(card);
        });

        const randomCard =
          weightedCards[Math.floor(Math.random() * weightedCards.length)];
        return randomCard;
      }
      return null;
    } catch (error) {
      console.error("Error in fetchNewCard:", error);
      return null; // Return null if there's an error
    }
  };

  const removeCardAndAddNew = async (index) => {
    const newCard = await fetchNewCard();
    if (newCard) onHandCards.value.splice(index, 1, newCard);
  };

  return { onHandCards, addCard, removeCardAndAddNew };
});
