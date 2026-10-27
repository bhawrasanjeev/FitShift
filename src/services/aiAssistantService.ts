import { OnboardingData, ChatMessage, SuggestedPromptCategory } from '../types';

export const SUGGESTED_PROMPT_CATEGORIES: SuggestedPromptCategory[] = [
  {
    id: 'workout',
    categoryName: 'Workout Help',
    prompts: [
      'How can I build a workout routine in 30 minutes?',
      'What can I do instead of bench press at home?',
      'How should a beginner structure a gym workout?',
    ],
  },
  {
    id: 'nutrition',
    categoryName: 'Indian Nutrition',
    prompts: [
      'What are affordable vegetarian protein sources?',
      'How can I increase my protein intake without whey?',
      'Suggest a budget-friendly, high-protein Indian breakfast.',
    ],
  },
  {
    id: 'supplements',
    categoryName: 'Supplements',
    prompts: [
      'Do I actually need protein powder?',
      'What are food-based alternatives to protein supplements?',
      'What should I consider before taking creatine?',
    ],
  },
  {
    id: 'lifestyle',
    categoryName: 'Lifestyle & Recovery',
    prompts: [
      'How can I fit workouts around college?',
      'What can I do when I feel too tired for my usual workout?',
      'How can I improve my sleep routine?',
    ],
  },
  {
    id: 'plan',
    categoryName: 'Understanding My Plan',
    prompts: [
      'Why was this workout recommended?',
      'Explain the nutrition in my meal plan.',
      'Suggest a cheaper alternative to one of my meals.',
    ],
  },
];

