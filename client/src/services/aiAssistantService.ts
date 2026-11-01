import { ChatMessage, SuggestedPromptCategory, OnboardingData } from '../types';
import { sendAIChat } from './api';

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
  const context = (usePlanContext && userProfile)
    ? {
        goal: userProfile.personal.goal,
        environment: userProfile.training.environment,
        diet: userProfile.food.dietType,
        dailyBudget: userProfile.budget.dailyBudgetRupees,
        durationMinutes: userProfile.training.durationMinutes,
        mealsPerDay: userProfile.food.mealsPerDay,
        experienceLevel: userProfile.training.experienceLevel
      }
    : undefined;

  const result = await sendAIChat(userQuery, context);
  const content = result.response || (result as unknown as { reply?: string }).reply || '';

  return {
    role: 'assistant',
    content,
    contextUsed: context
      ? {
          goal: String(context.goal),
          environment: String(context.environment),
          diet: String(context.diet),
          dailyBudget: Number(context.dailyBudget),
          durationMinutes: Number(context.durationMinutes)
        }
      : undefined
  };
}
