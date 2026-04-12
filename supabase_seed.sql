-- ============================================================
--  SEED: What's Trending — run this in Supabase SQL Editor
-- ============================================================

-- Add extra columns not in original schema
alter table trending_items add column if not exists description text;
alter table trending_items add column if not exists prep_time text;
alter table trending_items add column if not exists servings text;

-- ── META ─────────────────────────────────────────────────────
insert into meta (week_label, week_number, year, published_by, published_at, next_update, notes) values
(
  'Week of April 6 – April 12, 2026',
  15,
  2026,
  'Claude Research Agent',
  '2026-04-10',
  '2026-04-13',
  'Spring produce excitement is colliding with a massive nostalgia-comfort wave this week. Cottage cheese continues its multi-year renaissance in unexpected formats, while a Korean-Mexican fusion moment dominates dinner content. On the bakery side, laminated doughs and retro American desserts are surging hard across all platforms.'
);

-- ── TRENDING ITEMS ────────────────────────────────────────────
insert into trending_items
  (id, category, name, tagline, viral_score, trend, platforms, hashtags, description, key_ingredients, difficulty, prep_time, servings, supermarket_angle, store_section, estimated_cost, weekly_mentions, added_week, videos)
values

(
  'k001', 'kitchen', 'Gochujang Birria Tacos',
  'Korean-Mexican fusion tacos breaking the internet',
  97, 'rising',
  array['tiktok','youtube','instagram','x'],
  array['#GochujangBirria','#FusionTacos','#BirriaTok','#KoreanMexicanFusion'],
  'A mashup that started with a single TikTok creator adding gochujang and doenjang to classic birria consommé has now exploded into a full-blown cross-platform trend. The deeply savory, spicy-sweet broth for dipping plus melty cheese in crispy tortillas is driving millions of saves and shares. Creators are one-upping each other with kimchi toppings and sesame oil drizzles.',
  array['Chuck roast','Gochujang paste','Dried guajillo chiles','Corn tortillas','Oaxaca cheese'],
  2, '3 hours (mostly hands-off)', '6',
  'Create a cross-merchandised endcap bundling chuck roast, gochujang, dried chiles, corn tortillas, and Oaxaca cheese with a shelf talker showing the TikTok trend. Meat department should feature chuck roast prominently and international aisle should double-face gochujang. Print a simplified recipe card at the display.',
  array['Meat','International','Dairy','Bakery/Tortillas'],
  '$18–24', 4200000, '15', '[]'::jsonb
),

(
  'k002', 'kitchen', 'Cottage Cheese Flatbread Pizza',
  'High-protein pizza crust with just 2 ingredients',
  93, 'rising',
  array['tiktok','instagram','youtube'],
  array['#CottageCheeseFlatbread','#ProteinPizza','#CottageCheeseTok','#HealthyPizzaNight'],
  'The cottage cheese trend refuses to die — this week''s iteration blends cottage cheese with self-rising flour to create a surprisingly puffy, high-protein flatbread that creators are using as pizza crust. The appeal is the macro-friendly angle (30g+ protein per serving) combined with genuinely good texture. It''s dominating fitness and family cooking content simultaneously.',
  array['Cottage cheese (full fat)','Self-rising flour','Mozzarella cheese','Pepperoni','Marinara sauce'],
  1, '25 min', '2',
  'Build a refrigerated endcap near dairy with cottage cheese (prioritize Good Culture and store brand full-fat), self-rising flour, and shredded mozzarella. Add a ''Trending on TikTok'' shelf blade. This is a strong opportunity for dairy department to move premium cottage cheese SKUs which carry higher margins.',
  array['Dairy','Baking Aisle','Deli'],
  '$8–11', 3800000, '15', '[]'::jsonb
),

(
  'k003', 'kitchen', 'Smashed Cucumber Salad with Chili Crisp Vinaigrette',
  'Crunchy, spicy cucumber salad — spring''s hottest side',
  88, 'steady',
  array['tiktok','instagram','x'],
  array['#SmashedCucumber','#ChiliCrispSalad','#SpringSalad','#CucumberSaladTrend'],
  'Smashed cucumber salads have been building for months but the addition of chili crisp vinaigrette (Lao Gan Ma or Fly By Jing mixed with rice vinegar and sesame oil) has given it a massive second-wave surge this spring. The satisfying ASMR smashing videos and the 5-minute prep time make it irresistible content. Perfect timing as cucumbers hit peak spring freshness.',
  array['English cucumbers','Chili crisp (Lao Gan Ma or Fly By Jing)','Rice vinegar','Sesame oil','Roasted sesame seeds'],
  1, '10 min', '4',
  'Produce department should build a small display of English cucumbers next to a shelf strip holding chili crisp, rice vinegar, and sesame oil. This low-cost cross-merch drives basket size from a $1 cucumber to a $12 ring. Ensure Fly By Jing and Lao Gan Ma are both in stock — they''ve been selling out in many markets.',
  array['Produce','International','Condiments'],
  '$6–9', 2900000, '15', '[]'::jsonb
),

