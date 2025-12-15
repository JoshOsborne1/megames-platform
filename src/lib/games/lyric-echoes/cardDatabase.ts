import { LyricCard } from "./types";

export const songEchoCards: LyricCard[] = [
  { echo: "Hold me closer, bony dancer", answer: "Tiny Dancer by Elton John", difficulty: 2, type: "song" },
  { echo: "There's a bathroom on the right", answer: "Bad Moon Rising by CCR", difficulty: 2, type: "song" },
  { echo: "Sweet dreams are made of cheese", answer: "Sweet Dreams by Eurythmics", difficulty: 1, type: "song" },
  { echo: "I've got two chickens to paralyze", answer: "Two Tickets to Paradise by Eddie Money", difficulty: 3, type: "song" },
  { echo: "Excuse me while I kiss this guy", answer: "Purple Haze by Jimi Hendrix", difficulty: 2, type: "song" },
  { echo: "The girl with colitis goes by", answer: "Lucy in the Sky with Diamonds by The Beatles", difficulty: 3, type: "song" },
  { echo: "I'll never leave your pizza burning", answer: "I'll Never Be Your Beast of Burden by The Rolling Stones", difficulty: 3, type: "song" },
  { echo: "We're up all night to get Yucky", answer: "Get Lucky by Daft Punk", difficulty: 2, type: "song" },
  { echo: "I'm blue, I would beat off a guy", answer: "Blue (Da Ba Dee) by Eiffel 65", difficulty: 3, type: "song" },
  { echo: "Hit me with your pet shark", answer: "Hit Me with Your Best Shot by Pat Benatar", difficulty: 2, type: "song" },
  { echo: "Wrapped up like a douche", answer: "Blinded by the Light by Manfred Mann", difficulty: 3, type: "song" },
  { echo: "I believe in Miracle Whip", answer: "You Sexy Thing by Hot Chocolate", difficulty: 2, type: "song" },
  { echo: "Don't go, Jason Waterfalls", answer: "Waterfalls by TLC", difficulty: 2, type: "song" },
  { echo: "My lovely lady lumps, check it out", answer: "My Humps by Black Eyed Peas", difficulty: 1, type: "song" },
  { echo: "We built this city on sausage rolls", answer: "We Built This City by Starship", difficulty: 2, type: "song" },
  { echo: "The ants are my friends, they're blowin' in the wind", answer: "Blowin' in the Wind by Bob Dylan", difficulty: 3, type: "song" },
  { echo: "I've got two chickens, two chickens to ride", answer: "Ticket to Ride by The Beatles", difficulty: 3, type: "song" },
  { echo: "Calling out in transit, Gloriana", answer: "Gloria by Laura Branigan", difficulty: 2, type: "song" },
  { echo: "Concrete jungle, wet dream tomato", answer: "Empire State of Mind by Jay-Z", difficulty: 3, type: "song" },
  { echo: "Someone shaved my wife tonight", answer: "Somebody Saved My Life Tonight by Elton John", difficulty: 4, type: "song" },
];

export const artistEchoCards: LyricCard[] = [
  { echo: "Hairy Styles", answer: "Harry Styles", difficulty: 1, type: "artist" },
  { echo: "Post Alone", answer: "Post Malone", difficulty: 1, type: "artist" },
  { echo: "Doolie Pardon", answer: "Dolly Parton", difficulty: 2, type: "artist" },
  { echo: "Aryan Granny", answer: "Ariana Grande", difficulty: 2, type: "artist" },
  { echo: "The Weekend Warrior", answer: "The Weeknd", difficulty: 2, type: "artist" },
  { echo: "Belly Irish", answer: "Billie Eilish", difficulty: 2, type: "artist" },
  { echo: "Jello Musk", answer: "Elon Musk (joke: Ed Sheeran)", difficulty: 3, type: "artist" },
  { echo: "Miley Virus", answer: "Miley Cyrus", difficulty: 1, type: "artist" },
  { echo: "Just in Beaver", answer: "Justin Bieber", difficulty: 1, type: "artist" },
  { echo: "Taylor Squid", answer: "Taylor Swift", difficulty: 1, type: "artist" },
  { echo: "Lady Goo Goo", answer: "Lady Gaga", difficulty: 1, type: "artist" },
  { echo: "Mick Jagged", answer: "Mick Jagger", difficulty: 2, type: "artist" },
  { echo: "Broccoli Springsteen", answer: "Bruce Springsteen", difficulty: 2, type: "artist" },
  { echo: "Mad Donna", answer: "Madonna", difficulty: 1, type: "artist" },
  { echo: "Freddie Curry", answer: "Freddie Mercury", difficulty: 2, type: "artist" },
  { echo: "Rihanna Montana", answer: "Rihanna", difficulty: 2, type: "artist" },
  { echo: "Katy Scary", answer: "Katy Perry", difficulty: 1, type: "artist" },
  { echo: "Dork Punk", answer: "Daft Punk", difficulty: 2, type: "artist" },
  { echo: "The Rolling Scones", answer: "The Rolling Stones", difficulty: 2, type: "artist" },
  { echo: "The Beetles", answer: "The Beatles", difficulty: 1, type: "artist" },
];

export const allCards: LyricCard[] = [...songEchoCards, ...artistEchoCards];

export function getRandomCard(excludeIds: string[] = []): LyricCard {
  const availableCards = allCards.filter((_, index) => !excludeIds.includes(index.toString()));
  return availableCards[Math.floor(Math.random() * availableCards.length)];
}

export function getCardsByDifficulty(difficulty: number): LyricCard[] {
  return allCards.filter(card => card.difficulty === difficulty);
}
