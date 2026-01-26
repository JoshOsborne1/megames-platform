import { Question } from '../types';
// QUESTIONS - ENTERTAINMENT PACK
// =============================================================================

const MOVIES_QUESTIONS: Question[] = [
    { id: "mov-1", question: "Who directed 'Schindler's List'?", correctAnswer: "Steven Spielberg", incorrectAnswers: ["Martin Scorsese", "Francis Ford Coppola", "Stanley Kubrick"], difficulty: "easy", deckId: "movies", packId: "entertainment" },
    { id: "mov-2", question: "Which movie won the first ever Academy Award for Best Picture?", correctAnswer: "Wings", incorrectAnswers: ["Sunrise", "The Jazz Singer", "Metropolis"], difficulty: "hard", deckId: "movies", packId: "entertainment" },
    { id: "mov-3", question: "Who was the first woman to win an Academy Award for Best Director?", correctAnswer: "Kathryn Bigelow", incorrectAnswers: ["Sofia Coppola", "Greta Gerwig", "Jane Campion"], difficulty: "hard", deckId: "movies", packId: "entertainment" },
    { id: "mov-4", question: "Which movie holds the record for the most Oscar wins (11)?", correctAnswer: "Titanic", incorrectAnswers: ["Ben-Hur", "The Lord of the Rings: The Return of the King", "All of the above"], difficulty: "medium", deckId: "movies", packId: "entertainment" },
    { id: "mov-5", question: "Who played the character of Jack Sparrow in 'Pirates of the Caribbean'?", correctAnswer: "Johnny Depp", incorrectAnswers: ["Orlando Bloom", "Geoffrey Rush", "Keira Knightley"], difficulty: "easy", deckId: "movies", packId: "entertainment" },
];

const TV_SHOWS_QUESTIONS: Question[] = [
    { id: "tv-1", question: "Which naturalist presented 'Planet Earth'?", correctAnswer: "David Attenborough", incorrectAnswers: ["Steve Irwin", "Jane Goodall", "Jacques Cousteau"], difficulty: "easy", deckId: "tv-shows", packId: "entertainment" },
    { id: "tv-2", question: "What is the longest-running scripted show in US primetime TV history?", correctAnswer: "The Simpsons", incorrectAnswers: ["Law & Order", "Sesame Street", "Gunsmoke"], difficulty: "medium", deckId: "tv-shows", packId: "entertainment" },
    { id: "tv-3", question: "Which TV show is set in the fictional continent of Westeros?", correctAnswer: "Game of Thrones", incorrectAnswers: ["The Witcher", "Lord of the Rings", "Vikings"], difficulty: "easy", deckId: "tv-shows", packId: "entertainment" },
    { id: "tv-4", question: "Who is the lead character in 'Breaking Bad'?", correctAnswer: "Walter White", incorrectAnswers: ["Jesse Pinkman", "Saul Goodman", "Skyler White"], difficulty: "easy", deckId: "tv-shows", packId: "entertainment" },
    { id: "tv-5", question: "Which show follows a group of friends living in New York City?", correctAnswer: "Friends", incorrectAnswers: ["Seinfeld", "How I Met Your Mother", "The Big Bang Theory"], difficulty: "easy", deckId: "tv-shows", packId: "entertainment" },
];

const GAMING_QUESTIONS: Question[] = [
    { id: "gam-1", question: "Who is the creator of Mario and Zelda?", correctAnswer: "Shigeru Miyamoto", incorrectAnswers: ["Hideo Kojima", "Satoshi Tajiri", "Tetsuya Nomura"], difficulty: "medium", deckId: "gaming", packId: "entertainment" },
    { id: "gam-2", question: "Which video game console is the best-selling of all time?", correctAnswer: "PlayStation 2", incorrectAnswers: ["Nintendo DS", "Game Boy", "Wii"], difficulty: "medium", deckId: "gaming", packId: "entertainment" },
    { id: "gam-3", question: "What is the highest-selling video game of all time?", correctAnswer: "Minecraft", incorrectAnswers: ["Tetris", "Grand Theft Auto V", "Wii Sports"], difficulty: "medium", deckId: "gaming", packId: "entertainment" },
    { id: "gam-4", question: "Which game features the phrases 'Finish Him!' and 'Fatality'?", correctAnswer: "Mortal Kombat", incorrectAnswers: ["Street Fighter", "Tekken", "SoulCalibur"], difficulty: "easy", deckId: "gaming", packId: "entertainment" },
    { id: "gam-5", question: "Who is the main protagonist of the 'Halo' series?", correctAnswer: "Master Chief", incorrectAnswers: ["Arbiter", "Cortana", "Sgt. Johnson"], difficulty: "easy", deckId: "gaming", packId: "entertainment" },
];

const POP_ICONS_QUESTIONS: Question[] = [
    { id: "popk-1", question: "Which singer is known as the 'Man in Black'?", correctAnswer: "Johnny Cash", incorrectAnswers: ["Elvis Presley", "Willie Nelson", "Bob Dylan"], difficulty: "medium", deckId: "pop-icons", packId: "entertainment" },
    { id: "popk-2", question: "Who is known as the 'King of Pop'?", correctAnswer: "Michael Jackson", incorrectAnswers: ["Elvis Presley", "Prince", "Justin Bieber"], difficulty: "easy", deckId: "pop-icons", packId: "entertainment" },
    { id: "popk-3", question: "Which artist famously painted 'Campbell's Soup Cans'?", correctAnswer: "Andy Warhol", incorrectAnswers: ["Jackson Pollock", "Roy Lichtenstein", "Keith Haring"], difficulty: "medium", deckId: "pop-icons", packId: "entertainment" },
    { id: "popk-4", question: "Which actress played Holly Golightly in 'Breakfast at Tiffany's'?", correctAnswer: "Audrey Hepburn", incorrectAnswers: ["Marilyn Monroe", "Elizabeth Taylor", "Grace Kelly"], difficulty: "medium", deckId: "pop-icons", packId: "entertainment" },
    { id: "popk-5", question: "Who is the author of the 'Harry Potter' series?", correctAnswer: "J.K. Rowling", incorrectAnswers: ["Stephen King", "George R.R. Martin", "Suzanne Collins"], difficulty: "easy", deckId: "pop-icons", packId: "entertainment" },
];

// =============================================================================
// COMPILE ALL QUESTIONS
// =============================================================================


export { MOVIES_QUESTIONS, TV_SHOWS_QUESTIONS, GAMING_QUESTIONS, POP_ICONS_QUESTIONS };
