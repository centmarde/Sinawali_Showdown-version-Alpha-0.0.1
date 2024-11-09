// store/cards1.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../lib/supabase";

export const useCardStore1 = defineStore("cardStore1", () => {
  const onHandCards = ref([]);

  // Adds a card to onHandCards if there are less than 5 cards in hand and card.id is not 91
  const addCard = (card) => {
    if (
      card.id !== 91 && // Prevent card with id 91
      onHandCards.value.length < 5 &&
      !onHandCards.value.some((c) => c.id === card.id)
    ) {
      onHandCards.value.push(card);
    }
  };

  // Fetches a single random card from the database, excluding card.id 91 and cards not in deck_builds
  const fetchNewCard = async () => {
    const userId = localStorage.getItem("user_id");

    try {
      // Step 1: Fetch card_id values from the deck_builds table
      const { data: deckBuilds, error: deckError } = await supabase
        .from("deck_builds")
        .select("card_id")
        .eq("user_id", userId);

      if (deckError) {
        throw new Error("Error fetching deck builds:", deckError);
      }

      // Step 2: Extract card_ids from the deckBuilds data
      const cardIds = deckBuilds.map((deck) => deck.card_id);

      if (cardIds.length === 0) {
        console.log("No cards in deck builds.");
        return null;
      }

      // Step 3: Fetch cards from the cards table that are in deck_builds (i.e., match card_id)
      const { data: availableCards, error: cardsError } = await supabase
        .from("cards")
        .select("*")
        .in("id", cardIds); // Filter cards by the card_ids from deck_builds

      if (cardsError) {
        throw new Error("Error fetching cards:", cardsError);
      }

      // Step 4: Filter out card with ID 91 and any already on hand
      const availableFilteredCards = availableCards.filter(
        (card) => card.id !== 91 && !onHandCards.value.some((c) => c.id === card.id)
      );

      if (availableFilteredCards.length) {
        // Step 5: Create a weighted array based on draw_chance
        const weightedCards = [];
        availableFilteredCards.forEach((card) => {
          const drawCount = Math.floor(card.draw_chance / 10); // Adjust scaling factor if needed
          for (let i = 0; i < drawCount; i++) {
            weightedCards.push(card);
          }
        });

        // Step 6: Select a random card from the weighted array
        const randomCard = weightedCards[Math.floor(Math.random() * weightedCards.length)];
        return randomCard;
      }

      return null;
    } catch (error) {
      console.error(error);
    }
  };

  // Removes a card at a specified index and replaces it with a new card
  const removeCardAndAddNew = async (index) => {
    const newCard = await fetchNewCard();
    if (newCard) {
      onHandCards.value.splice(index, 1, newCard);
    }
  };

  return { onHandCards, addCard, removeCardAndAddNew };
});
