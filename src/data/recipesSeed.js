/**
 * Seed recipes for initial data
 * @type {import('./types').Recipe[]}
 */
export const recipesSeed = [
  {
    id: 'niu-rou-mian-001',
    title: 'Niu Rou Mian',
    image: null,
    ingredients: [
      '1/2 lb beef chuck, cubed',
      '8 oz fresh noodles',
      '2 green onions, chopped',
      '3 cloves garlic, minced',
      '2 star anise',
      '1 cinnamon stick',
      '2 tbsp soy sauce',
      '1 tbsp dark soy sauce',
      '1 tsp sugar',
      '4 cups beef stock',
      'Salt to taste',
      'Chili oil for serving'
    ],
    instructions: [
      'Blanch beef cubes in boiling water for 2-3 minutes, then drain and rinse',
      'In a large pot, add beef, garlic, star anise, and cinnamon stick',
      'Pour in beef stock, soy sauce, dark soy sauce, and sugar',
      'Bring to a boil, then reduce heat and simmer for 1.5-2 hours until beef is tender',
      'Cook noodles separately according to package instructions',
      'Place noodles in serving bowl, ladle beef and broth over noodles',
      'Top with green onions and chili oil to taste'
    ],
    chefNotes: 'The key is to simmer the beef low and slow until it\'s fall-apart tender. Don\'t rush this step. You can make the broth a day ahead for even better flavor.',
    createdAt: '2024-01-15T10:00:00.000Z',
    iterations: [
      {
        id: 'iter-001',
        date: '2024-12-04',
        chef: 'Karen Tao',
        changesMade: 'Added shiitake mushrooms and bok choy',
        outcome: 'More flavorful and nutritious. Family loved the extra vegetables.',
        image: null
      },
      {
        id: 'iter-002',
        date: '2025-02-15',
        chef: 'Eric Tao',
        changesMade: 'Used more tomato paste and extra chili oil',
        outcome: 'Richer, spicier broth. More authentic taste.',
        image: null
      }
    ]
  },
  {
    id: 'fried-rice-001',
    title: 'Classic Fried Rice',
    image: null,
    ingredients: [
      '3 cups day-old cooked rice',
      '2 eggs, beaten',
      '1/2 cup frozen peas and carrots',
      '3 green onions, chopped',
      '2 cloves garlic, minced',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      '2 tbsp vegetable oil',
      'Salt and white pepper to taste'
    ],
    instructions: [
      'Heat 1 tbsp oil in a wok or large skillet over high heat',
      'Add beaten eggs and scramble, then remove and set aside',
      'Add remaining oil, then garlic and white parts of green onions',
      'Add day-old rice, breaking up any clumps',
      'Stir-fry rice for 3-4 minutes until heated through',
      'Add peas and carrots, cook for 2 minutes',
      'Return eggs to pan, add soy sauce and sesame oil',
      'Toss everything together, season with salt and pepper',
      'Garnish with green parts of green onions'
    ],
    chefNotes: 'Use day-old rice that has been refrigerated overnight. Fresh rice is too moist and will become mushy. High heat is essential for that restaurant-style wok flavor.',
    createdAt: '2024-03-20T14:30:00.000Z',
    iterations: [
      {
        id: 'iter-003',
        date: '2024-06-10',
        chef: 'Mom',
        changesMade: 'Added diced char siu (Chinese BBQ pork)',
        outcome: 'Much more filling and flavorful. Kids asked for seconds!',
        image: null
      }
    ]
  }
];
