// ============================================================
//  WEEKLY TRENDING DATA
//  Auto-updated by Claude Research Agent
//  Last run: 4/10/2026, 3:57:47 PM
//
//  RESEARCH TEAM — only step needed each week:
//  Add up to 3 video links per item in the videos: [] field below.
//  Format: { "platform": "tiktok", "title": "Video title", "url": "https://..." }
// ============================================================

const TRENDING_DATA = {

  // ── Meta ─────────────────────────────────────────────────
  meta: {
  "weekLabel": "Week of April 6 – April 12, 2026",
  "weekNumber": 15,
  "year": 2026,
  "publishedBy": "Claude Research Agent",
  "publishedAt": "2026-04-10",
  "nextUpdate": "2026-04-13",
  "notes": "Spring produce excitement is colliding with a massive nostalgia-comfort wave this week. Cottage cheese continues its multi-year renaissance in unexpected formats, while a Korean-Mexican fusion moment dominates dinner content. On the bakery side, laminated doughs and retro American desserts are surging hard across all platforms."
},

  // ── Platforms Reference ──────────────────────────────────
  platforms: {
    tiktok:    { label: "TikTok",    color: "#ff0050", icon: "🎵" },
    youtube:   { label: "YouTube",   color: "#ff0000", icon: "▶" },
    instagram: { label: "Instagram", color: "#e1306c", icon: "📸" },
    x:         { label: "X",         color: "#1d9bf0", icon: "𝕏" }
  },

  // ── Categories ───────────────────────────────────────────
  categories: [
    { id: "all",     label: "All Trends",     icon: "🔥" },
    { id: "kitchen", label: "Kitchen Dishes", icon: "🍽" },
    { id: "bakery",  label: "Bakery",         icon: "🥐" },
    { id: "grocery", label: "Grocery Items",  icon: "🛒" }
  ],

  // ── Trend Items ──────────────────────────────────────────
  //  ADD VIDEO LINKS HERE ↓
  //  videos: [ { "platform": "tiktok", "title": "...", "url": "https://..." } ]
  items: [
  {
    "id": "k001",
    "category": "kitchen",
    "name": "Gochujang Birria Tacos",
    "tagline": "Korean-Mexican fusion tacos breaking the internet",
    "viralScore": 97,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "youtube",
      "instagram",
      "x"
    ],
    "hashtags": [
      "#GochujangBirria",
      "#FusionTacos",
      "#BirriaTok",
      "#KoreanMexicanFusion"
    ],
    "description": "A mashup that started with a single TikTok creator adding gochujang and doenjang to classic birria consommé has now exploded into a full-blown cross-platform trend. The deeply savory, spicy-sweet broth for dipping plus melty cheese in crispy tortillas is driving millions of saves and shares. Creators are one-upping each other with kimchi toppings and sesame oil drizzles.",
    "keyIngredients": [
      "Chuck roast",
      "Gochujang paste",
      "Dried guajillo chiles",
      "Corn tortillas",
      "Oaxaca cheese"
    ],
    "difficulty": 2,
    "prepTime": "3 hours (mostly hands-off)",
    "servings": "6",
    "supermarketAngle": "Create a cross-merchandised endcap bundling chuck roast, gochujang, dried chiles, corn tortillas, and Oaxaca cheese with a shelf talker showing the TikTok trend. Meat department should feature chuck roast prominently and international aisle should double-face gochujang. Print a simplified recipe card at the display.",
    "storeSection": [
      "Meat",
      "International",
      "Dairy",
      "Bakery/Tortillas"
    ],
    "estimatedCost": "$18–24",
    "weeklyMentions": 4200000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "k002",
    "category": "kitchen",
    "name": "Cottage Cheese Flatbread Pizza",
    "tagline": "High-protein pizza crust with just 2 ingredients",
    "viralScore": 93,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "instagram",
      "youtube"
    ],
    "hashtags": [
      "#CottageCheeseFlatbread",
      "#ProteinPizza",
      "#CottageCheeseTok",
      "#HealthyPizzaNight"
    ],
    "description": "The cottage cheese trend refuses to die — this week's iteration blends cottage cheese with self-rising flour to create a surprisingly puffy, high-protein flatbread that creators are using as pizza crust. The appeal is the macro-friendly angle (30g+ protein per serving) combined with genuinely good texture. It's dominating fitness and family cooking content simultaneously.",
    "keyIngredients": [
      "Cottage cheese (full fat)",
      "Self-rising flour",
      "Mozzarella cheese",
      "Pepperoni",
      "Marinara sauce"
    ],
    "difficulty": 1,
    "prepTime": "25 min",
    "servings": "2",
    "supermarketAngle": "Build a refrigerated endcap near dairy with cottage cheese (prioritize Good Culture and store brand full-fat), self-rising flour, and shredded mozzarella. Add a 'Trending on TikTok' shelf blade. This is a strong opportunity for dairy department to move premium cottage cheese SKUs which carry higher margins.",
    "storeSection": [
      "Dairy",
      "Baking Aisle",
      "Deli"
    ],
    "estimatedCost": "$8–11",
    "weeklyMentions": 3800000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "k003",
    "category": "kitchen",
    "name": "Smashed Cucumber Salad with Chili Crisp Vinaigrette",
    "tagline": "Crunchy, spicy cucumber salad — spring's hottest side",
    "viralScore": 88,
    "trend": "steady",
    "platforms": [
      "tiktok",
      "instagram",
      "x"
    ],
    "hashtags": [
      "#SmashedCucumber",
      "#ChiliCrispSalad",
      "#SpringSalad",
      "#CucumberSaladTrend"
    ],
    "description": "Smashed cucumber salads have been building for months but the addition of chili crisp vinaigrette (Lao Gan Ma or Fly By Jing mixed with rice vinegar and sesame oil) has given it a massive second-wave surge this spring. The satisfying ASMR smashing videos and the 5-minute prep time make it irresistible content. Perfect timing as cucumbers hit peak spring freshness.",
    "keyIngredients": [
      "English cucumbers",
      "Chili crisp (Lao Gan Ma or Fly By Jing)",
      "Rice vinegar",
      "Sesame oil",
      "Roasted sesame seeds"
    ],
    "difficulty": 1,
    "prepTime": "10 min",
    "servings": "4",
    "supermarketAngle": "Produce department should build a small display of English cucumbers next to a shelf strip holding chili crisp, rice vinegar, and sesame oil. This low-cost cross-merch drives basket size from a $1 cucumber to a $12 ring. Ensure Fly By Jing and Lao Gan Ma are both in stock — they've been selling out in many markets.",
    "storeSection": [
      "Produce",
      "International",
      "Condiments"
    ],
    "estimatedCost": "$6–9",
    "weeklyMentions": 2900000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "k004",
    "category": "kitchen",
    "name": "Crispy Rice Egg Skillet (\"Tahdig Breakfast\")",
    "tagline": "Persian-inspired crispy rice meets runny eggs",
    "viralScore": 85,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "youtube",
      "instagram"
    ],
    "hashtags": [
      "#TahdigBreakfast",
      "#CrispyRiceEggs",
      "#BreakfastSkillet",
      "#OnePanBreakfast"
    ],
    "description": "Creators are pressing day-old rice into a buttered skillet until shatteringly crispy, then cracking eggs on top with herbs and feta. Inspired by Persian tahdig but simplified for weekday breakfast, this one-pan dish delivers incredible textural contrast. The sizzling overhead shots are generating massive engagement, and the use of leftover rice resonates with the zero-waste cooking community.",
    "keyIngredients": [
      "Jasmine rice (day-old)",
      "Eggs",
      "Butter",
      "Feta cheese",
      "Fresh dill"
    ],
    "difficulty": 1,
    "prepTime": "20 min",
    "servings": "2",
    "supermarketAngle": "Feature eggs and feta in a co-display near the rice aisle with recipe cards. Deli can stock fresh dill bundles prominently. This trend also drives sales of ready-made microwavable rice pouches (Minute Rice, Seeds of Change) for customers who don't have leftover rice on hand — position those in the display too.",
    "storeSection": [
      "Dairy/Eggs",
      "Rice & Grains",
      "Produce"
    ],
    "estimatedCost": "$7–10",
    "weeklyMentions": 2100000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "b001",
    "category": "bakery",
    "name": "Dubai Chocolate Croissant (Pistachio Knafeh Croissant)",
    "tagline": "The viral pistachio-chocolate croissant craze continues",
    "viralScore": 96,
    "trend": "steady",
    "platforms": [
      "tiktok",
      "youtube",
      "instagram",
      "x"
    ],
    "hashtags": [
      "#DubaiChocolate",
      "#PistachioCroissant",
      "#KnafehCroissant",
      "#DubaiChocolateCroissant"
    ],
    "description": "The Dubai chocolate bar trend from late 2024 has fully evolved into a bakery format. Croissants filled with pistachio cream, crunchy knafeh (shredded phyllo), and tahini chocolate are the single most requested bakery item across social media. Home bakers are attempting it with store-bought puff pastry and pistachio butter, keeping it accessible. The green cross-section reveal videos remain massively shareable.",
    "keyIngredients": [
      "Puff pastry sheets",
      "Pistachio butter/cream",
      "Shredded phyllo (kataifi)",
      "Dark chocolate",
      "Tahini"
    ],
    "difficulty": 3,
    "prepTime": "1 hour 30 min",
    "servings": "8",
    "supermarketAngle": "In-store bakery should develop a Dubai chocolate croissant as a premium LTO item ($4.99–5.99 each). For home bakers, create a clip strip near frozen puff pastry featuring pistachio butter and dark chocolate bars. International aisle should ensure kataifi dough is stocked. This is the #1 bakery trend in the country right now.",
    "storeSection": [
      "In-Store Bakery",
      "Frozen",
      "International"
    ],
    "estimatedCost": "$14–18 (batch of 8)",
    "weeklyMentions": 5100000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "b002",
    "category": "bakery",
    "name": "Burnt Basque Cheesecake (Matcha Swirl Edition)",
    "tagline": "Crustless cheesecake gets a matcha glow-up",
    "viralScore": 90,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "instagram",
      "youtube"
    ],
    "hashtags": [
      "#BasqueCheesecake",
      "#MatchaCheesecake",
      "#BurntCheesecake",
      "#MatchaDessert"
    ],
    "description": "Basque cheesecake never fully left the spotlight, but a matcha-swirl version is surging this spring. Creators marble ceremonial-grade matcha into the classic custard-like batter before the signature high-heat bake. The dramatic green swirl against the caramelized top photographs incredibly well. The simplicity — no crust, no water bath — is driving first-time bakers to attempt it.",
    "keyIngredients": [
      "Cream cheese (3 blocks)",
      "Heavy cream",
      "Eggs",
      "Granulated sugar",
      "Ceremonial matcha powder"
    ],
    "difficulty": 2,
    "prepTime": "1 hour + cooling",
    "servings": "10",
    "supermarketAngle": "Dairy department should stack cream cheese blocks (Philadelphia or store brand) in a secondary display with heavy cream nearby, plus a shelf blade calling out 'Make the viral matcha cheesecake.' Stock matcha powder in tea/baking aisle and ensure supply — matcha SKUs are regularly selling out due to sustained demand. In-store bakery can offer whole cakes for $16.99–19.99.",
    "storeSection": [
      "Dairy",
      "Baking",
      "Tea/Coffee",
      "In-Store Bakery"
    ],
    "estimatedCost": "$12–15",
    "weeklyMentions": 3100000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "b003",
    "category": "bakery",
    "name": "Sourdough Cinnamon Roll Babka",
    "tagline": "Sourdough meets cinnamon rolls in a twisted loaf",
    "viralScore": 82,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "youtube",
      "instagram"
    ],
    "hashtags": [
      "#SourdoughBabka",
      "#CinnamonRollBabka",
      "#SourdoughBaking",
      "#BabkaTok"
    ],
    "description": "Sourdough creators are merging two beloved formats — the tangy, open-crumb sourdough process with heavily cinnamon-sugared babka filling, twisted into a dramatic pull-apart loaf. The cross-section reveal videos showing layers of cinnamon swirl inside a sourdough crumb are generating enormous saves. For non-sourdough bakers, simplified versions using instant yeast are also trending.",
    "keyIngredients": [
      "Bread flour",
      "Sourdough starter or active dry yeast",
      "Brown sugar",
      "Ground cinnamon",
      "Butter"
    ],
    "difficulty": 3,
    "prepTime": "12 hours (with sourdough) / 4 hours (yeast)",
    "servings": "8",
    "supermarketAngle": "Baking aisle should feature bread flour, cinnamon, and brown sugar in a 'Weekend Baking Project' clip strip display. Stock sourdough starter kits (King Arthur brand) if available. In-store bakery can produce a babka loaf as a weekend special ($8.99) to capture the aesthetic. This trend skews to premium baking customers with higher basket spend.",
    "storeSection": [
      "Baking Aisle",
      "In-Store Bakery"
    ],
    "estimatedCost": "$6–9",
    "weeklyMentions": 1800000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "b004",
    "category": "bakery",
    "name": "Pineapple Upside-Down Cake Revival",
    "tagline": "Retro American dessert makes a Gen Z comeback",
    "viralScore": 79,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "instagram"
    ],
    "hashtags": [
      "#PineappleUpsideDown",
      "#RetroBaking",
      "#VintageDessert",
      "#GrandmaRecipes"
    ],
    "description": "Part of a broader 'grandma cooking' nostalgia wave on TikTok, pineapple upside-down cake is having a genuine moment. Creators are posting dramatic flip reveals with the caramelized pineapple ring tops, often adding maraschino cherries for maximum retro appeal. Some modern twists include using brown butter or adding coconut rum to the caramel. The cast iron skillet version is the most-shared format.",
    "keyIngredients": [
      "Canned pineapple rings",
      "Maraschino cherries",
      "Brown sugar",
      "Butter",
      "Yellow cake mix or flour"
    ],
    "difficulty": 1,
    "prepTime": "50 min",
    "servings": "8",
    "supermarketAngle": "Build a nostalgic baking display in the canned fruit aisle grouping pineapple rings, maraschino cherries, brown sugar, and yellow cake mix with a 'Grandma's Viral Recipe' header card. This is a low-cost, high-impulse bundle with excellent margins on canned goods. Target the display for weekend shoppers through Thursday–Sunday.",
    "storeSection": [
      "Canned Fruit",
      "Baking Aisle"
    ],
    "estimatedCost": "$7–10",
    "weeklyMentions": 1500000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "g001",
    "category": "grocery",
    "name": "Chamberlain Coffee Matcha Powder (& Matcha Category Surge)",
    "tagline": "Matcha mania is emptying shelves nationwide",
    "viralScore": 94,
    "trend": "steady",
    "platforms": [
      "tiktok",
      "instagram",
      "youtube",
      "x"
    ],
    "hashtags": [
      "#MatchaTok",
      "#ChamberlainCoffee",
      "#MatchaLatte",
      "#MatchaEverything"
    ],
    "description": "Matcha demand continues at fever pitch heading into spring. Chamberlain Coffee's grocery-available matcha powder is the most-tagged brand on TikTok, but all matcha SKUs are benefiting. The trend extends beyond lattes into baking (see: matcha cheesecake above), smoothie bowls, and even matcha-infused savory dishes. Spring's green aesthetic is accelerating the trend's visual appeal on Instagram.",
    "keyIngredients": [
      "Matcha powder (any brand)",
      "Oat milk",
      "Vanilla syrup",
      "Ice"
    ],
    "difficulty": 1,
    "prepTime": "5 min",
    "servings": "1",
    "supermarketAngle": "Expand matcha powder shelf space by 2x in both tea and baking sections. Create a secondary display in the refrigerated beverage aisle near oat milks. Stock multiple price tiers — Chamberlain Coffee for the TikTok crowd, Ito En for mid-range, and store brand where available. Consider a 'Matcha Bar' sampling station on weekends. This is the #1 grocery ingredient search term of Q2.",
    "storeSection": [
      "Tea/Coffee",
      "Baking",
      "Refrigerated Beverages"
    ],
    "estimatedCost": "$8–22 (varies by brand/grade)",
    "weeklyMentions": 6200000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "g002",
    "category": "grocery",
    "name": "Bachan's Hot & Spicy Japanese Barbecue Sauce",
    "tagline": "The spicy sequel to America's favorite Japanese BBQ sauce",
    "viralScore": 87,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "instagram",
      "x"
    ],
    "hashtags": [
      "#Bachans",
      "#BachansSpicy",
      "#JapaneseBBQ",
      "#SauceOfTheYear"
    ],
    "description": "Bachan's original was already a cult supermarket favorite, but the Hot & Spicy variant launched in wider grocery distribution this month and is going viral. Creators are using it on everything — grilled proteins, roasted vegetables, rice bowls, even pizza. The brand's 'small batch Japanese American' story continues to resonate, and the spicy version's balanced heat is earning rave reviews across food TikTok.",
    "keyIngredients": [
      "Bachan's Hot & Spicy Japanese Barbecue Sauce"
    ],
    "difficulty": 1,
    "prepTime": "N/A",
    "servings": "N/A",
    "supermarketAngle": "Secure allocation of Bachan's Hot & Spicy immediately and display alongside the original. Place in both the BBQ sauce home set and a secondary display near the meat department. Shelf talkers noting 'Viral on TikTok' will drive trial. This SKU will outperform most new condiment launches this quarter — plan for 3x the velocity of a typical new sauce.",
    "storeSection": [
      "Condiments/Sauces",
      "Meat Department"
    ],
    "estimatedCost": "$6–8",
    "weeklyMentions": 2400000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "g003",
    "category": "grocery",
    "name": "Trader Joe's-Style Frozen Soup Dumplings (Nationwide Dupes)",
    "tagline": "Frozen soup dumplings are the hottest freezer aisle item",
    "viralScore": 91,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "youtube",
      "instagram"
    ],
    "hashtags": [
      "#SoupDumplings",
      "#FrozenDumplings",
      "#XiaoLongBao",
      "#FreezerFinds"
    ],
    "description": "After Trader Joe's soup dumplings became the most viral frozen product of 2025, mainstream brands (Bibigo, Wei Chuan, Din Tai Fung frozen) are seeing explosive demand as non-TJ customers hunt for equivalents. TikTok 'freezer aisle haul' content consistently features soup dumplings as the #1 must-buy item. Air fryer preparation videos showing crispy-bottomed results are adding fuel to the trend.",
    "keyIngredients": [
      "Frozen soup dumplings (any brand)",
      "Soy sauce",
      "Rice vinegar",
      "Chili oil",
      "Fresh ginger"
    ],
    "difficulty": 1,
    "prepTime": "10 min",
    "servings": "2–3",
    "supermarketAngle": "Expand frozen dumpling section and ensure Bibigo, Wei Chuan, and any available soup dumpling SKUs have strong in-stock positions. Create a freezer door cling reading 'Soup Dumplings — As Seen on TikTok.' Cross-merch with a nearby ambient display of soy sauce, chili oil, and rice vinegar. This is the strongest frozen Asian item in two years.",
    "storeSection": [
      "Frozen Foods",
      "International",
      "Condiments"
    ],
    "estimatedCost": "$5–9 per bag",
    "weeklyMentions": 3400000,
    "addedWeek": 15,
    "videos": []
  },
  {
    "id": "g004",
    "category": "grocery",
    "name": "Coconut Water (Fermented & Probiotic Varieties)",
    "tagline": "Fermented coconut water is spring's probiotic darling",
    "viralScore": 80,
    "trend": "rising",
    "platforms": [
      "tiktok",
      "instagram"
    ],
    "hashtags": [
      "#CoconutWater",
      "#GutHealth",
      "#FermentedCoconut",
      "#ProbioticDrink"
    ],
    "description": "The gut health trend has found its spring 2026 hero product: fermented/probiotic coconut water. Brands like Harmless Harvest's probiotic line and newcomer Cocojune are being featured in 'What I Drink in a Day' and 'Gut Reset' content. Creators love the clean ingredient lists and the naturally effervescent quality. Standard coconut water is also benefiting from the halo effect as hydration content surges with warmer weather.",
    "keyIngredients": [
      "Fermented coconut water (Harmless Harvest Probiotic, Cocojune, or Vita Coco Probiotic)"
    ],
    "difficulty": 1,
    "prepTime": "N/A",
    "servings": "1",
    "supermarketAngle": "Expand refrigerated coconut water shelf space and ensure probiotic/fermented varieties are stocked — Harmless Harvest Probiotic is the most-requested. Place secondary displays near produce (smoothie ingredients) and near the front-end coolers for impulse purchase. Shelf tags highlighting 'Probiotic' and 'Gut Health' will capture the wellness shopper. Velocity is up 40%+ week-over-week.",
    "storeSection": [
      "Refrigerated Beverages",
      "Natural/Organic",
      "Front End Coolers"
    ],
    "estimatedCost": "$4–6 per bottle",
    "weeklyMentions": 1700000,
    "addedWeek": 15,
    "videos": []
  }
]

};

