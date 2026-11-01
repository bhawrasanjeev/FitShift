import { OnboardingData, ScheduleEvent } from '../types';

export const generateUserSchedule = (user: OnboardingData): ScheduleEvent[] => {
  const wakeTime = user.rhythm.wakeUpTime || '06:30';
  const depTime = user.rhythm.departureTime || '08:30';
  const retTime = user.rhythm.returnTime || '18:30';

  const isMorningWorkout = user.training.preferredTime === 'morning';

  const events: ScheduleEvent[] = [
    {
      id: 'sch-1',
      time: wakeTime,
      title: 'Wake Up & Hydrate',
      type: 'recovery',
      description: 'Drink 500ml water to break overnight dehydration.',
      duration: '15m',
    },
  ];

  if (isMorningWorkout) {
    events.push({
      id: 'sch-2',
      time: '07:00',
      title: 'Pre-Workout Anchor',
      type: 'meal',
      description: 'Light hydration or energy anchor before training.',
      duration: '15m',
    });
    events.push({
      id: 'sch-3',
      time: '07:30',
      title: `${user.training.durationMinutes}-Min Training Window`,
      type: 'workout',
      description: `Planned ${user.training.durationMinutes}m session (${user.training.environment === 'home' ? 'Home' : 'Gym'}).`,
      duration: `${user.training.durationMinutes}m`,
    });
    events.push({
      id: 'sch-4',
      time: '08:20',
      title: 'Post-Workout Breakfast',
      type: 'meal',
      description: 'High-protein breakfast from allocated diet staples.',
      duration: '25m',
    });
  } else {
    events.push({
      id: 'sch-2',
      time: '07:30',
      title: 'Nutrient-Dense Breakfast',
      type: 'meal',
      description: 'Breakfast from allocated diet staples.',
      duration: '20m',
    });
  }

  events.push({
    id: 'sch-5',
    time: depTime,
    title: 'Work / Transit Departure',
    type: 'work',
    description: `Daily occupational transition (${user.rhythm.occupation.replace('_', ' ')}).`,
    duration: 'Transit',
  });

  events.push({
    id: 'sch-6',
    time: '13:00',
    title: 'Balanced Mid-Day Lunch',
    type: 'meal',
    description: 'Protein staple and complex carbohydrates.',
    duration: '30m',
  });

  events.push({
    id: 'sch-7',
    time: retTime,
    title: 'Return Home & Transit Transition',
    type: 'work',
    description: 'Unwind from professional transit.',
    duration: 'Transit',
  });

  if (!isMorningWorkout) {
    events.push({
      id: 'sch-8',
      time: '19:15',
      title: `${user.training.durationMinutes}-Min Evening Training Window`,
      type: 'workout',
      description: `Planned ${user.training.durationMinutes}m session (${user.training.environment === 'home' ? 'Home' : 'Gym'}).`,
      duration: `${user.training.durationMinutes}m`,
    });
  }

  events.push({
    id: 'sch-9',
    time: '20:30',
    title: 'Evening Dinner',
    type: 'meal',
    description: 'Dinner fulfilling daily protein target.',
    duration: '30m',
  });

  events.push({
    id: 'sch-10',
    time: '22:30',
    title: `Restorative Sleep Window (${user.rhythm.sleepHours} hrs)`,
    type: 'sleep',
    description: `Target ${user.rhythm.sleepHours} hours restorative sleep before ${wakeTime} wake-up.`,
    duration: `${user.rhythm.sleepHours}h`,
  });

  return events;
};