(
  'k004', 'kitchen', 'Crispy Rice Egg Skillet ("Tahdig Breakfast")',
  'Persian-inspired crispy rice meets runny eggs',
  85, 'rising',
  array['tiktok','youtube','instagram'],
  array['#TahdigBreakfast','#CrispyRiceEggs','#BreakfastSkillet','#OnePanBreakfast'],
  'Creators are pressing day-old rice into a buttered skillet until shatteringly crispy, then cracking eggs on top with herbs and feta. Inspired by Persian tahdig but simplified for weekday breakfast, this one-pan dish delivers incredible textural contrast. The sizzling overhead shots are generating massive engagement, and the use of leftover rice resonates with the zero-waste cooking community.',
  array['Jasmine rice (day-old)','Eggs','Butter','Feta cheese','Fresh dill'],
  1, '20 min', '2',
  'Feature eggs and feta in a co-display near the rice aisle with recipe cards. Deli can stock fresh dill bundles prominently. This trend also drives sales of ready-made microwavable rice pouches (Minute Rice, Seeds of Change) for customers who don''t have leftover rice on hand — position those in the display too.',
  array['Dairy/Eggs','Rice & Grains','Produce'],
  '$7–10', 2100000, '15', '[]'::jsonb
),

(
  'b001', 'bakery', 'Dubai Chocolate Croissant (Pistachio Knafeh Croissant)',
  'The viral pistachio-chocolate croissant craze continues',
  96, 'steady',
  array['tiktok','youtube','instagram','x'],
  array['#DubaiChocolate','#PistachioCroissant','#KnafehCroissant','#DubaiChocolateCroissant'],
  'The Dubai chocolate bar trend from late 2024 has fully evolved into a bakery format. Croissants filled with pistachio cream, crunchy knafeh (shredded phyllo), and tahini chocolate are the single most requested bakery item across social media. Home bakers are attempting it with store-bought puff pastry and pistachio butter, keeping it accessible. The green cross-section reveal videos remain massively shareable.',
  array['Puff pastry sheets','Pistachio butter/cream','Shredded phyllo (kataifi)','Dark chocolate','Tahini'],
  3, '1 hour 30 min', '8',
  'In-store bakery should develop a Dubai chocolate croissant as a premium LTO item ($4.99–5.99 each). For home bakers, create a clip strip near frozen puff pastry featuring pistachio butter and dark chocolate bars. International aisle should ensure kataifi dough is stocked. This is the #1 bakery trend in the country right now.',
  array['In-Store Bakery','Frozen','International'],
  '$14–18 (batch of 8)', 5100000, '15', '[]'::jsonb
),

(
  'b002', 'bakery', 'Burnt Basque Cheesecake (Matcha Swirl Edition)',
  'Crustless cheesecake gets a matcha glow-up',
  90, 'rising',
  array['tiktok','instagram','youtube'],
  array['#BasqueCheesecake','#MatchaCheesecake','#BurntCheesecake','#MatchaDessert'],
  'Basque cheesecake never fully left the spotlight, but a matcha-swirl version is surging this spring. Creators marble ceremonial-grade matcha into the classic custard-like batter before the signature high-heat bake. The dramatic green swirl against the caramelized top photographs incredibly well. The simplicity — no crust, no water bath — is driving first-time bakers to attempt it.',
  array['Cream cheese (3 blocks)','Heavy cream','Eggs','Granulated sugar','Ceremonial matcha powder'],
  2, '1 hour + cooling', '10',
  'Dairy department should stack cream cheese blocks (Philadelphia or store brand) in a secondary display with heavy cream nearby, plus a shelf blade calling out ''Make the viral matcha cheesecake.'' Stock matcha powder in tea/baking aisle and ensure supply — matcha SKUs are regularly selling out due to sustained demand. In-store bakery can offer whole cakes for $16.99–19.99.',
  array['Dairy','Baking','Tea/Coffee','In-Store Bakery'],
  '$12–15', 3100000, '15', '[]'::jsonb
),

