// Quiz Quarter - Question Packs & Decks Data
import { Question, DeckInfo, PackInfo, Deck, Pack } from "./types";

// =============================================================================
// PACK DEFINITIONS
// =============================================================================

export const PACKS: PackInfo[] = [
    {
        id: "geography",
        name: "Geography Pack",
        description: "Explore the world through capitals, flags, countries, and languages",
        icon: "Globe",
        accentColor: "#22C55E",
        deckIds: ["capitals", "flags", "countries", "languages"],
        price: 2.99,
    },
    {
        id: "history",
        name: "History Pack",
        description: "Journey through time with dates, figures, events, and locations",
        icon: "Landmark",
        accentColor: "#F59E0B",
        deckIds: ["dates", "famous-figures", "events", "locations"],
        price: 2.99,
    },
    {
        id: "sports",
        name: "Sports Pack",
        description: "Test your knowledge of athletes, terms, and sporting events",
        icon: "Trophy",
        accentColor: "#EF4444",
        deckIds: ["athletes", "sports-terms", "sports-events"],
        price: 2.99,
    },
    {
        id: "music",
        name: "Music Pack",
        description: "From artists to lyrics, awards to album titles",
        icon: "Music",
        accentColor: "#A855F7",
        deckIds: ["artists", "lyrics", "awards", "titles"],
        price: 2.99,
    },
];

// =============================================================================
// DECK DEFINITIONS
// =============================================================================

