export interface RhymeCard {
  phrase: string;
  celeb: string;
  rhyme: string;
  difficulty: 1 | 2 | 3;
  category: 'celeb' | 'character' | 'animal' | 'object';
}

export const rhymeDeck: RhymeCard[] = [
  // Celebrity Riddles (100 cards)
  { phrase: "Canadian rapper creating a homemade dessert", celeb: "Drake", rhyme: "baking a cake", difficulty: 1, category: 'celeb' },
  { phrase: "Purple icon experiencing facial cringe", celeb: "Prince", rhyme: "having a wince", difficulty: 2, category: 'celeb' },
  { phrase: "Top Gun star singing sad melodies", celeb: "Tom Cruise", rhyme: "singing the blues", difficulty: 2, category: 'celeb' },
  { phrase: "Pop sensation receiving a present", celeb: "Taylor Swift", rhyme: "getting a gift", difficulty: 2, category: 'celeb' },
  { phrase: "Fight Club actor finding a chair", celeb: "Brad Pitt", rhyme: "taking a sit", difficulty: 1, category: 'celeb' },
  { phrase: "Iron Man actor with a chocolate square snack", celeb: "Robert Downey Jr", rhyme: "eating a brownie", difficulty: 2, category: 'celeb' },
  { phrase: "Matrix hero dodging criminals", celeb: "Keanu Reeves", rhyme: "avoiding thieves", difficulty: 2, category: 'celeb' },
  { phrase: "Rocket Man singer trimming the grass", celeb: "Elton John", rhyme: "mowing the lawn", difficulty: 1, category: 'celeb' },
  { phrase: "Late night host jumping on a horse", celeb: "Jimmy Fallon", rhyme: "riding a stallion", difficulty: 2, category: 'celeb' },
  { phrase: "Queen Bey stretching in a studio", celeb: "Beyonce", rhyme: "doing pilates", difficulty: 2, category: 'celeb' },
  { phrase: "British spy actor touching soft animals", celeb: "Roger Moore", rhyme: "petting cats galore", difficulty: 3, category: 'celeb' },
  { phrase: "Poker Face singer stretching limbs", celeb: "Lady Gaga", rhyme: "doing yoga", difficulty: 1, category: 'celeb' },
  { phrase: "Titanic actress with jewelry on wrist", celeb: "Kate Winslet", rhyme: "wearing a bracelet", difficulty: 2, category: 'celeb' },
  { phrase: "Barbados singer holding rain protection", celeb: "Rihanna", rhyme: "with an umbrella", difficulty: 2, category: 'celeb' },
  { phrase: "Spider-Man actor from Britain spinning silk", celeb: "Tom Holland", rhyme: "making a strand", difficulty: 2, category: 'celeb' },
  { phrase: "Breaking Bad teacher mixing chemicals", celeb: "Walter White", rhyme: "in the night", difficulty: 2, category: 'celeb' },
  { phrase: "Funny lady who voices Dory making a mess", celeb: "Ellen DeGeneres", rhyme: "causing stress", difficulty: 3, category: 'celeb' },
  { phrase: "Wrinkle in Time star flying high", celeb: "Reese Witherspoon", rhyme: "over the moon", difficulty: 2, category: 'celeb' },
  { phrase: "Sherlock actor with difficult name getting an itch", celeb: "Benedict Cumberbatch", rhyme: "needing a scratch", difficulty: 2, category: 'celeb' },
  { phrase: "Anchorman comedian in trouble", celeb: "Will Ferrell", rhyme: "in peril", difficulty: 2, category: 'celeb' },
  { phrase: "Deadpool actor from Canada settling debts", celeb: "Ryan Reynolds", rhyme: "paying the bills", difficulty: 3, category: 'celeb' },
  { phrase: "Can't Stop the Feeling singer making vibrations", celeb: "Justin Timberlake", rhyme: "causing a shake", difficulty: 2, category: 'celeb' },
  { phrase: "Purpose singer having high temperature", celeb: "Justin Bieber", rhyme: "with a fever", difficulty: 1, category: 'celeb' },
  { phrase: "Talk show queen hitting jackpot", celeb: "Oprah Winfrey", rhyme: "winning lottery", difficulty: 3, category: 'celeb' },
  { phrase: "Pirates star walking forward", celeb: "Johnny Depp", rhyme: "taking a step", difficulty: 1, category: 'celeb' },
  { phrase: "Jolie actress being virtuous", celeb: "Angelina Jolie", rhyme: "acting holy", difficulty: 2, category: 'celeb' },
  { phrase: "Inception star eating cereal rings", celeb: "Leonardo DiCaprio", rhyme: "having Cheerios", difficulty: 2, category: 'celeb' },
  { phrase: "La La Land actress using a device", celeb: "Emma Stone", rhyme: "on the phone", difficulty: 1, category: 'celeb' },
  { phrase: "Thor actor heading upward", celeb: "Chris Hemsworth", rhyme: "going north", difficulty: 2, category: 'celeb' },
  { phrase: "Black Widow actress in sleepwear", celeb: "Scarlett Johansson", rhyme: "wearing pajamas", difficulty: 2, category: 'celeb' },
  { phrase: "Forrest Gump actor in armored vehicle", celeb: "Tom Hanks", rhyme: "in a tank", difficulty: 1, category: 'celeb' },
  { phrase: "Devil Wears Prada actress counting woolly animals", celeb: "Meryl Streep", rhyme: "with the sheep", difficulty: 1, category: 'celeb' },
  { phrase: "Pulp Fiction actor having snacks", celeb: "Samuel Jackson", rhyme: "while snacking", difficulty: 2, category: 'celeb' },
  { phrase: "The Rock wearing footwear", celeb: "Dwayne Johnson", rhyme: "putting on socks", difficulty: 1, category: 'celeb' },
  { phrase: "One Direction singer consuming heaps", celeb: "Harry Styles", rhyme: "eating piles", difficulty: 2, category: 'celeb' },
  { phrase: "Thank U Next singer at the kiosk", celeb: "Ariana Grande", rhyme: "at the stand", difficulty: 2, category: 'celeb' },
  { phrase: "Wrecking Ball singer catching illness", celeb: "Miley Cyrus", rhyme: "with a virus", difficulty: 2, category: 'celeb' },
  { phrase: "Firework singer eating red fruit", celeb: "Katy Perry", rhyme: "with a cherry", difficulty: 1, category: 'celeb' },
  { phrase: "Shape of You singer controlling vehicle", celeb: "Ed Sheeran", rhyme: "while steering", difficulty: 2, category: 'celeb' },
  { phrase: "Rolling in the Deep singer with chime", celeb: "Adele", rhyme: "ringing a bell", difficulty: 1, category: 'celeb' },
  { phrase: "Circles rapper eating baked goods", celeb: "Post Malone", rhyme: "having scones", difficulty: 2, category: 'celeb' },
  { phrase: "Bad Guy singer being fashionable", celeb: "Billie Eilish", rhyme: "looking stylish", difficulty: 2, category: 'celeb' },
  { phrase: "WAP rapper sipping beverage", celeb: "Cardi B", rhyme: "drinking tea", difficulty: 1, category: 'celeb' },
  { phrase: "Truth Hurts singer eating Italian food", celeb: "Lizzo", rhyme: "having pizza", difficulty: 1, category: 'celeb' },
  { phrase: "Blinding Lights artist losing strength", celeb: "The Weeknd", rhyme: "getting weakened", difficulty: 2, category: 'celeb' },
  { phrase: "Stitches singer playing racquet sport", celeb: "Shawn Mendes", rhyme: "in a match", difficulty: 2, category: 'celeb' },
  { phrase: "Wolves singer on watercraft", celeb: "Selena Gomez", rhyme: "in a boat", difficulty: 2, category: 'celeb' },
  { phrase: "Levitating singer consuming Italian dish", celeb: "Dua Lipa", rhyme: "eating pizza", difficulty: 1, category: 'celeb' },
  { phrase: "Godfather actor with feline pet", celeb: "Marlon Brando", rhyme: "holding a cat though", difficulty: 3, category: 'celeb' },
  { phrase: "X Factor judge purchasing a letter", celeb: "Simon Cowell", rhyme: "buying a vowel", difficulty: 2, category: 'celeb' },
  { phrase: "Baywatch actor having cough", celeb: "David Hasselhoff", rhyme: "sounding off", difficulty: 2, category: 'celeb' },
  { phrase: "Office creator eating condiment", celeb: "Ricky Gervais", rhyme: "with mayonnaise", difficulty: 2, category: 'celeb' },
  { phrase: "Hotline Bling rapper making pastry", celeb: "Drake", rhyme: "starting to bake", difficulty: 1, category: 'celeb' },
  { phrase: "Friends actress being virtuous", celeb: "Jennifer Aniston", rhyme: "looking saintly", difficulty: 3, category: 'celeb' },
  { phrase: "Hunger Games star being courageous", celeb: "Jennifer Lawrence", rhyme: "showing some valor", difficulty: 3, category: 'celeb' },
  { phrase: "Transformers actress constructing with toys", celeb: "Megan Fox", rhyme: "playing with blocks", difficulty: 1, category: 'celeb' },
  { phrase: "Breaking Bad star gaining mass", celeb: "Bryan Cranston", rhyme: "expanding", difficulty: 2, category: 'celeb' },
  { phrase: "Game of Thrones star being royal", celeb: "Sean Bean", rhyme: "like a Queen", difficulty: 2, category: 'celeb' },
  { phrase: "Pitch Perfect actress being ordinary", celeb: "Skylar Astin", rhyme: "quite plain", difficulty: 2, category: 'celeb' },
  { phrase: "Killing Me Softly singer on animal", celeb: "Roberta Flack", rhyme: "riding a yak", difficulty: 2, category: 'celeb' },
  { phrase: "9 to 5 singer in Scottish pattern", celeb: "Dolly Parton", rhyme: "dressed in tartan", difficulty: 2, category: 'celeb' },
  { phrase: "Some Like It Hot actress refusing to expand", celeb: "Marilyn Monroe", rhyme: "won't grow", difficulty: 2, category: celeb' },
  { phrase: "Footloose actor being Caribbean", celeb: "Kevin Bacon", rhyme: "acting Jamaican", difficulty: 1, category: 'celeb' },
  { phrase: "Stefani singer riding purple dinosaur", celeb: "Gwen Stefani", rhyme: "on top of Barney", difficulty: 2, category: 'celeb' },
  { phrase: "Sex and the City actress admiring host", celeb: "Sarah Jessica Parker", rhyme: "loving Bob Barker", difficulty: 3, category: 'celeb' },
  { phrase: "Ghost actress consuming wild pig", celeb: "Demi Moore", rhyme: "eating boar", difficulty: 2, category: 'celeb' },
  { phrase: "Groundhog Day actor having frozen dessert", celeb: "Bill Murray", rhyme: "eating sorbet", difficulty: 2, category: 'celeb' },
  { phrase: "Batman actor sending letters", celeb: "Christian Bale", rhyme: "delivering mail", difficulty: 1, category: 'celeb' },
  { phrase: "King Kong actress using online marketplace", celeb: "Fay Wray", rhyme: "shopping on eBay", difficulty: 2, category: 'celeb' },
  { phrase: "Mission Impossible star in elevated footwear", celeb: "Tom Cruise", rhyme: "wearing tall shoes", difficulty: 1, category: 'celeb' },
  { phrase: "Superstition singer fearing storms", celeb: "Stevie Wonder", rhyme: "scared of thunder", difficulty: 2, category: 'celeb' },
  { phrase: "Ocean's actor with ice cream treat", celeb: "Brad Pitt", rhyme: "having a split", difficulty: 1, category: 'celeb' },
  { phrase: "Avengers actor piloting aircraft", celeb: "Samuel Jackson", rhyme: "plane action", difficulty: 2, category: 'celeb' },
  { phrase: "Notebook actor being polite", celeb: "Ryan Gosling", rhyme: "staying civil", difficulty: 3, category: 'celeb' },
  { phrase: "Scarface actor speaking loudly", celeb: "Al Pacino", rhyme: "like a rhino", difficulty: 2, category: 'celeb' },
  { phrase: "Wolf of Wall Street actor with frozen water", celeb: "Leonardo DiCaprio", rhyme: "holding some ice though", difficulty: 3, category: 'celeb' },
  { phrase: "Taxi Driver actor raising animals", celeb: "Robert De Niro", rhyme: "being a bro", difficulty: 3, category: 'celeb' },
  { phrase: "Goodfellas actor cooking Italian food", celeb: "Joe Pesci", rhyme: "making spaghetti", difficulty: 2, category: 'celeb' },
  { phrase: "Fight Club actor making plans", celeb: "Edward Norton", rhyme: "getting sorted", difficulty: 2, category: 'celeb' },
  { phrase: "Face/Off actor holding currency", celeb: "Nicolas Cage", rhyme: "counting wage", difficulty: 1, category: 'celeb' },
  { phrase: "Footloose actor in financial trouble", celeb: "Kevin Bacon", rhyme: "money taken", difficulty: 2, category: 'celeb' },
  { phrase: "Top Gun actor being clever", celeb: "Tom Cruise", rhyme: "with smart views", difficulty: 2, category: 'celeb' },
  { phrase: "Rush Hour actor having conflict", celeb: "Jackie Chan", rhyme: "fighting a man", difficulty: 1, category: 'celeb' },
  { phrase: "Karate Kid actor polishing floors", celeb: "Ralph Macchio", rhyme: "with some wax though", difficulty: 3, category: 'celeb' },
  { phrase: "Rocky actor climbing stairs", celeb: "Sylvester Stallone", rhyme: "all alone", difficulty: 2, category: 'celeb' },
  { phrase: "Terminator actor being robotic", celeb: "Arnold Schwarzenegger", rhyme: "getting bigger", difficulty: 2, category: 'celeb' },
  { phrase: "Predator actor on hunting trip", celeb: "Arnold Schwarzenegger", rhyme: "being a tracker", difficulty: 3, category: 'celeb' },
  { phrase: "Die Hard actor with bare feet", celeb: "Bruce Willis", rhyme: "feeling chilly", difficulty: 2, category: 'celeb' },
  { phrase: "Sixth Sense actor seeing spirits", celeb: "Bruce Willis", rhyme: "giving me the chills", difficulty: 2, category: 'celeb' },
  { phrase: "Pulp Fiction actor with timepiece", celeb: "Bruce Willis", rhyme: "with a watch still", difficulty: 3, category: 'celeb' },
  { phrase: "Speed actress controlling vehicle", celeb: "Sandra Bullock", rhyme: "not stopping", difficulty: 2, category: 'celeb' },
  { phrase: "Miss Congeniality actress being pretty", celeb: "Sandra Bullock", rhyme: "looking lovely", difficulty: 2, category: 'celeb' },
  { phrase: "Gravity actress floating in space", celeb: "Sandra Bullock", rhyme: "losing her place", difficulty: 2, category: 'celeb' },
  { phrase: "Pretty Woman actress smiling wide", celeb: "Julia Roberts", rhyme: "full of pride", difficulty: 2, category: 'celeb' },
  { phrase: "Notting Hill actress in London", celeb: "Julia Roberts", rhyme: "being honest", difficulty: 3, category: 'celeb' },
  { phrase: "Erin Brockovich actress being determined", celeb: "Julia Roberts", rhyme: "never deterred", difficulty: 3, category: 'celeb' },
  { phrase: "Cast Away actor being isolated", celeb: "Tom Hanks", rhyme: "giving thanks", difficulty: 1, category: 'celeb' },
  { phrase: "Toy Story actor voicing cowboy", celeb: "Tom Hanks", rhyme: "in the ranks", difficulty: 2, category: 'celeb' },
  { phrase: "Philadelphia actor being sick", celeb: "Tom Hanks", rhyme: "looking thin thanks", difficulty: 3, category: 'celeb' },
];

export const allRhymes: RhymeCard[] = rhymeDeck;

export function shuffleDeck(deck: RhymeCard[] = allRhymes): RhymeCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getDeckByDifficulty(difficulty: 1 | 2 | 3): RhymeCard[] {
  return allRhymes.filter(card => card.difficulty === difficulty);
}

export function getDeckByCategory(category: RhymeCard['category']): RhymeCard[] {
  return allRhymes.filter(card => card.category === category);
}