<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" class="d-flex justify-center">
                <v-btn class="mx-auto" style="width: 200px;" v-if="characterBackground"
                    @click="insertIntoDB">Start</v-btn>
            </v-col>
        </v-row>

        <v-row>
            
            <!-- Left Column: Jobs & Personality Choices -->
            <v-col>
                
                <v-card class="pa-4" outlined>
                    <!-- Jobs Row -->
                    <v-row>
                        <v-col v-for="(job, index) in jobs" :key="index" cols="12" md="4">
                            <v-btn @click="chooseJob(job)" :color="selectedJob === job ? 'primary' : ''"
                                class="d-flex justify-center align-center" tile>
                                <v-icon :size="40">{{ job.icon }}</v-icon>
                                <span class="ml-2">{{ job.name }}</span>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- Personality Choices -->
                    <v-divider></v-divider>
                    <p class="font-weight-bold text-center mt-5">Choose 4 personalities for your character</p>
                    <v-row class="mt-4">
                        <v-col v-for="(personality, index) in personalities" :key="index" cols="12" md="4">
                            <v-btn @click="applyPersonality(personality)"
                                :color="selectedPersonality.includes(personality) ? 'secondary' : ''"
                                class="d-flex justify-center align-center" tile
                                :disabled="selectedPersonality.length >= 4 && !selectedPersonality.includes(personality)">
                                <v-icon :size="30">{{ personality.icon }}</v-icon>
                                <span class="ml-2">{{ personality.name }}</span>
                            </v-btn>
                        </v-col>
                    </v-row>

                    <!-- Personality Limit Info -->
                    <v-row class="mt-4">
                        <v-col cols="12">
                            <v-alert type="info" v-if="selectedPersonality.length >= 4">
                                You've reached the maximum of 4 personality choices.
                            </v-alert>
                        </v-col>
                    </v-row>

                    <!-- Reset Personality Button -->
                    <v-row class="mt-4">
                        <v-col cols="6">
                            <v-btn @click="resetPersonality" color="error" class=" merienda w-100">
                                Reset Personality Choices
                            </v-btn>
                            
                        </v-col>
                        <v-col cols="6">
                            <router-link to="/save"><v-btn
      class="floating-button2 merienda w-100"
      color="secondary"
    >
      Go Back
    </v-btn></router-link>
                        </v-col>
                        
                    </v-row>
                </v-card>
            </v-col>

            <!-- Right Column: Traits Progress Bars -->
            <v-col>
                <v-card class="pa-4" outlined>
                    <v-card-title>Character Traits</v-card-title>
                    <v-row class="mt-4">
                        <v-col v-for="(trait, index) in traits" :key="index" cols="12" md="12">
                            <v-row>
                                <v-col class="d-flex align-center">
                                    <v-icon :size="24">{{ trait.icon }}</v-icon>
                                    <span class="ml-2">{{ trait.name }}</span>
                                </v-col>
                                <v-col>
                                    <v-progress-linear
                                        class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
                                        :model-value="traitValues[trait.name]" max="100" color="#ffd82b" height="14"
                                        rounded
                                        :style="`--progress-shadow-color: rgba(255, 216, 43, ${traitValues[trait.name] / 100});`">
                                    </v-progress-linear>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>

                <v-divider></v-divider>
                <v-card>
                    <v-card-title>Character Background</v-card-title>
                    <v-row>
                        <v-col cols="12">
                            <div v-html="characterBackground"
                                style="max-height: 164px; padding:2rem; overflow-y: auto;"></div>
                        </v-col>
                    </v-row>

                    <!-- Button to Generate Background and Log Data -->
                    <v-row class="mt-4">
                        <v-col cols="12">
                            <v-btn @click="generateCharacterBackground" color="primary" class="merienda w-100">
                                Generate Character Background
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
                
            </v-col>
            
        </v-row>
        
    </v-container>
</template>