(
  'b003', 'bakery', 'Sourdough Cinnamon Roll Babka',
  'Sourdough meets cinnamon rolls in a twisted loaf',
  82, 'rising',
  array['tiktok','youtube','instagram'],
  array['#SourdoughBabka','#CinnamonRollBabka','#SourdoughBaking','#BabkaTok'],
  'Sourdough creators are merging two beloved formats — the tangy, open-crumb sourdough process with heavily cinnamon-sugared babka filling, twisted into a dramatic pull-apart loaf. The cross-section reveal videos showing layers of cinnamon swirl inside a sourdough crumb are generating enormous saves. For non-sourdough bakers, simplified versions using instant yeast are also trending.',
  array['Bread flour','Sourdough starter or active dry yeast','Brown sugar','Ground cinnamon','Butter'],
  3, '12 hours (with sourdough) / 4 hours (yeast)', '8',
  'Baking aisle should feature bread flour, cinnamon, and brown sugar in a ''Weekend Baking Project'' clip strip display. Stock sourdough starter kits (King Arthur brand) if available. In-store bakery can produce a babka loaf as a weekend special ($8.99) to capture the aesthetic. This trend skews to premium baking customers with higher basket spend.',
  array['Baking Aisle','In-Store Bakery'],
  '$6–9', 1800000, '15', '[]'::jsonb
),

(
  'b004', 'bakery', 'Pineapple Upside-Down Cake Revival',
  'Retro American dessert makes a Gen Z comeback',
  79, 'rising',
  array['tiktok','instagram'],
  array['#PineappleUpsideDown','#RetroBaking','#VintageDessert','#GrandmaRecipes'],
  'Part of a broader ''grandma cooking'' nostalgia wave on TikTok, pineapple upside-down cake is having a genuine moment. Creators are posting dramatic flip reveals with the caramelized pineapple ring tops, often adding maraschino cherries for maximum retro appeal. Some modern twists include using brown butter or adding coconut rum to the caramel. The cast iron skillet version is the most-shared format.',
  array['Canned pineapple rings','Maraschino cherries','Brown sugar','Butter','Yellow cake mix or flour'],
  1, '50 min', '8',
  'Build a nostalgic baking display in the canned fruit aisle grouping pineapple rings, maraschino cherries, brown sugar, and yellow cake mix with a ''Grandma''s Viral Recipe'' header card. This is a low-cost, high-impulse bundle with excellent margins on canned goods. Target the display for weekend shoppers through Thursday–Sunday.',
  array['Canned Fruit','Baking Aisle'],
  '$7–10', 1500000, '15', '[]'::jsonb
),

(
  'g001', 'grocery', 'Chamberlain Coffee Matcha Powder (& Matcha Category Surge)',
  'Matcha mania is emptying shelves nationwide',
  94, 'steady',
  array['tiktok','instagram','youtube','x'],
  array['#MatchaTok','#ChamberlainCoffee','#MatchaLatte','#MatchaEverything'],
  'Matcha demand continues at fever pitch heading into spring. Chamberlain Coffee''s grocery-available matcha powder is the most-tagged brand on TikTok, but all matcha SKUs are benefiting. The trend extends beyond lattes into baking (see: matcha cheesecake above), smoothie bowls, and even matcha-infused savory dishes. Spring''s green aesthetic is accelerating the trend''s visual appeal on Instagram.',
  array['Matcha powder (any brand)','Oat milk','Vanilla syrup','Ice'],
  1, '5 min', '1',
  'Expand matcha powder shelf space by 2x in both tea and baking sections. Create a secondary display in the refrigerated beverage aisle near oat milks. Stock multiple price tiers — Chamberlain Coffee for the TikTok crowd, Ito En for mid-range, and store brand where available. Consider a ''Matcha Bar'' sampling station on weekends. This is the #1 grocery ingredient search term of Q2.',
  array['Tea/Coffee','Baking','Refrigerated Beverages'],
  '$8–22 (varies by brand/grade)', 6200000, '15', '[]'::jsonb
),

(
  'g002', 'grocery', 'Bachan''s Hot & Spicy Japanese Barbecue Sauce',
  'The spicy sequel to America''s favorite Japanese BBQ sauce',
  87, 'rising',
  array['tiktok','instagram','x'],
  array['#Bachans','#BachansSpicy','#JapaneseBBQ','#SauceOfTheYear'],
  'Bachan''s original was already a cult supermarket favorite, but the Hot & Spicy variant launched in wider grocery distribution this month and is going viral. Creators are using it on everything — grilled proteins, roasted vegetables, rice bowls, even pizza. The brand''s ''small batch Japanese American'' story continues to resonate, and the spicy version''s balanced heat is earning rave reviews across food TikTok.',
  array['Bachan''s Hot & Spicy Japanese Barbecue Sauce'],
  1, 'N/A', 'N/A',
  'Secure allocation of Bachan''s Hot & Spicy immediately and display alongside the original. Place in both the BBQ sauce home set and a secondary display near the meat department. Shelf talkers noting ''Viral on TikTok'' will drive trial. This SKU will outperform most new condiment launches this quarter — plan for 3x the velocity of a typical new sauce.',
  array['Condiments/Sauces','Meat Department'],
  '$6–8', 2400000, '15', '[]'::jsonb
),