export const DECKS: DeckInfo[] = [
    // Geography Pack
    { id: "capitals", name: "Capitals", description: "World capital cities", icon: "Building2", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "flags", name: "Flags", description: "Identify country flags", icon: "Flag", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "countries", name: "Countries", description: "Country facts & trivia", icon: "MapPin", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "languages", name: "Languages", description: "Languages of the world", icon: "Languages", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // History Pack
    { id: "dates", name: "Dates", description: "Key historical dates", icon: "Calendar", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "famous-figures", name: "Famous Figures", description: "Historical personalities", icon: "User", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "events", name: "Events", description: "Major historical events", icon: "Scroll", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "locations", name: "Locations", description: "Historic places", icon: "Castle", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // Sports Pack
    { id: "athletes", name: "Athletes", description: "Famous sports stars", icon: "Medal", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "sports-terms", name: "Sports Terms", description: "Sport-specific jargon", icon: "Dumbbell", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "sports-events", name: "Sports Events", description: "Olympics, World Cups & more", icon: "Flame", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // Music Pack
    { id: "artists", name: "Artists", description: "Musicians & bands", icon: "Mic2", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "lyrics", name: "Lyrics", description: "Name that song", icon: "Quote", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "awards", name: "Awards", description: "Grammys & music awards", icon: "Award", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "titles", name: "Titles", description: "Songs & album names", icon: "Disc3", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
];

// =============================================================================
// QUESTIONS - GEOGRAPHY PACK
// =============================================================================

const CAPITALS_QUESTIONS: Question[] = [
    // EASY
    { id: "cap-1", question: "What is the capital of France?", correctAnswer: "Paris", incorrectAnswers: ["Lyon", "Marseille", "Nice"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-2", question: "What is the capital of Japan?", correctAnswer: "Tokyo", incorrectAnswers: ["Osaka", "Kyoto", "Hiroshima"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-3", question: "What is the capital of the United Kingdom?", correctAnswer: "London", incorrectAnswers: ["Manchester", "Birmingham", "Edinburgh"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-4", question: "What is the capital of Germany?", correctAnswer: "Berlin", incorrectAnswers: ["Munich", "Frankfurt", "Hamburg"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-5", question: "What is the capital of Italy?", correctAnswer: "Rome", incorrectAnswers: ["Milan", "Venice", "Florence"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-6", question: "What is the capital of Spain?", correctAnswer: "Madrid", incorrectAnswers: ["Barcelona", "Seville", "Valencia"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-7", question: "What is the capital of China?", correctAnswer: "Beijing", incorrectAnswers: ["Shanghai", "Hong Kong", "Shenzhen"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-8", question: "What is the capital of Australia?", correctAnswer: "Canberra", incorrectAnswers: ["Sydney", "Melbourne", "Brisbane"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-9", question: "What is the capital of Canada?", correctAnswer: "Ottawa", incorrectAnswers: ["Toronto", "Vancouver", "Montreal"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-10", question: "What is the capital of Brazil?", correctAnswer: "Brasília", incorrectAnswers: ["Rio de Janeiro", "São Paulo", "Salvador"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-11", question: "What is the capital of Russia?", correctAnswer: "Moscow", incorrectAnswers: ["St. Petersburg", "Novosibirsk", "Kazan"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-12", question: "What is the capital of India?", correctAnswer: "New Delhi", incorrectAnswers: ["Mumbai", "Bangalore", "Kolkata"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-13", question: "What is the capital of the United States?", correctAnswer: "Washington, D.C.", incorrectAnswers: ["New York City", "Los Angeles", "Chicago"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-14", question: "What is the capital of Mexico?", correctAnswer: "Mexico City", incorrectAnswers: ["Guadalajara", "Cancún", "Monterrey"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-15", question: "What is the capital of South Korea?", correctAnswer: "Seoul", incorrectAnswers: ["Busan", "Incheon", "Daegu"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-16", question: "What is the capital of Egypt?", correctAnswer: "Cairo", incorrectAnswers: ["Alexandria", "Giza", "Luxor"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-17", question: "What is the capital of Greece?", correctAnswer: "Athens", incorrectAnswers: ["Thessaloniki", "Patras", "Heraklion"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-18", question: "What is the capital of Poland?", correctAnswer: "Warsaw", incorrectAnswers: ["Krakow", "Gdansk", "Poznan"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-19", question: "What is the capital of Sweden?", correctAnswer: "Stockholm", incorrectAnswers: ["Gothenburg", "Malmö", "Uppsala"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    { id: "cap-20", question: "What is the capital of Norway?", correctAnswer: "Oslo", incorrectAnswers: ["Bergen", "Trondheim", "Stavanger"], difficulty: "easy", deckId: "capitals", packId: "geography" },
    // MEDIUM
    { id: "cap-21", question: "What is the capital of Thailand?", correctAnswer: "Bangkok", incorrectAnswers: ["Chiang Mai", "Phuket", "Pattaya"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-22", question: "What is the capital of Turkey?", correctAnswer: "Ankara", incorrectAnswers: ["Istanbul", "Izmir", "Antalya"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-23", question: "What is the capital of South Africa?", correctAnswer: "Pretoria", incorrectAnswers: ["Cape Town", "Johannesburg", "Durban"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-24", question: "What is the capital of Switzerland?", correctAnswer: "Bern", incorrectAnswers: ["Zurich", "Geneva", "Basel"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-25", question: "What is the capital of Morocco?", correctAnswer: "Rabat", incorrectAnswers: ["Casablanca", "Marrakech", "Fes"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-26", question: "What is the capital of Vietnam?", correctAnswer: "Hanoi", incorrectAnswers: ["Ho Chi Minh City", "Da Nang", "Nha Trang"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-27", question: "What is the capital of New Zealand?", correctAnswer: "Wellington", incorrectAnswers: ["Auckland", "Christchurch", "Queenstown"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-28", question: "What is the capital of the Philippines?", correctAnswer: "Manila", incorrectAnswers: ["Cebu", "Davao", "Quezon City"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-29", question: "What is the capital of Argentina?", correctAnswer: "Buenos Aires", incorrectAnswers: ["Córdoba", "Rosario", "Mendoza"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-30", question: "What is the capital of Portugal?", correctAnswer: "Lisbon", incorrectAnswers: ["Porto", "Braga", "Coimbra"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-31", question: "What is the capital of Austria?", correctAnswer: "Vienna", incorrectAnswers: ["Salzburg", "Innsbruck", "Graz"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-32", question: "What is the capital of Belgium?", correctAnswer: "Brussels", incorrectAnswers: ["Antwerp", "Ghent", "Bruges"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-33", question: "What is the capital of Finland?", correctAnswer: "Helsinki", incorrectAnswers: ["Turku", "Tampere", "Espoo"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-34", question: "What is the capital of Ireland?", correctAnswer: "Dublin", incorrectAnswers: ["Cork", "Galway", "Limerick"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-35", question: "What is the capital of Czech Republic?", correctAnswer: "Prague", incorrectAnswers: ["Brno", "Ostrava", "Plzeň"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-36", question: "What is the capital of Hungary?", correctAnswer: "Budapest", incorrectAnswers: ["Debrecen", "Szeged", "Pécs"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-37", question: "What is the capital of Denmark?", correctAnswer: "Copenhagen", incorrectAnswers: ["Aarhus", "Odense", "Aalborg"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-38", question: "What is the capital of Israel?", correctAnswer: "Jerusalem", incorrectAnswers: ["Tel Aviv", "Haifa", "Eilat"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-39", question: "What is the capital of Ukraine?", correctAnswer: "Kyiv", incorrectAnswers: ["Odessa", "Kharkiv", "Lviv"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    { id: "cap-40", question: "What is the capital of Indonesia?", correctAnswer: "Jakarta", incorrectAnswers: ["Bali", "Surabaya", "Bandung"], difficulty: "medium", deckId: "capitals", packId: "geography" },
    // HARD
    { id: "cap-41", question: "What is the capital of Myanmar?", correctAnswer: "Naypyidaw", incorrectAnswers: ["Yangon", "Mandalay", "Bago"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-42", question: "What is the capital of Sri Lanka?", correctAnswer: "Sri Jayawardenepura Kotte", incorrectAnswers: ["Colombo", "Kandy", "Galle"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-43", question: "What is the capital of Kazakhstan?", correctAnswer: "Astana", incorrectAnswers: ["Almaty", "Shymkent", "Karaganda"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-44", question: "What is the capital of Mongolia?", correctAnswer: "Ulaanbaatar", incorrectAnswers: ["Erdenet", "Darkhan", "Choibalsan"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-45", question: "What is the capital of Bhutan?", correctAnswer: "Thimphu", incorrectAnswers: ["Paro", "Punakha", "Phuentsholing"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-46", question: "What is the capital of Nepal?", correctAnswer: "Kathmandu", incorrectAnswers: ["Pokhara", "Lalitpur", "Bhaktapur"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-47", question: "What is the capital of Laos?", correctAnswer: "Vientiane", incorrectAnswers: ["Luang Prabang", "Savannakhet", "Pakse"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-48", question: "What is the capital of Cambodia?", correctAnswer: "Phnom Penh", incorrectAnswers: ["Siem Reap", "Battambang", "Sihanoukville"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-49", question: "What is the capital of Bolivia?", correctAnswer: "Sucre", incorrectAnswers: ["La Paz", "Santa Cruz", "Cochabamba"], difficulty: "hard", deckId: "capitals", packId: "geography" },
    { id: "cap-50", question: "What is the capital of Moldova?", correctAnswer: "Chișinău", incorrectAnswers: ["Tiraspol", "Bălți", "Bender"], difficulty: "hard", deckId: "capitals", packId: "geography" },
];

const FLAGS_QUESTIONS: Question[] = [
    // EASY
    { id: "flag-1", question: "Which country has a flag with red and white horizontal stripes and a blue canton with stars?", correctAnswer: "United States", incorrectAnswers: ["Australia", "United Kingdom", "New Zealand"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-2", question: "Which country's flag is red with a maple leaf?", correctAnswer: "Canada", incorrectAnswers: ["Japan", "Switzerland", "Austria"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-3", question: "Which country has a flag with a red circle on a white background?", correctAnswer: "Japan", incorrectAnswers: ["Bangladesh", "Greenland", "Laos"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-4", question: "Which country's flag features the Union Jack in the corner with stars?", correctAnswer: "Australia", incorrectAnswers: ["New Zealand", "Fiji", "Tuvalu"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-5", question: "Which country has horizontal black, red, and yellow stripes?", correctAnswer: "Germany", incorrectAnswers: ["Belgium", "Uganda", "Lithuania"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-6", question: "Which country's flag is blue, white, and red vertical stripes?", correctAnswer: "France", incorrectAnswers: ["Netherlands", "Russia", "Luxembourg"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-7", question: "Which country has green, white, and red vertical stripes?", correctAnswer: "Italy", incorrectAnswers: ["Ireland", "Mexico", "Hungary"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-8", question: "Which country has a white cross on a red background?", correctAnswer: "Switzerland", incorrectAnswers: ["Denmark", "England", "Georgia"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-9", question: "Which country's flag is green with a yellow diamond and blue globe?", correctAnswer: "Brazil", incorrectAnswers: ["Portugal", "Mozambique", "Bolivia"], difficulty: "easy", deckId: "flags", packId: "geography" },
    { id: "flag-10", question: "Which country has a dragon on its flag?", correctAnswer: "Wales", incorrectAnswers: ["Bhutan", "Malta", "Sri Lanka"], difficulty: "easy", deckId: "flags", packId: "geography" },
    // MEDIUM
    { id: "flag-11", question: "Which Nordic country has a blue cross on red background?", correctAnswer: "Norway", incorrectAnswers: ["Sweden", "Denmark", "Iceland"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-12", question: "Which country has an eagle eating a snake on a cactus?", correctAnswer: "Mexico", incorrectAnswers: ["Albania", "Kazakhstan", "Egypt"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-13", question: "Which country's flag has a red background with yellow stars?", correctAnswer: "China", incorrectAnswers: ["Vietnam", "Morocco", "Turkey"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-14", question: "Which country has a crescent moon and star on red?", correctAnswer: "Turkey", incorrectAnswers: ["Pakistan", "Tunisia", "Algeria"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-15", question: "Which country's flag is orange, white, and green with a wheel?", correctAnswer: "India", incorrectAnswers: ["Ireland", "Niger", "Ivory Coast"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-16", question: "Which country has a double-headed eagle on red?", correctAnswer: "Albania", incorrectAnswers: ["Montenegro", "Serbia", "Russia"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-17", question: "Which African country has green, yellow, red horizontal stripes?", correctAnswer: "Ethiopia", incorrectAnswers: ["Ghana", "Mali", "Senegal"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-18", question: "Which country's flag features a cedar tree?", correctAnswer: "Lebanon", incorrectAnswers: ["Cyprus", "Norfolk Island", "Guatemala"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-19", question: "Which country has a flag with only two colors: red and white checkered?", correctAnswer: "Croatia", incorrectAnswers: ["Poland", "Monaco", "Indonesia"], difficulty: "medium", deckId: "flags", packId: "geography" },
    { id: "flag-20", question: "Which country's flag has a six-pointed star?", correctAnswer: "Israel", incorrectAnswers: ["Morocco", "Ethiopia", "Jordan"], difficulty: "medium", deckId: "flags", packId: "geography" },
    // HARD
    { id: "flag-21", question: "Which country has a thunder dragon on its flag?", correctAnswer: "Bhutan", incorrectAnswers: ["Wales", "Malta", "Sri Lanka"], difficulty: "hard", deckId: "flags", packId: "geography" },
    { id: "flag-22", question: "Which is the only country with a non-rectangular flag?", correctAnswer: "Nepal", incorrectAnswers: ["Switzerland", "Vatican City", "Bhutan"], difficulty: "hard", deckId: "flags", packId: "geography" },
    { id: "flag-23", question: "Which country has an AK-47 on its flag?", correctAnswer: "Mozambique", incorrectAnswers: ["Afghanistan", "Angola", "Eritrea"], difficulty: "hard", deckId: "flags", packId: "geography" },
    { id: "flag-24", question: "Which country's flag has a bird of paradise?", correctAnswer: "Papua New Guinea", incorrectAnswers: ["Dominica", "Uganda", "Zimbabwe"], difficulty: "hard", deckId: "flags", packId: "geography" },
    { id: "flag-25", question: "Which country has a trisula (trident) on its flag?", correctAnswer: "Barbados", incorrectAnswers: ["Ukraine", "Nepal", "Sri Lanka"], difficulty: "hard", deckId: "flags", packId: "geography" },
];

const COUNTRIES_QUESTIONS: Question[] = [
    { id: "cou-1", question: "Which is the largest country in the world by area?", correctAnswer: "Russia", incorrectAnswers: ["Canada", "China", "United States"], difficulty: "easy", deckId: "countries", packId: "geography" },
    { id: "cou-2", question: "Which country has the most people?", correctAnswer: "India", incorrectAnswers: ["China", "United States", "Indonesia"], difficulty: "easy", deckId: "countries", packId: "geography" },
    { id: "cou-3", question: "Which is the smallest country in the world?", correctAnswer: "Vatican City", incorrectAnswers: ["Monaco", "San Marino", "Liechtenstein"], difficulty: "easy", deckId: "countries", packId: "geography" },
    { id: "cou-4", question: "Which country is known as the Land of the Rising Sun?", correctAnswer: "Japan", incorrectAnswers: ["China", "South Korea", "Thailand"], difficulty: "easy", deckId: "countries", packId: "geography" },
    { id: "cou-5", question: "How many countries are in the United Kingdom?", correctAnswer: "4", incorrectAnswers: ["2", "3", "5"], difficulty: "easy", deckId: "countries", packId: "geography" },
    { id: "cou-6", question: "Which continent has the most countries?", correctAnswer: "Africa", incorrectAnswers: ["Europe", "Asia", "South America"], difficulty: "medium", deckId: "countries", packId: "geography" },
    { id: "cou-7", question: "Which country has the longest coastline?", correctAnswer: "Canada", incorrectAnswers: ["Russia", "Indonesia", "Australia"], difficulty: "medium", deckId: "countries", packId: "geography" },
    { id: "cou-8", question: "Which two countries share the longest international border?", correctAnswer: "Canada and USA", incorrectAnswers: ["Russia and China", "Brazil and Argentina", "India and Bangladesh"], difficulty: "medium", deckId: "countries", packId: "geography" },
    { id: "cou-9", question: "Which landlocked country has the largest navy?", correctAnswer: "Bolivia", incorrectAnswers: ["Paraguay", "Mongolia", "Kazakhstan"], difficulty: "hard", deckId: "countries", packId: "geography" },
    { id: "cou-10", question: "Which country spans the most time zones?", correctAnswer: "France", incorrectAnswers: ["Russia", "United States", "United Kingdom"], difficulty: "hard", deckId: "countries", packId: "geography" },
];

const LANGUAGES_QUESTIONS: Question[] = [
    { id: "lang-1", question: "What is the most widely spoken language in the world by native speakers?", correctAnswer: "Mandarin Chinese", incorrectAnswers: ["English", "Spanish", "Hindi"], difficulty: "easy", deckId: "languages", packId: "geography" },
    { id: "lang-2", question: "What is the official language of Brazil?", correctAnswer: "Portuguese", incorrectAnswers: ["Spanish", "Brazilian", "English"], difficulty: "easy", deckId: "languages", packId: "geography" },
    { id: "lang-3", question: "Which language uses Cyrillic script?", correctAnswer: "Russian", incorrectAnswers: ["Greek", "Arabic", "Hebrew"], difficulty: "medium", deckId: "languages", packId: "geography" },
    { id: "lang-4", question: "What is the most spoken language in Africa?", correctAnswer: "Swahili", incorrectAnswers: ["Arabic", "French", "Hausa"], difficulty: "medium", deckId: "languages", packId: "geography" },
    { id: "lang-5", question: "Which language has the most words?", correctAnswer: "English", incorrectAnswers: ["Chinese", "Spanish", "Arabic"], difficulty: "medium", deckId: "languages", packId: "geography" },
];

// =============================================================================
// QUESTIONS - HISTORY PACK
// =============================================================================

const DATES_QUESTIONS: Question[] = [
    { id: "date-1", question: "In what year did World War II end?", correctAnswer: "1945", incorrectAnswers: ["1944", "1946", "1943"], difficulty: "easy", deckId: "dates", packId: "history" },
    { id: "date-2", question: "When did the Titanic sink?", correctAnswer: "1912", incorrectAnswers: ["1905", "1922", "1915"], difficulty: "easy", deckId: "dates", packId: "history" },
    { id: "date-3", question: "What year did the Berlin Wall fall?", correctAnswer: "1989", incorrectAnswers: ["1991", "1987", "1990"], difficulty: "easy", deckId: "dates", packId: "history" },
    { id: "date-4", question: "When did Neil Armstrong walk on the Moon?", correctAnswer: "1969", incorrectAnswers: ["1967", "1971", "1968"], difficulty: "easy", deckId: "dates", packId: "history" },
    { id: "date-5", question: "In what year did the American Civil War begin?", correctAnswer: "1861", incorrectAnswers: ["1865", "1858", "1863"], difficulty: "medium", deckId: "dates", packId: "history" },
    { id: "date-6", question: "When was the Declaration of Independence signed?", correctAnswer: "1776", incorrectAnswers: ["1774", "1778", "1781"], difficulty: "easy", deckId: "dates", packId: "history" },
    { id: "date-7", question: "What year did the French Revolution begin?", correctAnswer: "1789", incorrectAnswers: ["1776", "1792", "1799"], difficulty: "medium", deckId: "dates", packId: "history" },
    { id: "date-8", question: "When did World War I start?", correctAnswer: "1914", incorrectAnswers: ["1912", "1916", "1915"], difficulty: "easy", deckId: "dates", packId: "history" },
    { id: "date-9", question: "In what year did the Roman Empire officially fall?", correctAnswer: "476 AD", incorrectAnswers: ["410 AD", "500 AD", "395 AD"], difficulty: "hard", deckId: "dates", packId: "history" },
    { id: "date-10", question: "When was the Magna Carta signed?", correctAnswer: "1215", incorrectAnswers: ["1066", "1315", "1190"], difficulty: "hard", deckId: "dates", packId: "history" },
];

const FAMOUS_FIGURES_QUESTIONS: Question[] = [
    { id: "fig-1", question: "Who painted the Mona Lisa?", correctAnswer: "Leonardo da Vinci", incorrectAnswers: ["Michelangelo", "Raphael", "Botticelli"], difficulty: "easy", deckId: "famous-figures", packId: "history" },
    { id: "fig-2", question: "Who was the first President of the United States?", correctAnswer: "George Washington", incorrectAnswers: ["Thomas Jefferson", "John Adams", "Benjamin Franklin"], difficulty: "easy", deckId: "famous-figures", packId: "history" },
    { id: "fig-3", question: "Who discovered penicillin?", correctAnswer: "Alexander Fleming", incorrectAnswers: ["Louis Pasteur", "Marie Curie", "Robert Koch"], difficulty: "medium", deckId: "famous-figures", packId: "history" },
    { id: "fig-4", question: "Who wrote 'Romeo and Juliet'?", correctAnswer: "William Shakespeare", incorrectAnswers: ["Charles Dickens", "Jane Austen", "Geoffrey Chaucer"], difficulty: "easy", deckId: "famous-figures", packId: "history" },
    { id: "fig-5", question: "Who was the leader of the Soviet Union during WWII?", correctAnswer: "Joseph Stalin", incorrectAnswers: ["Vladimir Lenin", "Nikita Khrushchev", "Leon Trotsky"], difficulty: "medium", deckId: "famous-figures", packId: "history" },
    { id: "fig-6", question: "Who developed the theory of relativity?", correctAnswer: "Albert Einstein", incorrectAnswers: ["Isaac Newton", "Niels Bohr", "Stephen Hawking"], difficulty: "easy", deckId: "famous-figures", packId: "history" },
    { id: "fig-7", question: "Who was the Egyptian queen famous for her relationships with Caesar and Mark Antony?", correctAnswer: "Cleopatra", incorrectAnswers: ["Nefertiti", "Hatshepsut", "Isis"], difficulty: "easy", deckId: "famous-figures", packId: "history" },
    { id: "fig-8", question: "Who led India's independence movement through non-violent resistance?", correctAnswer: "Mahatma Gandhi", incorrectAnswers: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh"], difficulty: "easy", deckId: "famous-figures", packId: "history" },
    { id: "fig-9", question: "Who was the Macedonian king who created one of history's largest empires?", correctAnswer: "Alexander the Great", incorrectAnswers: ["Philip II", "Darius III", "Ptolemy I"], difficulty: "medium", deckId: "famous-figures", packId: "history" },
    { id: "fig-10", question: "Who was the first woman to win a Nobel Prize?", correctAnswer: "Marie Curie", incorrectAnswers: ["Rosalind Franklin", "Dorothy Hodgkin", "Lise Meitner"], difficulty: "medium", deckId: "famous-figures", packId: "history" },
];

const EVENTS_QUESTIONS: Question[] = [
    { id: "evt-1", question: "What event started World War I?", correctAnswer: "Assassination of Archduke Franz Ferdinand", incorrectAnswers: ["Invasion of Poland", "Sinking of the Lusitania", "Treaty of Versailles"], difficulty: "medium", deckId: "events", packId: "history" },
    { id: "evt-2", question: "What was the name of the first successful powered airplane flight?", correctAnswer: "Wright Flyer", incorrectAnswers: ["Spirit of St. Louis", "Spruce Goose", "Kitty Hawk"], difficulty: "medium", deckId: "events", packId: "history" },
    { id: "evt-3", question: "What historic event occurred on D-Day (June 6, 1944)?", correctAnswer: "Allied invasion of Normandy", incorrectAnswers: ["Battle of the Bulge", "Liberation of Paris", "V-E Day"], difficulty: "easy", deckId: "events", packId: "history" },
    { id: "evt-4", question: "What revolution began with the storming of the Bastille?", correctAnswer: "French Revolution", incorrectAnswers: ["American Revolution", "Russian Revolution", "Industrial Revolution"], difficulty: "easy", deckId: "events", packId: "history" },
    { id: "evt-5", question: "What ancient wonder was located in Alexandria, Egypt?", correctAnswer: "The Lighthouse (Pharos)", incorrectAnswers: ["The Colossus", "The Hanging Gardens", "The Great Pyramid"], difficulty: "hard", deckId: "events", packId: "history" },
];

const LOCATIONS_QUESTIONS: Question[] = [
    { id: "loc-1", question: "Where is the Colosseum located?", correctAnswer: "Rome, Italy", incorrectAnswers: ["Athens, Greece", "Paris, France", "Alexandria, Egypt"], difficulty: "easy", deckId: "locations", packId: "history" },
    { id: "loc-2", question: "Where is Machu Picchu?", correctAnswer: "Peru", incorrectAnswers: ["Mexico", "Bolivia", "Ecuador"], difficulty: "easy", deckId: "locations", packId: "history" },
    { id: "loc-3", question: "In which country is the Great Wall?", correctAnswer: "China", incorrectAnswers: ["Japan", "Mongolia", "Korea"], difficulty: "easy", deckId: "locations", packId: "history" },
    { id: "loc-4", question: "Where was the first atomic bomb dropped?", correctAnswer: "Hiroshima, Japan", incorrectAnswers: ["Nagasaki, Japan", "Tokyo, Japan", "Pearl Harbor, USA"], difficulty: "easy", deckId: "locations", packId: "history" },
    { id: "loc-5", question: "On which island did Napoleon spend his final exile?", correctAnswer: "Saint Helena", incorrectAnswers: ["Elba", "Corsica", "Sicily"], difficulty: "hard", deckId: "locations", packId: "history" },
];

// =============================================================================
// QUESTIONS - SPORTS PACK
// =============================================================================

const ATHLETES_QUESTIONS: Question[] = [
    { id: "ath-1", question: "Which basketball player is known as 'His Airness'?", correctAnswer: "Michael Jordan", incorrectAnswers: ["LeBron James", "Kobe Bryant", "Magic Johnson"], difficulty: "easy", deckId: "athletes", packId: "sports" },
    { id: "ath-2", question: "Who holds the record for most Olympic gold medals?", correctAnswer: "Michael Phelps", incorrectAnswers: ["Usain Bolt", "Carl Lewis", "Mark Spitz"], difficulty: "easy", deckId: "athletes", packId: "sports" },
    { id: "ath-3", question: "Which soccer player has won the most Ballon d'Or awards?", correctAnswer: "Lionel Messi", incorrectAnswers: ["Cristiano Ronaldo", "Pelé", "Diego Maradona"], difficulty: "easy", deckId: "athletes", packId: "sports" },
    { id: "ath-4", question: "Who is the fastest man in recorded history?", correctAnswer: "Usain Bolt", incorrectAnswers: ["Carl Lewis", "Tyson Gay", "Yohan Blake"], difficulty: "easy", deckId: "athletes", packId: "sports" },
    { id: "ath-5", question: "Which tennis player has won the most Grand Slam titles?", correctAnswer: "Novak Djokovic", incorrectAnswers: ["Roger Federer", "Rafael Nadal", "Pete Sampras"], difficulty: "medium", deckId: "athletes", packId: "sports" },
    { id: "ath-6", question: "Who was the first boxer to defeat Mike Tyson?", correctAnswer: "Buster Douglas", incorrectAnswers: ["Evander Holyfield", "Lennox Lewis", "Larry Holmes"], difficulty: "hard", deckId: "athletes", packId: "sports" },
    { id: "ath-7", question: "Which golfer has won the most major championships?", correctAnswer: "Jack Nicklaus", incorrectAnswers: ["Tiger Woods", "Arnold Palmer", "Gary Player"], difficulty: "medium", deckId: "athletes", packId: "sports" },
    { id: "ath-8", question: "Who scored the 'Hand of God' goal?", correctAnswer: "Diego Maradona", incorrectAnswers: ["Pelé", "Zinedine Zidane", "Johan Cruyff"], difficulty: "medium", deckId: "athletes", packId: "sports" },
    { id: "ath-9", question: "Which NFL quarterback has won the most Super Bowls?", correctAnswer: "Tom Brady", incorrectAnswers: ["Joe Montana", "Peyton Manning", "Terry Bradshaw"], difficulty: "easy", deckId: "athletes", packId: "sports" },
    { id: "ath-10", question: "Who is the all-time leading scorer in NBA history?", correctAnswer: "LeBron James", incorrectAnswers: ["Kareem Abdul-Jabbar", "Karl Malone", "Michael Jordan"], difficulty: "medium", deckId: "athletes", packId: "sports" },
];

const SPORTS_TERMS_QUESTIONS: Question[] = [
    { id: "term-1", question: "In golf, what is one stroke under par called?", correctAnswer: "Birdie", incorrectAnswers: ["Eagle", "Bogey", "Albatross"], difficulty: "easy", deckId: "sports-terms", packId: "sports" },
    { id: "term-2", question: "What is a 'hat trick' in hockey?", correctAnswer: "3 goals by one player in a game", incorrectAnswers: ["3 assists in a game", "3 consecutive wins", "Scoring the winning goal"], difficulty: "easy", deckId: "sports-terms", packId: "sports" },
    { id: "term-3", question: "In cricket, what is a 'duck'?", correctAnswer: "Being out without scoring", incorrectAnswers: ["Hitting a six", "A bouncer ball", "A maiden over"], difficulty: "medium", deckId: "sports-terms", packId: "sports" },
    { id: "term-4", question: "What is an 'ace' in tennis?", correctAnswer: "A serve the opponent cannot touch", incorrectAnswers: ["Winning a set 6-0", "A perfect backhand", "Four straight points"], difficulty: "easy", deckId: "sports-terms", packId: "sports" },
    { id: "term-5", question: "In bowling, what is a 'turkey'?", correctAnswer: "Three strikes in a row", incorrectAnswers: ["Knocking down all pins on second throw", "Scoring exactly 100 points", "Getting a spare after a gutter ball"], difficulty: "medium", deckId: "sports-terms", packId: "sports" },
];

const SPORTS_EVENTS_QUESTIONS: Question[] = [
    { id: "sevt-1", question: "How often are the Summer Olympic Games held?", correctAnswer: "Every 4 years", incorrectAnswers: ["Every 2 years", "Every 3 years", "Every 5 years"], difficulty: "easy", deckId: "sports-events", packId: "sports" },
    { id: "sevt-2", question: "Which country has won the most FIFA World Cups?", correctAnswer: "Brazil", incorrectAnswers: ["Germany", "Italy", "Argentina"], difficulty: "easy", deckId: "sports-events", packId: "sports" },
    { id: "sevt-3", question: "Where were the first modern Olympic Games held?", correctAnswer: "Athens, Greece", incorrectAnswers: ["Paris, France", "London, England", "Rome, Italy"], difficulty: "medium", deckId: "sports-events", packId: "sports" },
    { id: "sevt-4", question: "What is the oldest tennis tournament in the world?", correctAnswer: "Wimbledon", incorrectAnswers: ["US Open", "French Open", "Australian Open"], difficulty: "easy", deckId: "sports-events", packId: "sports" },
    { id: "sevt-5", question: "Which city hosted the 2012 Summer Olympics?", correctAnswer: "London", incorrectAnswers: ["Beijing", "Rio de Janeiro", "Sydney"], difficulty: "easy", deckId: "sports-events", packId: "sports" },
];

// =============================================================================
// QUESTIONS - MUSIC PACK
// =============================================================================

const ARTISTS_QUESTIONS: Question[] = [
    { id: "art-1", question: "Who is known as the 'King of Pop'?", correctAnswer: "Michael Jackson", incorrectAnswers: ["Elvis Presley", "Prince", "Justin Timberlake"], difficulty: "easy", deckId: "artists", packId: "music" },
    { id: "art-2", question: "Which band performed 'Bohemian Rhapsody'?", correctAnswer: "Queen", incorrectAnswers: ["The Beatles", "Led Zeppelin", "Pink Floyd"], difficulty: "easy", deckId: "artists", packId: "music" },
    { id: "art-3", question: "Who is the lead singer of U2?", correctAnswer: "Bono", incorrectAnswers: ["Sting", "Chris Martin", "Mick Jagger"], difficulty: "medium", deckId: "artists", packId: "music" },
    { id: "art-4", question: "Which artist released the album 'Thriller'?", correctAnswer: "Michael Jackson", incorrectAnswers: ["Prince", "Madonna", "Whitney Houston"], difficulty: "easy", deckId: "artists", packId: "music" },
    { id: "art-5", question: "Who was the lead singer of Nirvana?", correctAnswer: "Kurt Cobain", incorrectAnswers: ["Eddie Vedder", "Chris Cornell", "Layne Staley"], difficulty: "medium", deckId: "artists", packId: "music" },
    { id: "art-6", question: "Which British artist has had the most #1 hits in the UK?", correctAnswer: "Elvis Presley", incorrectAnswers: ["The Beatles", "Cliff Richard", "Ed Sheeran"], difficulty: "hard", deckId: "artists", packId: "music" },
    { id: "art-7", question: "Who is known as the 'Queen of Soul'?", correctAnswer: "Aretha Franklin", incorrectAnswers: ["Diana Ross", "Whitney Houston", "Tina Turner"], difficulty: "medium", deckId: "artists", packId: "music" },
    { id: "art-8", question: "Which rapper released 'The Marshall Mathers LP'?", correctAnswer: "Eminem", incorrectAnswers: ["Jay-Z", "Nas", "50 Cent"], difficulty: "easy", deckId: "artists", packId: "music" },
    { id: "art-9", question: "Who is Beyoncé's sister who is also a singer?", correctAnswer: "Solange", incorrectAnswers: ["Kelly Rowland", "Michelle Williams", "Normani"], difficulty: "medium", deckId: "artists", packId: "music" },
    { id: "art-10", question: "Which band has members named Mick Jagger and Keith Richards?", correctAnswer: "The Rolling Stones", incorrectAnswers: ["The Who", "The Kinks", "Led Zeppelin"], difficulty: "easy", deckId: "artists", packId: "music" },
];

const LYRICS_QUESTIONS: Question[] = [
    { id: "lyr-1", question: "Complete the lyric: 'Is this the real life? Is this just ___?'", correctAnswer: "Fantasy", incorrectAnswers: ["A dream", "Imagination", "Reality"], difficulty: "easy", deckId: "lyrics", packId: "music" },
    { id: "lyr-2", question: "'Don't stop believin', hold on to the ___'", correctAnswer: "Feeling", incorrectAnswers: ["Dream", "Moment", "Night"], difficulty: "easy", deckId: "lyrics", packId: "music" },
    { id: "lyr-3", question: "'I've got the eye of the ___, a fighter'", correctAnswer: "Tiger", incorrectAnswers: ["Storm", "Lion", "Eagle"], difficulty: "easy", deckId: "lyrics", packId: "music" },
    { id: "lyr-4", question: "'We will, we will ___ you'", correctAnswer: "Rock", incorrectAnswers: ["Shock", "Love", "Miss"], difficulty: "easy", deckId: "lyrics", packId: "music" },
    { id: "lyr-5", question: "'I'm just a ___, I need no sympathy'", correctAnswer: "Poor boy", incorrectAnswers: ["Lonely man", "Lost soul", "Sad heart"], difficulty: "medium", deckId: "lyrics", packId: "music" },
];

const AWARDS_QUESTIONS: Question[] = [
    { id: "awd-1", question: "What is the biggest award show for music in the United States?", correctAnswer: "Grammy Awards", incorrectAnswers: ["MTV VMAs", "American Music Awards", "Billboard Music Awards"], difficulty: "easy", deckId: "awards", packId: "music" },
    { id: "awd-2", question: "Who has won the most Grammy Awards of all time?", correctAnswer: "Beyoncé", incorrectAnswers: ["Taylor Swift", "Quincy Jones", "Michael Jackson"], difficulty: "medium", deckId: "awards", packId: "music" },
    { id: "awd-3", question: "What is Album of the Year at the Grammy Awards?", correctAnswer: "Award for best overall album", incorrectAnswers: ["Best-selling album", "Most streamed album", "Critics' choice album"], difficulty: "easy", deckId: "awards", packId: "music" },
    { id: "awd-4", question: "Which award show is known for its moonman trophy?", correctAnswer: "MTV Video Music Awards", incorrectAnswers: ["Grammy Awards", "Billboard Music Awards", "BET Awards"], difficulty: "medium", deckId: "awards", packId: "music" },
    { id: "awd-5", question: "In which year did Taylor Swift's '1989' win Album of the Year?", correctAnswer: "2016", incorrectAnswers: ["2015", "2014", "2017"], difficulty: "hard", deckId: "awards", packId: "music" },
];

const TITLES_QUESTIONS: Question[] = [
    { id: "ttl-1", question: "Which Beatles album features a zebra crossing on the cover?", correctAnswer: "Abbey Road", incorrectAnswers: ["Sgt. Pepper's", "Revolver", "Let It Be"], difficulty: "easy", deckId: "titles", packId: "music" },
    { id: "ttl-2", question: "What was Adele's debut album called?", correctAnswer: "19", incorrectAnswers: ["21", "25", "30"], difficulty: "medium", deckId: "titles", packId: "music" },
    { id: "ttl-3", question: "Which Pink Floyd album has a prism on the cover?", correctAnswer: "The Dark Side of the Moon", incorrectAnswers: ["The Wall", "Wish You Were Here", "Animals"], difficulty: "easy", deckId: "titles", packId: "music" },
    { id: "ttl-4", question: "What was Taylor Swift's first album called?", correctAnswer: "Taylor Swift", incorrectAnswers: ["Fearless", "Speak Now", "Red"], difficulty: "medium", deckId: "titles", packId: "music" },
    { id: "ttl-5", question: "Which album by Fleetwood Mac became one of the best-selling of all time?", correctAnswer: "Rumours", incorrectAnswers: ["Tusk", "Tango in the Night", "Mirage"], difficulty: "medium", deckId: "titles", packId: "music" },
];

// =============================================================================
// COMPILE ALL QUESTIONS
// =============================================================================

export const ALL_QUESTIONS: Question[] = [
    ...CAPITALS_QUESTIONS,
    ...FLAGS_QUESTIONS,
    ...COUNTRIES_QUESTIONS,
    ...LANGUAGES_QUESTIONS,
    ...DATES_QUESTIONS,
    ...FAMOUS_FIGURES_QUESTIONS,
    ...EVENTS_QUESTIONS,
    ...LOCATIONS_QUESTIONS,
    ...ATHLETES_QUESTIONS,
    ...SPORTS_TERMS_QUESTIONS,
    ...SPORTS_EVENTS_QUESTIONS,
    ...ARTISTS_QUESTIONS,
    ...LYRICS_QUESTIONS,
    ...AWARDS_QUESTIONS,
    ...TITLES_QUESTIONS,
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getQuestionsByDeck(deckId: string): Question[] {
    return ALL_QUESTIONS.filter(q => q.deckId === deckId);
}

export function getQuestionsByPack(packId: string): Question[] {
    return ALL_QUESTIONS.filter(q => q.packId === packId);
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
    if (difficulty === "mixed") return ALL_QUESTIONS;
    return ALL_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getDeckInfo(deckId: string): DeckInfo | undefined {
    return DECKS.find(d => d.id === deckId);
}

export function getPackInfo(packId: string): PackInfo | undefined {
    return PACKS.find(p => p.id === packId);
}

export function getDecksByPack(packId: string): DeckInfo[] {
    return DECKS.filter(d => d.packId === packId);
}

// Update deck question counts
DECKS.forEach(deck => {
    deck.questionCount = getQuestionsByDeck(deck.id).length;
});
