export const FORBIDDEN_COLOR_WORDS = [
  "red", "orange", "yellow", "green", "blue", "purple", "pink", "brown",
  "black", "white", "gray", "grey", "cyan", "magenta", "lime", "violet",
  "indigo", "turquoise", "crimson", "scarlet", "maroon", "navy", "teal",
  "olive", "silver", "gold", "beige", "tan", "khaki", "coral", "salmon",
  "peach", "lavender", "mauve", "fuchsia", "burgundy", "rust", "amber"
];

export const CLUE_WORD_POOL = [
  "apple", "banana", "cherry", "grape", "lemon", "lime", "orange", "peach",
  "strawberry", "watermelon", "blueberry", "raspberry", "kiwi", "mango", "papaya",
  "avocado", "coconut", "pineapple", "melon", "plum",
  
  "ocean", "sky", "grass", "forest", "desert", "mountain", "river", "lake",
  "sunset", "sunrise", "midnight", "noon", "twilight", "dawn", "dusk",
  "storm", "rainbow", "lightning", "thunder", "frost",
  
  "fire", "ice", "water", "earth", "wind", "stone", "metal", "wood",
  "glass", "crystal", "diamond", "ruby", "emerald", "sapphire", "topaz",
  
  "happy", "sad", "angry", "calm", "excited", "nervous", "peaceful", "energetic",
  "dreamy", "bold", "gentle", "fierce", "soft", "harsh", "warm", "cool",
  "bright", "dark", "light", "heavy", "smooth", "rough",
  
  "cat", "dog", "bird", "fish", "lion", "tiger", "bear", "wolf",
  "elephant", "dolphin", "whale", "eagle", "hawk", "owl", "raven",
  "butterfly", "bee", "spider", "snake", "frog",
  
  "rose", "daisy", "tulip", "sunflower", "lily", "orchid", "poppy",
  "lavender", "jasmine", "hibiscus", "dandelion", "clover", "fern", "moss",
  
  "candy", "chocolate", "vanilla", "caramel", "mint", "cinnamon", "honey",
  "sugar", "spice", "pepper", "salt", "butter", "cream", "milk", "coffee",
  
  "jazz", "rock", "pop", "blues", "classical", "techno", "disco", "funk",
  "melody", "rhythm", "harmony", "symphony", "ballad", "anthem",
  
  "summer", "winter", "spring", "autumn", "sunny", "cloudy", "rainy", "snowy",
  "windy", "foggy", "humid", "dry", "hot", "cold", "mild", "fresh",
  
  "silk", "velvet", "cotton", "wool", "leather", "denim", "satin", "linen",
  
  "neon", "pastel", "metallic", "glossy", "matte", "sparkle", "shimmer", "glow",
  "vibrant", "muted", "faded", "saturated", "pale", "deep", "rich", "dull",
  
  "electric", "cosmic", "tropical", "arctic", "volcanic", "lunar", "solar",
  "stellar", "nebula", "galaxy", "planet", "comet", "meteor",
  
  "jazz", "royal", "vintage", "modern", "rustic", "urban", "wild", "tame",
  "exotic", "common", "rare", "unique", "classic", "trendy", "retro", "futuristic",
  
  "whisper", "shout", "sing", "dance", "run", "walk", "jump", "fly",
  "swim", "climb", "crawl", "march", "skip", "bounce", "glide", "float",
  
  "dream", "nightmare", "fantasy", "reality", "magic", "science", "art", "nature",
  "culture", "tradition", "innovation", "revolution", "evolution", "mystery", "adventure",
  
  "feast", "famine", "party", "funeral", "wedding", "birthday", "celebration", "ceremony",
  "festival", "carnival", "parade", "concert", "show", "performance", "exhibition",
  
  "book", "pen", "paper", "ink", "paint", "brush", "canvas", "sculpture",
  "photograph", "film", "music", "dance", "theater", "poetry", "prose", "verse",
  
  "sword", "shield", "arrow", "bow", "spear", "axe", "hammer", "blade",
  
  "castle", "tower", "bridge", "wall", "gate", "door", "window", "roof",
  "floor", "ceiling", "pillar", "arch", "dome", "spire", "turret",
  
  "crown", "throne", "scepter", "jewel", "treasure", "coin", "medal", "trophy",
  
  "dragon", "phoenix", "unicorn", "griffin", "mermaid", "fairy", "goblin", "elf",
  "dwarf", "giant", "troll", "ogre", "wizard", "witch", "knight", "prince"
];

export function validateClue(clue: string, type: "first" | "second"): boolean {
  const words = clue.trim().toLowerCase().split(/\s+/);
  
  if (type === "first" && words.length !== 1) {
    return false;
  }
  
  if (type === "second" && (words.length < 2 || words.length > 3)) {
    return false;
  }
  
  for (const word of words) {
    if (FORBIDDEN_COLOR_WORDS.includes(word)) {
      return false;
    }
  }
  
  return true;
}

export function suggestClueWords(count: number = 10): string[] {
  const shuffled = [...CLUE_WORD_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}