// ─────────────────────────────────────────────────────────
//  ARCHIVE: Previous weeks (auto-managed, last 8 weeks)
// ─────────────────────────────────────────────────────────
const ARCHIVE = [
  {
    "weekLabel": "Week of April 6 – April 12, 2026",
    "weekNumber": 15,
    "year": 2026,
    "topItems": [
      "Smashed Cucumber Birria Tacos",
      "Ramp Butter Basted Salmon",
      "Cottage Cheese Flatbread (Baked)",
      "Spicy Miso Caramel Pork Chops",
      "Grandmacore Lemon Poppy Seed Loaf",
      "Black Sesame Burnt Basque Cheesecake"
    ],
    "notes": "Auto-archived on 2026-04-10. Review sales data to add performance notes."
  },
  {
    "weekLabel": "Week of April 7 – 13, 2026",
    "weekNumber": 15,
    "year": 2026,
    "topItems": [
      "Crispy Rice & Spicy Tuna",
      "Marry Me Chicken (Pasta)",
      "Birria Quesatacos",
      "High-Protein Cottage Cheese Bowls",
      "Smash Burger Tacos",
      "Cucumber Salad (Seoul-Style)"
    ],
    "notes": "Auto-archived on 2026-04-10. Review sales data to add performance notes."
  },
  {
    "weekLabel": "Week of March 31 – April 6, 2026",
    "weekNumber": 14,
    "year": 2026,
    "topItems": [
      "Pistachio Everything",
      "Whipped Feta & Greek Cheeses",
      "Pistachio Cream / Spread",
      "Birria Quesatacos",
      "Sourdough Discard Recipes"
    ],
    "notes": "Pistachio cream spread went out-of-stock at multiple locations. Whipped feta drove strong deli sales. Birria kits performed well in meat department."
  },
  {
    "weekLabel": "Week of March 24–30, 2026",
    "weekNumber": 13,
    "year": 2026,
    "topItems": [
      "Birria Quesatacos",
      "Chili Crisp Everything",
      "Sourdough Discard Recipes",
      "Marry Me Chicken",
      "Cottage Cheese Bowls"
    ],
    "notes": "Chili crisp endcap sold through in 4 days. Birria-seasoned beef packs saw 3x velocity. Sourdough starter demand still elevated."
  }
];