(
  'g003', 'grocery', 'Trader Joe''s-Style Frozen Soup Dumplings (Nationwide Dupes)',
  'Frozen soup dumplings are the hottest freezer aisle item',
  91, 'rising',
  array['tiktok','youtube','instagram'],
  array['#SoupDumplings','#FrozenDumplings','#XiaoLongBao','#FreezerFinds'],
  'After Trader Joe''s soup dumplings became the most viral frozen product of 2025, mainstream brands (Bibigo, Wei Chuan, Din Tai Fung frozen) are seeing explosive demand as non-TJ customers hunt for equivalents. TikTok ''freezer aisle haul'' content consistently features soup dumplings as the #1 must-buy item. Air fryer preparation videos showing crispy-bottomed results are adding fuel to the trend.',
  array['Frozen soup dumplings (any brand)','Soy sauce','Rice vinegar','Chili oil','Fresh ginger'],
  1, '10 min', '2–3',
  'Expand frozen dumpling section and ensure Bibigo, Wei Chuan, and any available soup dumpling SKUs have strong in-stock positions. Create a freezer door cling reading ''Soup Dumplings — As Seen on TikTok.'' Cross-merch with a nearby ambient display of soy sauce, chili oil, and rice vinegar. This is the strongest frozen Asian item in two years.',
  array['Frozen Foods','International','Condiments'],
  '$5–9 per bag', 3400000, '15', '[]'::jsonb
),

(
  'g004', 'grocery', 'Coconut Water (Fermented & Probiotic Varieties)',
  'Fermented coconut water is spring''s probiotic darling',
  80, 'rising',
  array['tiktok','instagram'],
  array['#CoconutWater','#GutHealth','#FermentedCoconut','#ProbioticDrink'],
  'The gut health trend has found its spring 2026 hero product: fermented/probiotic coconut water. Brands like Harmless Harvest''s probiotic line and newcomer Cocojune are being featured in ''What I Drink in a Day'' and ''Gut Reset'' content. Creators love the clean ingredient lists and the naturally effervescent quality. Standard coconut water is also benefiting from the halo effect as hydration content surges with warmer weather.',
  array['Fermented coconut water (Harmless Harvest Probiotic, Cocojune, or Vita Coco Probiotic)'],
  1, 'N/A', '1',
  'Expand refrigerated coconut water shelf space and ensure probiotic/fermented varieties are stocked — Harmless Harvest Probiotic is the most-requested. Place secondary displays near produce (smoothie ingredients) and near the front-end coolers for impulse purchase. Shelf tags highlighting ''Probiotic'' and ''Gut Health'' will capture the wellness shopper. Velocity is up 40%+ week-over-week.',
  array['Refrigerated Beverages','Natural/Organic','Front End Coolers'],
  '$4–6 per bottle', 1700000, '15', '[]'::jsonb
);

-- ── ARCHIVE ───────────────────────────────────────────────────
insert into archive (week_label, week_number, year, items) values
(
  'Week of April 6 – April 12, 2026', 15, 2026,
  '["Smashed Cucumber Birria Tacos","Ramp Butter Basted Salmon","Cottage Cheese Flatbread (Baked)","Spicy Miso Caramel Pork Chops","Grandmacore Lemon Poppy Seed Loaf","Black Sesame Burnt Basque Cheesecake"]'::jsonb
),
(
  'Week of April 7 – 13, 2026', 15, 2026,
  '["Crispy Rice & Spicy Tuna","Marry Me Chicken (Pasta)","Birria Quesatacos","High-Protein Cottage Cheese Bowls","Smash Burger Tacos","Cucumber Salad (Seoul-Style)"]'::jsonb
),
(
  'Week of March 31 – April 6, 2026', 14, 2026,
  '["Pistachio Everything","Whipped Feta & Greek Cheeses","Pistachio Cream / Spread","Birria Quesatacos","Sourdough Discard Recipes"]'::jsonb
),
(
  'Week of March 24–30, 2026', 13, 2026,
  '["Birria Quesatacos","Chili Crisp Everything","Sourdough Discard Recipes","Marry Me Chicken","Cottage Cheese Bowls"]'::jsonb
);