<script>
import { useCharacterBackground } from "@/stores/useCharacterBackground"; // Adjust path as needed
import { supabase } from '@/lib/supabase'; // Import Supabase client
import router from "@/router/index";
import { useAudioAdventure } from "@/stores/adventureAudio";

export default {

    data() {
        return {
            selectedJob: null,
            selectedPersonality: [],
            jobs: [
                { name: 'Soldier', icon: 'mdi-shield' },
                { name: 'Warrior', icon: 'mdi-sword' },
                { name: 'Musician', icon: 'mdi-music-note' },
                { name: 'Burglar', icon: 'mdi-lock' },
                { name: 'Farmer', icon: 'mdi-sprout' },
                { name: 'Royalty', icon: 'mdi-crown' },
                { name: 'Assassin', icon: 'mdi-knife' },
                { name: 'Engineer', icon: 'mdi-tools' }, 
                { name: 'Chef', icon: 'mdi-silverware-fork-knife' }
            ],
            traits: [
                { name: 'Strength', icon: 'mdi-arm-flex' },
                { name: 'Wisdom', icon: 'mdi-brain' },
                { name: 'Dexterity', icon: 'mdi-run-fast' },
                { name: 'Charisma', icon: 'mdi-hand-heart' },
                { name: 'Constitution', icon: 'mdi-heart' },
                { name: 'Intelligence', icon: 'mdi-lightbulb' },
            ],
            personalities: [
                { name: 'Short-temper', icon: 'mdi-emoticon-angry' },
                { name: 'Generous', icon: 'mdi-heart' },
                { name: 'Clever', icon: 'mdi-lightbulb-on' },
                { name: 'Friendly', icon: 'mdi-handshake' },
                { name: 'Proud', icon: 'mdi-trophy' },
                { name: 'Lazy', icon: 'mdi-bed-empty' },
                { name: 'Brave', icon: 'mdi-shield' },
                { name: 'Greedy', icon: 'mdi-cash' },
                { name: 'Honest', icon: 'mdi-check-circle' },
                { name: 'Egotistical', icon: 'mdi-account-tie' },
                { name: 'Shy', icon: 'mdi-eye-off' },
                { name: 'Optimistic', icon: 'mdi mdi-white-balance-sunny' },
                { name: 'Pessimistic', icon: 'mdi-cloud' },
                { name: 'Witty', icon: 'mdi mdi-emoticon-excited' },
                { name: 'Romantic', icon: 'mdi-heart' },
                { name: 'Curious', icon: 'mdi-magnify' },
                { name: 'Honorable', icon: 'mdi-star' },
                { name: 'Impulsive', icon: 'mdi-arrow-decision' }, 
                { name: 'Compassionate', icon: 'mdi-heart-circle' }, 
                { name: 'Stoic', icon: 'mdi-account-cog' }, 
                { name: 'Insecure', icon: 'mdi-eye' }, 
                { name: 'Ambitious', icon: 'mdi-rocket' }, 
                { name: 'Eccentric', icon: 'mdi-pyramid' }, 
                { name: 'Self-sufficient', icon: 'mdi-hammer-wrench' } 
            ],
            traitValues: {
                Strength: 0,
                Wisdom: 0,
                Dexterity: 0,
                Charisma: 0,
                Constitution: 0,
                Intelligence: 0,
            },
            characterBackground: "",
        };
    },


    methods: {


        chooseJob(job) {
            this.selectedJob = job;
            this.setJobTraits(job.name);
            console.log(`Job selected: ${job.name}`);
        },
        setJobTraits(jobName) {
            const jobTraits = {
                Soldier: { Strength: 50, Wisdom: 50, Dexterity: 50, Charisma: 50, Constitution: 50, Intelligence: 50 },
    Warrior: { Strength: 86, Wisdom: 20, Dexterity: 60, Charisma: 10, Constitution: 75, Intelligence: 20 },
    Musician: { Strength: 36, Wisdom: 60, Dexterity: 55, Charisma: 80, Constitution: 40, Intelligence: 30 },
    Burglar: { Strength: 40, Wisdom: 50, Dexterity: 80, Charisma: 20, Constitution: 40, Intelligence: 10 },
    Farmer: { Strength: 80, Wisdom: 50, Dexterity: 40, Charisma: 40, Constitution: 60, Intelligence: 30 },
    Royalty: { Strength: 26, Wisdom: 70, Dexterity: 30, Charisma: 90, Constitution: 40, Intelligence: 63 },
    Assassin: { Strength: 40, Wisdom: 20, Dexterity: 89, Charisma: 30, Constitution: 50, Intelligence: 30 },
    Engineer: { Strength: 50, Wisdom: 40, Dexterity: 70, Charisma: 40, Constitution: 60, Intelligence: 70 },
    Chef: { Strength: 40, Wisdom: 60, Dexterity: 50, Charisma: 70, Constitution: 50, Intelligence: 30 } 
            };
            this.traitValues = { ...jobTraits[jobName] };
        },
        applyPersonality(personality) {
            if (this.selectedPersonality.length < 4 && !this.selectedPersonality.includes(personality)) {
                this.selectedPersonality.push(personality);
                this.modifyTraitsBasedOnPersonality(personality.name);
                console.log(`Personality selected: ${personality.name}`);
            }
        },
        modifyTraitsBasedOnPersonality(personality) {
            const personalityEffects = {
                'Short-temper': { Charisma: -20, Wisdom: -10, Dexterity: -5, Strength: 10 },
                'Generous': { Charisma: 20, Constitution: 10, Wisdom: -20, Dexterity: 5 },
                'Clever': { Intelligence: 20, Wisdom: 5, Dexterity: -10, Strength: 10 },
                'Friendly': { Charisma: 20, Constitution: 10, Dexterity: 5, Wisdom: -10 },
                'Proud': { Charisma: -20, Constitution: -10, Strength: -5, Dexterity: 10 },
                'Lazy': { Constitution: -20, Strength: -10, Dexterity: -5, Intelligence: 20 },
                'Brave': { Strength: 20, Constitution: 10, Wisdom: 5, Dexterity: -5 },
                'Greedy': { Charisma: -15, Intelligence: -5, Dexterity: -5, Constitution: 15 },
                'Honest': { Wisdom: 20, Constitution: 10, Strength: 5, Charisma: -5 },
                'Egotistical': { Charisma: -20, Intelligence: -10, Constitution: -5, Wisdom: 15 },
                'Shy': { Charisma: -20, Dexterity: -5, Intelligence: -5, Strength: 10 },
                'Optimistic': { Wisdom: 15, Constitution: 10, Charisma: 5, Strength: 5 },
                'Pessimistic': { Wisdom: -10, Constitution: -15, Charisma: -5, Dexterity: 5 },
                'Witty': { Intelligence: 20, Charisma: 10, Dexterity: 5, Strength: -5 },
                'Romantic': { Charisma: 20, Dexterity: 10, Wisdom: 5, Strength: -5 },
                'Curious': { Intelligence: 20, Wisdom: 10, Dexterity: 5, Charisma: -5 },
                'Honorable': { Charisma: 10, Wisdom: 15, Strength: 5, Constitution: -5 },
                'Impulsive': { Dexterity: 20, Wisdom: -10, Intelligence: -5, Charisma: 10 },
                'Compassionate': { Charisma: 15, Constitution: 10, Strength: 5, Intelligence: -5 },
                'Stoic': { Strength: 10, Wisdom: 15, Dexterity: 5, Constitution: -10 },
                'Insecure': { Charisma: -15, Constitution: -5, Dexterity: -5, Wisdom: 10 },
                'Ambitious': { Strength: 15, Intelligence: 15, Charisma: 5, Constitution: -5 },
                'Eccentric': { Dexterity: 10, Intelligence: 20, Charisma: 5, Wisdom: -5 },
                'Self-sufficient': { Constitution: 20, Wisdom: 10, Strength: 5, Intelligence: -5 },
            };



            if (personalityEffects[personality]) {
                for (let [trait, value] of Object.entries(personalityEffects[personality])) {
                    this.traitValues[trait] += value;
                }
            }
        },
        resetPersonality() {
            this.selectedPersonality = [];
            this.selectedJob = null;
            this.traitValues = {
                Strength: 0,
                Wisdom: 0,
                Dexterity: 0,
                Charisma: 0,
                Constitution: 0,
                Intelligence: 0,
            };
        },
        async generateCharacterBackground() {
            const job = this.selectedJob ? this.selectedJob.name : '';
            const personalities = this.selectedPersonality.map(p => p.name).join(', ');

            try {
                // Ensure Groq is initialized before calling startScenario
                const characterStore = useCharacterBackground();
                if (!characterStore.groq) {
                    characterStore.initializeGroq("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");
                }

                // Use the store to generate the background
                await characterStore.startScenario({ job, personalities });
                this.characterBackground = characterStore.scenario;
                /*  console.log('Character Job:', job);
                 console.log('Character Personality Traits:', personalities);
                 console.log('Character Bio:', this.characterBackground); */
            } catch (error) {
                console.error('Error generating character background:', error);
            }
        },
        async insertIntoDB() {
            try {
                const adventureAudio = useAudioAdventure();
                adventureAudio.playClick();
                const userId = localStorage.getItem('user_id'); // Get user_id from localStorage

                // Insert into adventures table
                const { data: adventureData, error: insertError } = await supabase
                    .from('adventures')
                    .insert([{ intro: this.characterBackground, user_id: userId }])
                    .select('id'); // Retrieve the inserted ID

                if (insertError) {
                    console.error('Error inserting into adventures table:', insertError);
                    return;
                }

                // Save the adventure ID into localStorage and log it
                if (adventureData && adventureData.length > 0) {
                    const adventureId = adventureData[0].id;
                    localStorage.setItem('adventure_id', adventureId);
                    console.log('Inserted adventure ID:', adventureId);
                }

                // Use the character background store to access the generated name
                const characterStore = useCharacterBackground();
                const characterName = characterStore.characterName || 'Kidlat'; // Fallback if no name generated

                // Insert into characters table
                const characterData = {
                    name: characterName, // Use the name generated from Groq
                    health: Math.round((this.traitValues.Constitution / 100) * 100), // Ensure integer
                    mana: Math.round((this.traitValues.Intelligence / 100) * 100),
                    agility: Math.round((this.traitValues.Dexterity / 100) * 50),
                    critical_rate: Math.round((this.traitValues.Strength / 100) * 50),
                    wisdom: this.traitValues.Wisdom,
                    adventure_id: adventureData[0].id,
                    user_id: userId,
                };


                const { data: characterDataRes, error: characterError } = await supabase
                    .from('characters')
                    .insert([characterData])
                    .select('id'); // Retrieve the inserted ID

                if (characterError) {
                    console.error('Error inserting into characters table:', characterError);
                    return;
                }

                // Save the character ID into localStorage and log it
                if (characterDataRes && characterDataRes.length > 0) {
                    const characterId = characterDataRes[0].id;
                    localStorage.setItem('character_id', characterId);
                    console.log('Inserted character ID:', characterId);
                }


                console.log('Character successfully created!');

                router.push('/story_intro');
            } catch (error) {
                console.error('Error inserting data into Supabase:', error);
            }

        }

    }
};
</script>

<style scoped>
.animated-progress {
    animation: brighten 2s infinite;
    box-shadow: 0 0 15px var(--progress-shadow-color);
}

@keyframes brighten {
    0% {
        box-shadow: 0 0 15px var(--progress-shadow-color);
    }

    50% {
        box-shadow: 0 0 30px var(--progress-shadow-color);
    }

    100% {
        box-shadow: 0 0 15px var(--progress-shadow-color);
    }
}
</style>