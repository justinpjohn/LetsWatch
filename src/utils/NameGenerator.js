const ANIMALS = [
	'Ant',
	'Bee',
	'Beetle',
	'Cat',
	'Chicken',
	'Chimpanzee',
	'Cow',
	'Dolphin',
	'Elephant',
	'Emu',
	'Frog',
	'Giraffe',
	'Horse',
	'Koala',
	'Labrador',
	'Lion',
	'Meerkat',
	'Mouse',
	'Parrot',
	'Pig',
	'Pug',
	'Rabbit',
	'Rat',
	'Raven',
	'Sheep',
	'Slug',
	'Snail',
	'Spider',
	'Squirrel',
	'Terrier',
	'Turtle',
	'Unicorn',
	'Zebra',
];

const PEOPLE = [
	'King',
	'Queen',
	'Servant',
	'Janitor',
	'Manager',
	'Dentist',
	'Nurse',
	'Librarian',
	'Ruler',
	'Player',
	'Officer',
	'Doctor',
];

const FRUIT = [
	'Apple',
	'Apricot',
	'Banana',
	'Blackberry',
	'Cherimoya',
	'Cranberry',
	'Gooseberry',
	'Grape',
	'Grapefruit',
	'Kiwifruit',
	'Mango',
	'Melon',
	'Muskmelon',
	'Orange',
	'Papaya',
	'Pear',
	'Pineapple',
	'Pitaya',
	'Pomelo',
	'Prune',
	'Quince',
	'Raspberry',
	'Soursop',
	'Tangelo',
	'Tangerine',
];

const RANDOM_NOUNS = [
	'Finger',
	'Air',
	'Show',
	'Plane',
	'Sofa',
	'Soap',
	'Bulb',
	'Wall',
	'Quill',
	'Dime',
	'Pencil',
	'Swing',
];

const ADJECTIVES = [
	'Alive',
	'Better',
	'Careful',
	'Clever',
	'Dead',
	'Easy',
	'Famous',
	'Gifted',
	'Hallowed',
	'Helpful',
	'Important',
	'Inexpensive',
	'Mealy',
	'Mushy',
	'Odd',
	'Poor',
	'Powerful',
	'Rich',
	'Shy',
	'Tender',
	'Unimportant',
	'Uninterested',
	'Vast',
	'Wrong',
];

let NOUNS = [];
NOUNS = NOUNS.concat(ANIMALS);
NOUNS = NOUNS.concat(PEOPLE);
NOUNS = NOUNS.concat(FRUIT);
NOUNS = NOUNS.concat(RANDOM_NOUNS);

const generateRandomName = () => {
	let name = '';
	name += ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
	name += ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
	name += NOUNS[Math.floor(Math.random() * NOUNS.length)];
	return name;
};

module.exports = { generateRandomName };
