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

  // Fetches a single random card from the database, excluding card.id 91
  const fetchNewCard = async () => {
    try {
      const { data, error } = await supabase.from("cards").select("*");
      if (error) {
        throw new Error("Error fetching cards:", error);
      }
      const availableCards = data.filter(
        (card) => card.id !== 91 && // Exclude card with id 91
          !onHandCards.value.some((c) => c.id === card.id)
      );
      if (availableCards.length) {
        const randomCard =
          availableCards[Math.floor(Math.random() * availableCards.length)];
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