export async function generateAIResponse(
  userQuery: string,
  usePlanContext: boolean,
  userProfile?: OnboardingData
): Promise<Omit<ChatMessage, 'id' | 'timestamp'>> {
  // Simulate realistic network delay (750ms)
  await new Promise((resolve) => setTimeout(resolve, 750));

  const query = userQuery.toLowerCase().trim();
  const ctx = usePlanContext && userProfile ? userProfile : undefined;

  // Context summaries
  const dietLabel = ctx?.food.dietType === 'pure_veg' ? 'Pure Vegetarian' : ctx?.food.dietType === 'eggetarian' ? 'Eggetarian' : 'Non-Vegetarian';
  const envLabel = ctx?.training.environment === 'home' ? 'Home' : 'Gym';
  const durationLabel = `${ctx?.training.durationMinutes || 45} minutes`;
  const budgetLabel = `₹${ctx?.budget.dailyBudgetRupees || 65}/day`;
  const goalLabel = ctx?.personal.goal.replace('_', ' ') || 'fitness';

  // Helper context payload
  const contextUsed = ctx
    ? {
        goal: ctx.personal.goal,
        environment: ctx.training.environment,
        diet: ctx.food.dietType,
        dailyBudget: ctx.budget.dailyBudgetRupees,
        durationMinutes: ctx.training.durationMinutes,
      }
    : undefined;

  // 1. Bench press alternative at home
  if (query.includes('bench press') || query.includes('instead of bench') || query.includes('chest at home')) {
    return {
      role: 'assistant',
      content: `### Home Chest Substitutes for the Bench Press

When training at home without a flat bench or barbell, the key is matching the horizontal pressing movement and chest tension through mechanical leverage:

1. **Controlled Tempo Push-Ups (Deficit)**
   * **Setup:** Place hands elevated on two thick books or sturdy blocks to allow your sternum to sink 1–2 inches below hand level.
   * **Cadence:** Lower down over 3 seconds, pause for 1 second at full chest stretch, and push up explosively.
   * **Why it works:** The slow negative phase compensates for the lack of heavy external iron plates.

2. **Dumbbell Floor Press**
   * **Setup:** Lie flat on your yoga mat with knees bent. Hold dumbbells over your chest with triceps resting lightly on the carpet.
   * **Advantage:** Prevents excessive shoulder hyperextension while allowing progressive overloading with dumbbells.

3. **Incline Feet-Elevated Push-Ups**
   * Place your feet on a bed, chair, or sofa edge. This angles the mechanical load directly onto your upper pectoral fibers (clavicular head).

${ctx ? `*Note for your plan:* In your active **${envLabel}** split, FitShift has mapped **Controlled Tempo Push-Ups** directly as the primary horizontal press.` : ''}`,
      actionLink: {
        label: 'View Current Chest Exercises',
        tab: 'workout',
      },
      followUps: [
        'How many sets and reps should I do for push-ups?',
        'What can I do for upper back posture at home?',
        'Suggest a high-protein post-workout Indian snack.',
      ],
      contextUsed,
    };
  }

  // 2. 30-minute workout routine
  if (query.includes('30 minute') || query.includes('30-minute') || query.includes('build a workout routine in 30')) {
    return {
      role: 'assistant',
      content: `### Structuring an Effective 30-Minute Routine

You don't need 90 minutes in the gym to make steady strength gains. A high-density 30-minute session works best with **agonist-antagonist compound supersets**:

#### The 30-Minute Blueprint
* **Warm-up (4 mins):** Dynamic arm circles, leg swings, deep squat hold, and cat-cow spinal waves.
* **Block A (14 mins — 3 Sets):**
  * Movement 1: Lower body compound (Goblet Squats or Bulgarian Split Squats) — 10 reps
  * *Rest 30 seconds*
  * Movement 2: Upper body push (Push-ups or Dumbbell Press) — 10–12 reps
  * *Rest 60 seconds and repeat*
* **Block B (10 mins — 3 Sets):**
  * Movement 1: Upper body pull (Doorway Band Pulldown or Dumbbell Row) — 10–12 reps
  * *Rest 30 seconds*
  * Movement 2: Core stability (Hollow Body Hold or Plank with reach) — 30–45s
* **Cool-down (2 mins):** Deep diaphragmatic breathing and chest decompression.

${ctx ? `*Tailored for you:* You are currently set to **${durationLabel}** sessions in a **${envLabel}** environment. You can easily adjust your session duration to 30 mins in Plan Settings without sacrificing volume.` : ''}`,
      actionLink: {
        label: 'Adjust Duration in Settings',
        tab: 'workout',
      },
      followUps: [
        'What are the best warm-up stretches?',
        'Can I gain muscle with only 30 minutes a day?',
        'How many days per week is ideal?',
      ],
      contextUsed,
    };
  }

  // 3. Beginner gym workout structure
  if (query.includes('beginner') && (query.includes('gym') || query.includes('structure'))) {
    return {
      role: 'assistant',
      content: `### How a Beginner Should Structure a Gym Workout

For beginners, the priority is **neuromuscular coordination and movement pattern mastery**, not lifting to muscular failure or doing 20 random machines:

* **Stick to the 4 Foundational Patterns:**
  1. **Squat / Knee Flexion:** Goblet squats or leg press.
  2. **Hinge:** Dumbbell Romanian deadlifts.
  3. **Push:** Seated chest press machine or dumbbell flat press.
  4. **Pull:** Lat pulldown or chest-supported cable row.
* **Set and Rep Range:**
  * 3 working sets of 8–10 controlled repetitions per movement.
  * Stop each set when you still have 2 clean repetitions in reserve (RIR 2).
* **Rest Periods:**
  * Take a full 60–90 seconds between sets to allow cellular ATP regeneration.

${ctx ? `*Context Applied:* Your current fitness experience is logged as **${ctx.training.experienceLevel.toUpperCase()}**. FitShift avoids excessive junk volume so you stay injury-free.` : ''}`,
      actionLink: {
        label: 'View Your Weekly Workout Split',
        tab: 'workout',
      },
      followUps: [
        'How many days a week should a beginner lift?',
        'What should I eat before going to the gym?',
        'How do I track progressive overload?',
      ],
      contextUsed,
    };
  }

  // 4. Affordable vegetarian protein sources / without whey
  if (query.includes('vegetarian protein') || query.includes('without whey') || query.includes('affordable protein') || query.includes('increase my protein intake')) {
    return {
      role: 'assistant',
      content: `### Affordable Indian High-Protein Staples (Zero Whey Required)

You do not need costly imported protein powders to meet your daily targets. These common Indian kitchen staples provide excellent amino acid density per rupee:

| Food Source | Serving Size | Approx Protein | Est. Cost | Kitchen Tip |
| :--- | :--- | :--- | :--- | :--- |
| **Chana Sattu** | 40g (2 heaped tbsp) | ~9g | ₹6 | Whisk into cold salted buttermilk (chaas) for instant breakfast |
| **Soya Chunks** | 50g dry | ~26g | ₹8 | Boil with salt, squeeze firmly, toss in pulao or dry sabzi |
| **Kala Chana (Desi)** | 80g dry | ~16g | ₹7 | Soak overnight, boil for savory lemon-chaat or curry |
| **Fresh Curd (Dahi)** | 150g (1 bowl) | ~6g | ₹12 | Natural probiotics and slow-digesting casein |
| **Paneer** | 80g | ~15g | ₹28 | Sauté with capsicum or crumble into bhurji |
| **Yellow Moong Dal** | 60g dry | ~14g | ₹8 | Combine with rice or roti for complete amino acid pairing |

${ctx ? `*Aligned with your budget:* On your **${budgetLabel}** tier (${dietLabel}), a daily combination of Sattu chaas + Kala Chana curry + Soya chunks easily supplies **75–90g of protein** under your spending limit!` : ''}`,
      actionLink: {
        label: 'Review Meal Plan & Recipes',
        tab: 'diet',
      },
      followUps: [
        'Suggest a budget-friendly, high-protein Indian breakfast.',
        'Do soya chunks increase estrogen or uric acid?',
        'Can I meet protein goals on a hostel mess diet?',
      ],
      contextUsed,
    };
  }

  // 5. Budget-friendly high-protein Indian breakfast
  if (query.includes('breakfast') || query.includes('morning meal') || query.includes('high-protein breakfast')) {
    const isNonVeg = ctx?.food.dietType === 'non_veg';
    const isEggetarian = ctx?.food.dietType === 'eggetarian';

    return {
      role: 'assistant',
      content: `### High-Protein Indian Breakfast Ideas Under ₹35

Here are three time-tested, budget-friendly morning meals that take under 10 minutes to prepare:

1. **Bihar Sattu Buttermilk & Sprouted Moong Chaat (~22g Protein | ~₹24)**
   * Whisk 40g roasted Chana Sattu into 200ml cold spiced buttermilk with roasted jeera and black salt.
   * Pair with 50g steamed sprouted green moong topped with lemon and chopped tomatoes.
   * *Why it works:* Zero cooking required; perfect for busy mornings or hostel rooms.

2. **Besan & Crumbled Paneer Chilla (~19g Protein | ~₹32)**
   * Mix 50g gram flour (besan) with water, turmeric, and ajwain to form a light batter.
   * Cook like a thin dosa, stuffing the center with 50g grated paneer and chopped coriander.

${(isNonVeg || isEggetarian) ? `3. **Masala Boiled Eggs & Whole Wheat Toast (~20g Protein | ~₹26)**
   * 3 boiled eggs (2 whole + 1 white) tossed in chaat masala, served with 2 toasted phulkas and black tea.` : `3. **Warm Peanut & Milk Oatmeal (~17g Protein | ~₹22)**
   * 50g rolled oats cooked in 250ml toned milk, topped with 20g dry roasted peanuts for natural crunch and healthy fats.`}

${ctx ? `*Customized for you:* Your diet is set to **${dietLabel}** with **${ctx.food.cookingSituation.replace('_', ' ')}** access.` : ''}`,
      actionLink: {
        label: 'View Today’s Breakfast Plan',
        tab: 'diet',
      },
      followUps: [
        'How can I prepare sprouts quickly at home?',
        'What should I eat 30 minutes before working out?',
        'Is raw sattu healthy to drink every day?',
      ],
      contextUsed,
    };
  }

  // 6. Protein powder / Do I need supplements
  if (query.includes('protein powder') || query.includes('need supplements') || query.includes('do i actually need')) {
    return {
      role: 'assistant',
      content: `### Do You Actually Need Protein Powder?

**Short answer: No.** Protein powder is a convenience food, not an anabolic requirement or magical shortcut.

#### When Protein Powder Is Useful:
* When your work schedule or travel leaves no time to cook whole foods.
* When you find it difficult to eat enough solid food volume to hit your daily target.
* In strict hostel environments where protein foods are not served in the mess.

#### When You Don't Need It:
* If you can comfortably eat whole foods like Sattu, Kala Chana, Paneer, Dal, Dahi, or Eggs.
* If purchasing whey powder strains your monthly personal or student budget.

#### Honest Cost Comparison:
* **1 Scoop of Whey Protein (24g protein):** ~₹80 to ₹110 per serving.
* **40g Sattu + 100g Curd (20g protein):** ~₹18 to ₹24 per serving.
* Whole foods also provide dietary fiber, potassium, calcium, and digestive satiety that isolated powders lack.

${ctx ? `*Your Stance:* Your profile currently selects **${ctx.supplements.preference === 'no_supplements' ? 'Food-First Nutrition (No Supplements)' : 'Open to Supplements'}**. FitShift keeps your plan 100% whole-food powered by default.` : ''}`,
      actionLink: {
        label: 'View Supplement Guidance',
        tab: 'supplements',
      },
      followUps: [
        'What are food-based alternatives to protein supplements?',
        'What should I consider before taking creatine?',
        'How much protein do I need per kilogram of body weight?',
      ],
      contextUsed,
    };
  }

  // 7. Creatine considerations
  if (query.includes('creatine') || query.includes('taking creatine')) {
    return {
      role: 'assistant',
      content: `### What to Consider Before Taking Creatine Monohydrate

Creatine Monohydrate is one of the most researched and clinically supported sports performance aids in existence, but it is important to understand how it functions:

1. **How It Works:**
   * It increases intramuscular phosphocreatine stores, allowing your cells to rapidly regenerate ATP (cellular energy) during heavy, explosive lifts.
2. **Standard Protocol:**
   * **Dose:** 3g to 5g daily of pure Creatine Monohydrate (Creapure or 200 Mesh).
   * **Timing:** Consistency matters more than timing. Take it daily with warm water, buttermilk, or after a meal.
   * **Loading Phase:** Not required. Taking 3g daily will naturally saturate muscle stores within 3 to 4 weeks with minimal stomach discomfort.
3. **Important Cautions:**
   * **Hydration:** Creatine draws intracellular water into muscle cells. Ensure you drink 2.5 to 3.5 liters of water daily.
   * **Pre-existing Kidney Issues:** Those with diagnosed renal conditions should always consult a physician before supplementing.
   * **Budget Check:** Pure unflavoured creatine monohydrate costs ~₹500–₹700 for a 2-month supply (approx ₹10/day). Avoid expensive flavored branded blends.`,
      actionLink: {
        label: 'View Evidence-Backed Supplements',
        tab: 'supplements',
      },
      followUps: [
        'Does creatine cause hair loss or bloating?',
        'Do I need to cycle off creatine?',
        'Do I need protein powder?',
      ],
      contextUsed,
    };
  }

  // 8. Too tired for usual workout / Late / tired today
  if (query.includes('tired') || query.includes('exhausted') || query.includes('too tired') || query.includes('low energy')) {
    return {
      role: 'assistant',
      content: `### What to Do When You Feel Too Tired to Work Out

Fatigue is communication from your nervous system. Forcing personal records when emotionally or physically drained often leads to form breakdowns and poor recovery.

#### Your 3 Options:

1. **Activate the 15-Minute FitShift Decompression (Recommended)**
   * Swap heavy lifts for 15 minutes of gentle spinal mobility:
     * Cat-Cow spinal breathing (2 sets × 8 reps)
     * Isometric Glute Bridges (2 sets × 30s)
     * Doorframe chest posture release (2 sets × 45s)
   * This maintains your movement habit without taxing your adrenal system.

2. **The 5-Minute Rule**
   * Put on your workout clothes and warm up for just 5 minutes. If you still feel genuinely exhausted, stop guilt-free and rest. Usually, light blood flow revitalizes your energy.

3. **Rest & Earlier Bedtime**
   * If you slept fewer than 6 hours last night, sleep is your highest-yield anabolic activity today. Shift bedtime forward by 45 minutes.

${ctx ? `*Quick Action:* You can click **"Late / Tired Today?"** right on your dashboard to instantly activate today's low-intensity plan.` : ''}`,
      actionLink: {
        label: 'Open Late / Tired Adaptive Mode',
        tab: 'overview',
      },
      followUps: [
        'How can I improve my sleep routine?',
        'Does missing one workout hurt my muscle progress?',
        'What should I eat when I have low energy?',
      ],
      contextUsed,
    };
  }

  // 9. College or busy work schedule
  if (query.includes('college') || query.includes('work') || query.includes('busy') || query.includes('fit workouts around')) {
    return {
      role: 'assistant',
      content: `### Fitting Fitness Around a Demanding Study or Work Routine

Consistency comes from removing friction, not relying on willpower:

* **Anchor Workouts to Existing Habits:**
  * If you leave at ${ctx?.rhythm.departureTime || '8:30 AM'}, do a 30-minute home session at 7:00 AM before showering. You never have to negotiate with evening tiredness.
* **Keep Sessions Short:**
  * 30–45 focused minutes 4 days per week outperforms erratic 90-minute weekend marathons.
* **Master the No-Cook Hostel/Office Protein Add-ons:**
  * Keep roasted chana, peanuts, or sattu powder at your desk. They need no refrigeration and beat vending machine snacks.
* **Walk During Commute Calls:**
  * Use 15 minutes of transit or phone calls to hit 4,000–6,000 non-exercise steps daily.

${ctx ? `*Your Schedule Anchor:* Your departure is logged at **${ctx.rhythm.departureTime}** and return at **${ctx.rhythm.returnTime}**. Your 24-hr timetable has mapped your training block to avoid commute congestion.` : ''}`,
      actionLink: {
        label: 'View Your 24-Hour Rhythm',
        tab: 'schedule',
      },
      followUps: [
        'How can I build a workout routine in 30 minutes?',
        'How can I improve my sleep routine?',
        'Suggest a budget-friendly, high-protein Indian breakfast.',
      ],
      contextUsed,
    };
  }

  // 10. Sleep routine improvement
  if (query.includes('sleep') || query.includes('insomnia') || query.includes('wake up tired')) {
    return {
      role: 'assistant',
      content: `### Restoring Deep, Anabolic Sleep

Growth hormone release and central nervous system repair peak during deep slow-wave sleep. If sleep is compromised, fat loss slows down and cortisol stays elevated:

1. **Manage Evening Screen Lighting:**
   * Blue light from phones suppresses melatonin synthesis. Switch devices to night-shift amber mode at 9:00 PM or put phone face-down 30 minutes before sleep.
2. **Cool & Dark Sleep Environment:**
   * Body temperature must drop by 1°C to initiate sleep. Keep the bedroom ventilated and as dark as possible.
3. **Dinner Timing:**
   * Finish dinner at least 2 hours before bed so blood flow is not diverted solely to heavy digestion while lying down.
4. **Natural Magnesium & Electrolytes:**
   * A warm cup of milk or a sprinkle of Himalayan rock salt in water helps relax restless leg muscles.

${ctx ? `*Context:* Your average sleep duration is currently logged at **${ctx.rhythm.sleepHours} hours**. Aiming for a consistent wake time of **${ctx.rhythm.wakeUpTime}** will anchor your circadian clock.` : ''}`,
      actionLink: {
        label: 'View Recovery & Sleep Guidance',
        tab: 'recovery',
      },
      followUps: [
        'What can I do when I feel too tired for my usual workout?',
        'What should I eat for dinner to sleep better?',
        'Why was this workout recommended?',
      ],
      contextUsed,
    };
  }

  // 11. Understanding My Plan / Why recommended
  if (query.includes('why was this workout recommended') || query.includes('why recommended') || query.includes('explain my plan')) {
    return {
      role: 'assistant',
      content: `### Why Your FitShift Plan Was Built This Way

Your plan is deterministically configured based on your lifestyle constraints rather than generic fitness dogma:

1. **Training Environment (${envLabel}):**
   * ${ctx?.training.environment === 'home' 
     ? 'Configured for bodyweight calisthenics, bands, and dumbbells so you never waste time commuting to a crowded commercial gym.' 
     : 'Takes advantage of cable stations, squat racks, and barbell loading for progressive mechanical tension.'}
2. **Volume & Session Length (${durationLabel}):**
   * Calibrated to provide optimal weekly stimulus without triggering extreme muscle soreness that interferes with your ${ctx?.rhythm.occupation.replace('_', ' ') || 'daily work'}.
3. **Diet Architecture (${dietLabel} • ${budgetLabel}):**
   * Built around accessible Indian staples (Sattu, Kala Chana, Moong Dal, Curd, Soya) to hit realistic protein targets without inflating your grocery bills.
4. **Planned Rest Days:**
   * Essential recovery days ensure muscle protein synthesis repairs damaged tissue before your next session.`,
      actionLink: {
        label: 'View Plan Overview',
        tab: 'overview',
      },
      followUps: [
        'Explain the nutrition in my meal plan.',
        'Suggest a cheaper alternative to one of my meals.',
        'How can I build a workout routine in 30 minutes?',
      ],
      contextUsed,
    };
  }

  // 12. Explain the nutrition in my meal plan
  if (query.includes('explain the nutrition') || query.includes('nutrition in my meal plan') || query.includes('macros')) {
    return {
      role: 'assistant',
      content: `### The Nutritional Philosophy Behind Your Meals

Your daily meal structure follows three practical rules:

1. **Distributed Protein (Every 3–4 Hours):**
   * Muscle protein synthesis responds best when 20–30g of protein is delivered across spaced meals rather than a single giant dinner.
2. **Whole Carbohydrates as Fuel:**
   * Rotis (whole wheat chakki atta), brown/white rice, and lentils supply complex glycogen to power your training sessions.
3. **Digestive Gut Health:**
   * Daily dahi (curd), yellow moong dal, and cooling salads ensure your gastrointestinal tract comfortably absorbs nutrients without bloating.

${ctx ? `*Summary for your profile:* Your plan is optimized for **${goalLabel}** with approximately **~75–95g of daily protein** on a **${budgetLabel}** budget.` : ''}`,
      actionLink: {
        label: 'Explore Today’s Meals',
        tab: 'diet',
      },
      followUps: [
        'Suggest a cheaper alternative to one of my meals.',
        'What are affordable vegetarian protein sources?',
        'Do I actually need protein powder?',
      ],
      contextUsed,
    };
  }

  // 13. Cheaper alternative to one of my meals
  if (query.includes('cheaper') || query.includes('cheaper alternative') || query.includes('reduce meal cost')) {
    return {
      role: 'assistant',
      content: `### How to Reduce Daily Meal Costs in Your Plan

If you want to trim your food spend while keeping protein high, use these smart swaps:

* **Swap Paneer for Soya Chunks:**
  * 100g Paneer costs ~₹40 (18g protein).
  * 40g Soya Chunks costs ~₹7 (21g protein).
  * *Savings:* ~₹33 per meal with higher protein density!
* **Swap Packaged Protein Bars for Chana Sattu Chaas:**
  * Commercial bars cost ~₹100–₹140.
  * 40g Sattu with fresh homemade buttermilk costs ~₹18 and contains zero artificial sweeteners.
* **Buy Pulses in Bulk (1kg+ bags):**
  * Purchasing Kala Chana and Yellow Moong Dal in 1kg or 2kg packs at local mandis reduces unit costs by up to 25% compared to small quick-commerce packets.

${ctx ? `*Your Budget:* You are currently set to **${budgetLabel}**. Swapping 2 meals to soya chunks and sattu can easily bring daily spend under ₹40!` : ''}`,
      actionLink: {
        label: 'View Grocery Restock Costs',
        tab: 'grocery',
      },
      followUps: [
        'What are affordable vegetarian protein sources?',
        'Suggest a budget-friendly, high-protein Indian breakfast.',
        'Why was this workout recommended?',
      ],
      contextUsed,
    };
  }

  // Generic fallback response with intelligent advice
  return {
    role: 'assistant',
    content: `### Guidance on: "${userQuery}"

Here are practical, research-backed suggestions tailored for real-world fitness consistency:

1. **Establish the Habit First:**
   * The best fitness plan is the one you can stick to on your busiest, most chaotic Tuesday—not just when motivation is high.
2. **Focus on Whole Food Quality:**
   * Prioritize nutrient-dense Indian staples (pulses, curd, sattu, seasonal vegetables, and whole grains). They provide steady satiety, micronutrients, and clean digestion.
3. **Respect Progressive Overload & Recovery:**
   * Challenge your muscles gradually by adding 1 extra rep, slowing down the negative tempo, or taking 15 seconds less rest.
   * Prioritize 7–8 hours of uninterrupted sleep for true tissue recovery.

${ctx ? `*Context Note:* Recommendation considers your **${goalLabel}** target, **${envLabel}** setup, and **${budgetLabel}** whole-food preference.` : ''}`,
    actionLink: {
      label: 'Explore Your FitShift Dashboard',
      tab: 'overview',
    },
    followUps: [
      'How can I build a workout routine in 30 minutes?',
      'What are affordable vegetarian protein sources?',
      'What can I do when I feel too tired for my usual workout?',
    ],
    contextUsed,
  };
}
