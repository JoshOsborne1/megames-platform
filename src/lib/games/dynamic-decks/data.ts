import { Card, Deck, DeckInfo } from "./types";

// ============================================================================
// CLASSIC DECK - The original Dynamic Decks word cards
// Difficulty based on: Easy = common words, Medium = less common, Hard = abstract
// ============================================================================
const CLASSIC_CARDS: Card[] = [
  // EASY (Yellow, 10 pts) - Common everyday words
  { id: "classic-1", word: "Elephant", forbidden: ["trunk", "big", "ears", "Africa"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-2", word: "Pizza", forbidden: ["cheese", "circle", "Italian", "topping"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-4", word: "Guitar", forbidden: ["strings", "music", "play", "instrument"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-5", word: "Smartphone", forbidden: ["phone", "app", "screen", "call"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-7", word: "Bicycle", forbidden: ["wheels", "pedal", "ride", "helmet"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-9", word: "Chocolate", forbidden: ["sweet", "candy", "brown", "cocoa"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-11", word: "Snowman", forbidden: ["carrot", "snow", "winter", "cold"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-15", word: "Hamburger", forbidden: ["beef", "bun", "fast food", "cheese"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-20", word: "Popcorn", forbidden: ["movie", "corn", "salt", "butter"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-22", word: "Keyboard", forbidden: ["typing", "computer", "keys", "input"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-25", word: "Microwave", forbidden: ["heat", "kitchen", "food", "cook"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-27", word: "Backpack", forbidden: ["school", "bag", "carry", "straps"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-29", word: "Sandwich", forbidden: ["bread", "lunch", "ham", "eat"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-37", word: "Bowling", forbidden: ["pins", "ball", "strike", "lane"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-40", word: "Umbrella", forbidden: ["rain", "wet", "shield", "dry"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-53", word: "Honey", forbidden: ["bee", "sweet", "yellow", "sticky"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-54", word: "Penguin", forbidden: ["bird", "Antarctica", "ice", "swim"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-55", word: "Map", forbidden: ["paper", "directions", "world", "location"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-56", word: "Clock", forbidden: ["time", "hours", "watch", "minutes"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-57", word: "Sun", forbidden: ["star", "hot", "sky", "yellow"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-58", word: "Tree", forbidden: ["green", "wood", "forest", "leaves"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-59", word: "Apple", forbidden: ["fruit", "red", "eat", "cider"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-60", word: "Dog", forbidden: ["pet", "bark", "animal", "friend"], points: 10, color: "yellow", difficulty: "easy" },

  // MEDIUM (Blue, 20 pts) - Less common but still recognizable
  { id: "classic-3", word: "Astronaut", forbidden: ["space", "moon", "NASA", "suit"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-6", word: "Library", forbidden: ["books", "quiet", "read", "building"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-8", word: "Volcano", forbidden: ["lava", "hot", "mountain", "erupt"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-10", word: "Butterfly", forbidden: ["wings", "insect", "caterpillar", "fly"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-13", word: "Rainbow", forbidden: ["colors", "sky", "rain", "sun"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-14", word: "Kangaroo", forbidden: ["jump", "pouch", "Australia", "animal"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-17", word: "Cactus", forbidden: ["desert", "spikes", "plant", "water"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-19", word: "Dinosaur", forbidden: ["extinct", "fossil", "ancient", "reptile"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-23", word: "Waterfall", forbidden: ["river", "water", "drop", "nature"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-24", word: "Pyramid", forbidden: ["Egypt", "triangle", "ancient", "desert"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-28", word: "Firefighter", forbidden: ["water", "truck", "fire", "extinguish"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-33", word: "Octopus", forbidden: ["tentacles", "sea", "eight", "ink"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-34", word: "Diamond", forbidden: ["ring", "expensive", "jewel", "hard"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-35", word: "Skeleton", forbidden: ["bones", "body", "spooky", "inside"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-39", word: "Tornado", forbidden: ["wind", "storm", "spin", "weather"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-42", word: "Postcard", forbidden: ["mail", "travel", "stamp", "write"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-43", word: "Rollercoaster", forbidden: ["ride", "fast", "scary", "track"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-61", word: "Anchor", forbidden: ["ship", "bottom", "heavy", "ocean"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-62", word: "Bee", forbidden: ["sting", "honey", "insect", "buzz"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-63", word: "Bridge", forbidden: ["cross", "water", "road", "over"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-64", word: "Camera", forbidden: ["picture", "photo", "lens", "snap"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-65", word: "Castle", forbidden: ["king", "queen", "stone", "fort"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-66", word: "Desert", forbidden: ["sand", "hot", "dry", "camel"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-67", word: "Dragon", forbidden: ["fire", "myth", "wings", "scary"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-68", word: "Earth", forbidden: ["planet", "world", "ground", "dirt"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-72", word: "Island", forbidden: ["ocean", "land", "water", "beach"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-76", word: "Mountain", forbidden: ["climb", "high", "snow", "peak"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-78", word: "Ocean", forbidden: ["sea", "water", "blue", "salt"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-81", word: "Rocket", forbidden: ["space", "fire", "ship", "launch"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-82", word: "Star", forbidden: ["night", "sky", "bright", "twinkle"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-83", word: "Train", forbidden: ["tracks", "station", "rail", "travel"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-84", word: "Whale", forbidden: ["big", "ocean", "swim", "water"], points: 20, color: "blue", difficulty: "medium" },

  // HARD (Green/Red, 30-50 pts) - Abstract concepts, technical terms, uncommon words
  { id: "classic-12", word: "Submarine", forbidden: ["underwater", "ocean", "ship", "depth"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-16", word: "Parachute", forbidden: ["jump", "plane", "sky", "fall"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-18", word: "Telescope", forbidden: ["stars", "look", "sky", "planets"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-21", word: "Lighthouse", forbidden: ["ocean", "light", "ships", "coast"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-26", word: "Symphony", forbidden: ["orchestra", "music", "classical", "conductor"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-30", word: "Helicopter", forbidden: ["fly", "rotors", "pilot", "air"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-31", word: "Gravity", forbidden: ["earth", "fall", "space", "force"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-32", word: "Passport", forbidden: ["travel", "country", "airport", "document"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-36", word: "Compass", forbidden: ["north", "direction", "map", "needle"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-38", word: "Satellite", forbidden: ["orbit", "space", "signal", "earth"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-41", word: "Microscope", forbidden: ["tiny", "science", "look", "cells"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-44", word: "Philosophy", forbidden: ["thinking", "wisdom", "exist", "life"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-45", word: "Scuba Diving", forbidden: ["water", "mask", "tank", "ocean"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-46", word: "Chameleon", forbidden: ["color", "lizard", "change", "blend"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-47", word: "Architecture", forbidden: ["building", "design", "house", "style"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-48", word: "Origami", forbidden: ["paper", "fold", "Japanese", "shapes"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-49", word: "Marathon", forbidden: ["run", "race", "miles", "long"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-50", word: "Hibernate", forbidden: ["sleep", "winter", "bear", "animals"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-51", word: "Blueprint", forbidden: ["design", "plan", "building", "engineer"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-52", word: "Stethoscope", forbidden: ["doctor", "heart", "listen", "medical"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-88", word: "Alphabet", forbidden: ["letters", "ABC", "learn", "write"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-90", word: "Chef", forbidden: ["cook", "food", "kitchen", "restaurant"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-91", word: "Doctor", forbidden: ["hospital", "sick", "medicine", "help"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-92", word: "Eagle", forbidden: ["bird", "USA", "symbol", "sky"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-98", word: "Knight", forbidden: ["armor", "sword", "shield", "horse"], points: 30, color: "green", difficulty: "hard" },
  { id: "classic-101", word: "Newton", forbidden: ["gravity", "scientist", "apple", "physics"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-102", word: "Opera", forbidden: ["sing", "loud", "music", "theater"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-104", word: "Quasar", forbidden: ["space", "bright", "star", "galaxy"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-106", word: "Nebula", forbidden: ["space", "dust", "gas", "star"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-107", word: "Galaxy", forbidden: ["stars", "space", "milky way", "big"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-109", word: "Avalanche", forbidden: ["snow", "slide", "mountain", "dangerous"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-110", word: "Metamorphosis", forbidden: ["change", "insect", "butterfly", "body"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-111", word: "Paradox", forbidden: ["statement", "true", "false", "confusing"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-112", word: "Quantum", forbidden: ["physics", "small", "science", "mechanics"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-113", word: "Labyrinth", forbidden: ["maze", "lost", "walls", "puzzle"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-114", word: "Enigma", forbidden: ["puzzle", "secret", "mystery", "hard"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-115", word: "Algorithm", forbidden: ["computer", "code", "math", "steps"], points: 50, color: "red", difficulty: "hard" },

  // NEW CARDS - EASY (25 more)
  { id: "classic-116", word: "Banana", forbidden: ["yellow", "fruit", "monkey", "peel"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-117", word: "Pillow", forbidden: ["bed", "sleep", "soft", "head"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-118", word: "Television", forbidden: ["watch", "screen", "show", "channel"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-119", word: "Glasses", forbidden: ["eyes", "see", "wear", "vision"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-120", word: "Toothbrush", forbidden: ["teeth", "clean", "mouth", "paste"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-121", word: "Shoe", forbidden: ["foot", "walk", "wear", "lace"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-122", word: "Window", forbidden: ["glass", "see", "open", "light"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-123", word: "Refrigerator", forbidden: ["cold", "food", "kitchen", "ice"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-124", word: "Lamp", forbidden: ["light", "bulb", "bright", "desk"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-125", word: "Couch", forbidden: ["sit", "living room", "sofa", "cushion"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-126", word: "Mirror", forbidden: ["reflection", "glass", "look", "see"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-127", word: "Balloon", forbidden: ["air", "pop", "party", "float"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-128", word: "Candle", forbidden: ["fire", "wax", "light", "burn"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-129", word: "Scissors", forbidden: ["cut", "paper", "blade", "sharp"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-130", word: "Wallet", forbidden: ["money", "pocket", "cards", "leather"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-131", word: "Blanket", forbidden: ["warm", "bed", "cover", "soft"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-132", word: "Toaster", forbidden: ["bread", "heat", "kitchen", "toast"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-133", word: "Cereal", forbidden: ["breakfast", "milk", "bowl", "morning"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-134", word: "Pencil", forbidden: ["write", "wood", "eraser", "draw"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-135", word: "Towel", forbidden: ["dry", "bath", "wet", "beach"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-136", word: "Soap", forbidden: ["clean", "wash", "bubble", "hands"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-137", word: "Book", forbidden: ["read", "pages", "story", "library"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-138", word: "Door", forbidden: ["open", "close", "enter", "knob"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-139", word: "Chair", forbidden: ["sit", "legs", "furniture", "table"], points: 10, color: "yellow", difficulty: "easy" },
  { id: "classic-140", word: "Coffee", forbidden: ["drink", "morning", "caffeine", "hot"], points: 10, color: "yellow", difficulty: "easy" },

  // NEW CARDS - MEDIUM (20 more)
  { id: "classic-141", word: "Jellyfish", forbidden: ["ocean", "sting", "tentacle", "float"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-142", word: "Hedgehog", forbidden: ["spines", "cute", "animal", "roll"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-143", word: "Flamingo", forbidden: ["pink", "bird", "leg", "stand"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-144", word: "Escalator", forbidden: ["stairs", "moving", "mall", "up"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-145", word: "Binoculars", forbidden: ["see", "far", "eyes", "bird"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-146", word: "Trampoline", forbidden: ["jump", "bounce", "fun", "spring"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-147", word: "Hammock", forbidden: ["swing", "relax", "sleep", "hang"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-148", word: "Charades", forbidden: ["game", "act", "guess", "silent"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-149", word: "Igloo", forbidden: ["ice", "cold", "eskimo", "snow"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-150", word: "Giraffe", forbidden: ["tall", "neck", "spots", "Africa"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-151", word: "Mermaid", forbidden: ["fish", "tail", "ocean", "sing"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-152", word: "Wizard", forbidden: ["magic", "wand", "spell", "hat"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-153", word: "Pirate", forbidden: ["ship", "treasure", "eye patch", "sword"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-154", word: "Vampire", forbidden: ["blood", "fangs", "bat", "night"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-155", word: "Unicorn", forbidden: ["horn", "magic", "horse", "rainbow"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-156", word: "Werewolf", forbidden: ["wolf", "moon", "transform", "bite"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-157", word: "Sphinx", forbidden: ["Egypt", "riddle", "lion", "statue"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-158", word: "Phoenix", forbidden: ["fire", "bird", "rebirth", "ashes"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-159", word: "Centaur", forbidden: ["horse", "human", "myth", "half"], points: 20, color: "blue", difficulty: "medium" },
  { id: "classic-160", word: "Medusa", forbidden: ["snakes", "stone", "Greek", "look"], points: 20, color: "blue", difficulty: "medium" },

  // NEW CARDS - HARD (13 more)
  { id: "classic-161", word: "Photosynthesis", forbidden: ["plant", "sun", "light", "green"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-162", word: "Democracy", forbidden: ["vote", "people", "government", "elect"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-163", word: "Hypothesis", forbidden: ["science", "guess", "theory", "test"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-164", word: "Ecosystem", forbidden: ["nature", "animals", "plants", "environment"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-165", word: "Archaeology", forbidden: ["dig", "ancient", "bones", "history"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-166", word: "Cryptocurrency", forbidden: ["bitcoin", "digital", "money", "blockchain"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-167", word: "Renaissance", forbidden: ["art", "history", "Europe", "rebirth"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-168", word: "Procrastination", forbidden: ["delay", "later", "lazy", "avoid"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-169", word: "Constellation", forbidden: ["stars", "sky", "pattern", "night"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-170", word: "Silhouette", forbidden: ["shadow", "outline", "dark", "shape"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-171", word: "Ventriloquist", forbidden: ["puppet", "talk", "voice", "dummy"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-172", word: "Biodegradable", forbidden: ["nature", "break", "environment", "compost"], points: 50, color: "red", difficulty: "hard" },
  { id: "classic-173", word: "Claustrophobia", forbidden: ["fear", "small", "space", "tight"], points: 50, color: "red", difficulty: "hard" },
];

// ============================================================================
// RANDOM RHYMES DECK - Rhyming phrase guessing game
// FIXED: Only true rhymes (matching vowel sounds in stressed syllables)
// Difficulty: Easy = simple animals/objects, Medium = well-known celebs, Hard = harder celebs
// ============================================================================
const RANDOM_RHYMES_CARDS: Card[] = [
  // =========== EASY - Simple animal/object rhymes (true rhymes only) ===========
  { id: "rhyme-1", word: "A cat in a hat", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A small furry feline is wearing some stylish headwear.", answer: "A cat in a hat" },
  { id: "rhyme-2", word: "A moose drinking juice", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A large antlered forest mammal is sipping an orange beverage through a straw.", answer: "A moose drinking juice" },
  { id: "rhyme-3", word: "A goose on the loose", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A honking waterfowl has escaped and is running around freely.", answer: "A goose on the loose" },
  { id: "rhyme-4", word: "A bear in a chair", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A large furry woodland creature is sitting comfortably on furniture.", answer: "A bear in a chair" },
  { id: "rhyme-5", word: "A bug in a mug", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A tiny six-legged insect has fallen into a coffee cup.", answer: "A bug in a mug" },
  { id: "rhyme-6", word: "A snail in the mail", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A slow creature with a spiral shell arrived inside a postal envelope.", answer: "A snail in the mail" },
  { id: "rhyme-7", word: "A fly wearing a tie", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A buzzing winged insect is dressed in formal neckwear.", answer: "A fly wearing a tie" },
  { id: "rhyme-8", word: "A dog on a log", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A four-legged canine is sitting on a fallen tree trunk.", answer: "A dog on a log" },
  { id: "rhyme-9", word: "A fish making a wish", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "An underwater creature with fins and scales is hoping for something special.", answer: "A fish making a wish" },
  { id: "rhyme-10", word: "A frog on a log", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A green jumping amphibian is resting on a fallen tree.", answer: "A frog on a log" },
  { id: "rhyme-11", word: "A bee on a knee", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A buzzing yellow and black striped insect is resting on someone's leg joint.", answer: "A bee on a knee" },
  { id: "rhyme-12", word: "A sheep going to sleep", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A woolly farm animal with fluffy white fur is getting ready for a nap.", answer: "A sheep going to sleep" },
  { id: "rhyme-13", word: "A whale with a tail", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A massive ocean mammal that spouts water is showing off its back fin.", answer: "A whale with a tail" },
  { id: "rhyme-14", word: "A crow in the snow", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A black bird known for cawing is standing in frozen white precipitation.", answer: "A crow in the snow" },
  { id: "rhyme-15", word: "A snake baking a cake", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A slithering legless reptile is making a sweet dessert in the oven.", answer: "A snake baking a cake" },
  { id: "rhyme-16", word: "A mouse in a house", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A tiny gray rodent with big ears is living inside a home.", answer: "A mouse in a house" },
  { id: "rhyme-17", word: "A bat wearing a hat", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A night-flying winged mammal is sporting some headwear.", answer: "A bat wearing a hat" },
  { id: "rhyme-18", word: "A newt in a suit", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A small salamander-like creature is dressed in formal business attire.", answer: "A newt in a suit" },
  { id: "rhyme-19", word: "A pup in a cup", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A baby puppy is sitting inside a drinking vessel.", answer: "A pup in a cup" },
  { id: "rhyme-20", word: "A fox in a box", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A clever orange woodland creature is sitting inside a cardboard container.", answer: "A fox in a box" },
  { id: "rhyme-21", word: "A hen with a pen", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A female chicken is holding a writing instrument.", answer: "A hen with a pen" },
  { id: "rhyme-22", word: "A rat with a bat", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A long-tailed rodent is holding a baseball hitting stick.", answer: "A rat with a bat" },

  // =========== MEDIUM - Well-known celebrities (true rhymes only) ===========
  { id: "rhyme-23", word: "Drake eating a steak", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Canadian 'Hotline Bling' rapper is cutting into a thick slab of grilled beef.", answer: "Drake eating a steak" },
  { id: "rhyme-24", word: "Kanye West wearing a vest", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Yeezy fashion designer and rapper is sporting a sleeveless jacket.", answer: "Kanye West wearing a vest" },
  { id: "rhyme-25", word: "Danny DeVito eating a burrito", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The star of It's Always Sunny in Philadelphia is enjoying a tin-foil-wrapped Mexican dinner.", answer: "Danny DeVito eating a burrito" },
  { id: "rhyme-26", word: "Post Malone all alone", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Circles' singer with face tattoos is completely by himself.", answer: "Post Malone all alone" },
  { id: "rhyme-27", word: "Tom Hanks giving thanks", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Forrest Gump and Cast Away star is expressing his gratitude.", answer: "Tom Hanks giving thanks" },
  { id: "rhyme-28", word: "Kevin Hart pushing a cart", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The short comedian from Jumanji is wheeling a shopping trolley down an aisle.", answer: "Kevin Hart pushing a cart" },
  { id: "rhyme-29", word: "Brad Pitt in a pit", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Fight Club and Ocean's Eleven star has fallen into a hole in the ground.", answer: "Brad Pitt in a pit" },
  { id: "rhyme-30", word: "Jack Black wearing black", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The School of Rock star is dressed entirely in dark-colored clothing.", answer: "Jack Black wearing black" },
  { id: "rhyme-31", word: "Cardi B drinking tea", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'WAP' rapper from the Bronx is sipping a hot beverage from a cup.", answer: "Cardi B drinking tea" },
  { id: "rhyme-32", word: "Shaq in a sack", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The giant basketball legend is stuck inside a large burlap bag.", answer: "Shaq in a sack" },
  { id: "rhyme-33", word: "Tom Cruise on a cruise", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Mission Impossible star is vacationing on a large ocean liner.", answer: "Tom Cruise on a cruise" },
  { id: "rhyme-34", word: "Adele in a shell", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Hello' and 'Someone Like You' British singer is sitting inside a seashell.", answer: "Adele in a shell" },
  { id: "rhyme-35", word: "Lizzo eating a pizza", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Truth Hurts' singer and flutist is enjoying a cheesy Italian pie.", answer: "Lizzo eating a pizza" },
  { id: "rhyme-36", word: "The Rock with a clock", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "Dwayne Johnson is holding a timepiece.", answer: "The Rock with a clock" },
  { id: "rhyme-37", word: "Taylor Swift being swift", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Shake It Off' singer is moving very quickly.", answer: "Taylor Swift being swift" },
  { id: "rhyme-38", word: "Ed Sheeran disappearing", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The ginger British 'Shape of You' singer is slowly vanishing.", answer: "Ed Sheeran disappearing" },

  // =========== HARD - Less obvious celebrities and longer phrases (true rhymes only) ===========
  { id: "rhyme-39", word: "Justin Bieber with a fever", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Canadian 'Baby' and 'Sorry' singer has a high temperature and isn't feeling well.", answer: "Justin Bieber with a fever" },
  { id: "rhyme-40", word: "Bob Marley riding a Harley", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The late reggae legend who sang 'One Love' is cruising on a famous American motorcycle.", answer: "Bob Marley riding a Harley" },
  { id: "rhyme-41", word: "Bruce Lee drinking tea", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The legendary martial arts film star is calmly sipping a hot beverage.", answer: "Bruce Lee drinking tea" },
  { id: "rhyme-42", word: "Snoop Dogg jogging in fog", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Long Beach rapper who loves gin and juice is running through misty weather.", answer: "Snoop Dogg jogging in fog" },
  { id: "rhyme-43", word: "Oprah Winfrey being thrifty", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The famous billionaire talk show host is trying to save money.", answer: "Oprah Winfrey being thrifty" },
  { id: "rhyme-44", word: "Simon Cowell throwing in the towel", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The critical X Factor and American Idol judge is finally giving up.", answer: "Simon Cowell throwing in the towel" },
  { id: "rhyme-45", word: "Tony Hawk going for a walk", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The legendary pro skateboarder is taking a casual stroll on foot.", answer: "Tony Hawk going for a walk" },
  { id: "rhyme-46", word: "Shania Twain on a train", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The 'Man! I Feel Like a Woman!' country singer is traveling by railway.", answer: "Shania Twain on a train" },
  { id: "rhyme-47", word: "Charlie Sheen turning green", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Two and a Half Men star is changing to a sickly color.", answer: "Charlie Sheen turning green" },
  { id: "rhyme-48", word: "Ice Cube in a tube", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The 'Straight Outta Compton' rapper and Friday actor is stuck inside a cylinder.", answer: "Ice Cube in a tube" },
  { id: "rhyme-49", word: "Dave Grohl in a bowl", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Foo Fighters frontman and former Nirvana drummer is sitting in a large dish.", answer: "Dave Grohl in a bowl" },
  { id: "rhyme-50", word: "Keanu Reeves in the leaves", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Matrix and John Wick star is hiding among the foliage.", answer: "Keanu Reeves in the leaves" },
  { id: "rhyme-51", word: "Halle Berry eating a cherry", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Oscar-winning Catwoman actress is enjoying a small red stone fruit.", answer: "Halle Berry eating a cherry" },
  { id: "rhyme-52", word: "Jamie Foxx in a box", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Oscar-winning Ray actor and Django star is trapped inside a cardboard container.", answer: "Jamie Foxx in a box" },
  { id: "rhyme-53", word: "A gorilla eating a tortilla", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "A massive great ape from the jungle is enjoying a flat, round Mexican bread.", answer: "A gorilla eating a tortilla" },
  { id: "rhyme-54", word: "Cinderella with an umbrella", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Disney princess who lost her glass slipper at midnight is carrying rain protection.", answer: "Cinderella with an umbrella" },
  { id: "rhyme-55", word: "Sylvester Stallone all alone", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Rocky and Rambo action star is completely by himself with no one around.", answer: "Sylvester Stallone all alone" },
  { id: "rhyme-56", word: "Al Pacino at the casino", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Scarface and Godfather actor is gambling at a gaming establishment in Las Vegas.", answer: "Al Pacino at the casino" },
  { id: "rhyme-57", word: "Robert De Niro being a hero", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Taxi Driver and Goodfellas actor is bravely saving the day.", answer: "Robert De Niro being a hero" },
  { id: "rhyme-58", word: "Quentin Tarantino ordering a cappuccino", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Pulp Fiction and Kill Bill director is ordering a frothy Italian espresso drink at a café.", answer: "Quentin Tarantino ordering a cappuccino" },
  { id: "rhyme-59", word: "Leonardo DiCaprio eating Cheerios", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Titanic and Inception star is eating round oat breakfast cereal.", answer: "Leonardo DiCaprio eating Cheerios" },
  { id: "rhyme-60", word: "Doja Cat wearing a hat", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The 'Say So' and 'Kiss Me More' singer with the feline-inspired name is sporting some stylish headwear.", answer: "Doja Cat wearing a hat" },

  // NEW RHYMES - EASY (15 more animal/object rhymes)
  { id: "rhyme-61", word: "A pig wearing a wig", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A pink farm animal known for oinking is sporting some fake hair on its head.", answer: "A pig wearing a wig" },
  { id: "rhyme-62", word: "A duck in a truck", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A quacking waterfowl is sitting in the driver's seat of a pickup vehicle.", answer: "A duck in a truck" },
  { id: "rhyme-63", word: "A llama in pajamas", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A South American camel-like animal with fluffy fur is wearing sleepwear.", answer: "A llama in pajamas" },
  { id: "rhyme-64", word: "A panda eating a banana", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A black and white bear from China is munching on a yellow fruit.", answer: "A panda eating a banana" },
  { id: "rhyme-65", word: "A goat in a boat", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A bearded farm animal is sailing on water in a small vessel.", answer: "A goat in a boat" },
  { id: "rhyme-66", word: "A skunk in a trunk", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A black and white smelly animal is hiding in the back of a car.", answer: "A skunk in a trunk" },
  { id: "rhyme-67", word: "A cat that is fat", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A meowing feline has been eating too many treats and is very chubby.", answer: "A cat that is fat" },
  { id: "rhyme-68", word: "A clown going down", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A circus performer with a red nose is sliding downward on something.", answer: "A clown going down" },
  { id: "rhyme-69", word: "A knight in the night", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A medieval warrior in armor is out after the sun has set.", answer: "A knight in the night" },
  { id: "rhyme-70", word: "A brain on a train", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "The thinking organ from inside a head is traveling on railway tracks.", answer: "A brain on a train" },
  { id: "rhyme-71", word: "A king with a ring", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A royal male ruler wearing a crown is showing off jewelry on his finger.", answer: "A king with a ring" },
  { id: "rhyme-72", word: "A chair in the air", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A piece of furniture you sit on is floating up in the sky.", answer: "A chair in the air" },
  { id: "rhyme-73", word: "A cook reading a book", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "Someone who prepares food in a kitchen is studying pages of text.", answer: "A cook reading a book" },
  { id: "rhyme-74", word: "A ghost eating toast", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A spooky transparent spirit is enjoying some crispy brown bread.", answer: "A ghost eating toast" },
  { id: "rhyme-75", word: "A cow saying wow", forbidden: [], points: 10, color: "yellow", difficulty: "easy", clue: "A mooing farm animal that gives milk is expressing amazement.", answer: "A cow saying wow" },

  // NEW RHYMES - MEDIUM (15 more celebrity rhymes)
  { id: "rhyme-76", word: "Beyoncé at the café", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Single Ladies' superstar is enjoying coffee at a small restaurant.", answer: "Beyoncé at the café" },
  { id: "rhyme-77", word: "Rihanna eating a banana", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Barbadian 'Umbrella' singer is snacking on a yellow tropical fruit.", answer: "Rihanna eating a banana" },
  { id: "rhyme-78", word: "Ariana Grande playing an oboe", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Thank U, Next' ponytail queen is performing on a woodwind instrument.", answer: "Ariana Grande in a grande" },
  { id: "rhyme-79", word: "Chris Pratt with a hat", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Guardians of the Galaxy and Jurassic World star is wearing headwear.", answer: "Chris Pratt with a hat" },
  { id: "rhyme-80", word: "Lady Gaga doing yoga", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Bad Romance' eccentric pop star is stretching in meditation poses.", answer: "Lady Gaga doing yoga" },
  { id: "rhyme-81", word: "Lil Nas X sending texts", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Old Town Road' rapper is messaging people on his phone.", answer: "Lil Nas X sending texts" },
  { id: "rhyme-82", word: "Harry Styles with the smiles", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The former One Direction member known for 'Watermelon Sugar' is grinning.", answer: "Harry Styles with the smiles" },
  { id: "rhyme-83", word: "Snoop Dogg on a log", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Long Beach rapper who loves the West Coast is sitting on a tree trunk.", answer: "Snoop Dogg on a log" },
  { id: "rhyme-84", word: "Will Smith eating chips", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Fresh Prince of Bel-Air and Men in Black star is snacking on fried potato slices.", answer: "Will Smith eating chips" },
  { id: "rhyme-85", word: "Kendrick Lamar in a car", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Pulitzer Prize-winning Compton rapper is riding in a vehicle.", answer: "Kendrick Lamar in a car" },
  { id: "rhyme-86", word: "Miley Cyrus behind us", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Wrecking Ball' singer who was once Hannah Montana is standing at our backs.", answer: "Miley Cyrus behind us" },
  { id: "rhyme-87", word: "Elon Musk at dusk", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Tesla and SpaceX billionaire is outside as the sun sets.", answer: "Elon Musk at dusk" },
  { id: "rhyme-88", word: "Kim K drinking tea", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The famous Kardashian reality TV star is sipping a hot beverage.", answer: "Kim K drinking tea" },
  { id: "rhyme-89", word: "Selena Gomez collecting stamps", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The 'Wolves' singer and former Disney star has a hobby of gathering postal stickers.", answer: "Selena Gomez collects" },
  { id: "rhyme-90", word: "Mark Wahlberg in Johannesburg", forbidden: [], points: 20, color: "blue", difficulty: "medium", clue: "The Transformers and Ted actor is visiting a major South African city.", answer: "Mark Wahlberg in Johannesburg" },

  // NEW RHYMES - HARD (10 more challenging rhymes)
  { id: "rhyme-91", word: "Morgan Freeman being a demon", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The iconic Shawshank Redemption narrator with the famous voice is playing an evil spirit.", answer: "Morgan Freeman being a demon" },
  { id: "rhyme-92", word: "Jackie Chan with a pan", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The legendary martial arts actor from Rush Hour is holding a cooking utensil.", answer: "Jackie Chan with a pan" },
  { id: "rhyme-93", word: "Mike Tyson with a bison", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The heavyweight boxing champion with the face tattoo is standing next to a large buffalo.", answer: "Mike Tyson with a bison" },
  { id: "rhyme-94", word: "Nicolas Cage in a cage", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The National Treasure and Con Air actor is trapped behind bars.", answer: "Nicolas Cage in a cage" },
  { id: "rhyme-95", word: "Steve Harvey on a safari", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Family Feud host with the famous mustache is on an African wildlife tour.", answer: "Steve Harvey on a safari" },
  { id: "rhyme-96", word: "Nicki Minaj in a mirage", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The 'Super Bass' rapper appears as an illusion in the desert.", answer: "Nicki Minaj in a mirage" },
  { id: "rhyme-97", word: "Matthew McConaughey in the hay", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The 'Alright alright alright' actor is lying in dried grass on a farm.", answer: "Matthew McConaughey in the hay" },
  { id: "rhyme-98", word: "Samuel L. Jackson doing the action", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Pulp Fiction star who says 'motherf***er' a lot is performing stunts.", answer: "Samuel L. Jackson doing the action" },
  { id: "rhyme-99", word: "Scarlett Johansson doing a cannon", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Black Widow actress is being shot out of a circus launcher.", answer: "Scarlett Johansson doing a cannon" },
  { id: "rhyme-100", word: "Zendaya on the highway", forbidden: [], points: 30, color: "green", difficulty: "hard", clue: "The Euphoria and Spider-Man actress is walking along a major road.", answer: "Zendaya on the highway" },
];

// ============================================================================
// DECK REGISTRY - All available decks
// ============================================================================
export const DECK_REGISTRY: Record<string, Deck> = {
  classic: {
    info: {
      id: "classic",
      name: "Classic",
      description: "The original word collection with everyday objects, animals, and concepts",
      icon: "Zap",
      cardCount: CLASSIC_CARDS.length,
      accentColor: "#ff006e",
      deckType: "forbidden",
    },
    cards: CLASSIC_CARDS,
  },
  randomRhymes: {
    info: {
      id: "randomRhymes",
      name: "Random Rhymes",
      description: "Read the clue, guess the rhyming phrase! From 'Drake eating a steak' to 'A moose drinking juice'",
      icon: "Music",
      cardCount: RANDOM_RHYMES_CARDS.length,
      accentColor: "#8338ec",
      deckType: "rhymes",
    },
    cards: RANDOM_RHYMES_CARDS,
  },
};

// Helper functions
export function getDeck(deckId: string): Deck | undefined {
  return DECK_REGISTRY[deckId];
}

export function getAvailableDecks(): DeckInfo[] {
  return Object.values(DECK_REGISTRY).map(deck => deck.info);
}

export function getDeckCards(deckId: string): Card[] {
  const deck = DECK_REGISTRY[deckId];
  return deck ? deck.cards : CLASSIC_CARDS;
}

// Get cards filtered by difficulty
export function getDeckCardsByDifficulty(deckId: string, difficulty: "easy" | "medium" | "hard" | "random"): Card[] {
  const deck = DECK_REGISTRY[deckId];
  if (!deck) return CLASSIC_CARDS;

  if (difficulty === "random") {
    return deck.cards; // Return all cards
  }

  return deck.cards.filter(card => card.difficulty === difficulty);
}

// Legacy export for backward compatibility
export const DYNAMIC_CARDS = CLASSIC_CARDS;
