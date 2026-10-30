/** Reader situations, not a publication calendar. All links remain ordinary crawlable URLs. */
export const BLOG_COLLECTIONS = [
  { id: 'right-now', label: 'An urge, right now', description: 'Make the next move smaller than the whole problem.', slugs: ['urge-surfing', 'night-urges', 'when-urges-hit'] },
  { id: 'after-a-slip', label: 'After a slip', description: 'Keep the rest of the day. Keep what you learned.', slugs: ['after-a-slip', 'progress-beyond-streaks'] },
  { id: 'make-a-plan', label: 'Make tonight’s plan', description: 'Something you can do when the familiar hour arrives.', slugs: ['if-then-plan', 'first-week'] },
  { id: 'choose-tools', label: 'Choose your tools', description: 'What the feature does, what it stores, and where its limits are.', slugs: ['porn-blocker-vs-recovery-app', 'quittr-alternative', 'quittr-breach'] },
  { id: 'understand', label: 'Understand what you’re feeling', description: 'Read the evidence with its limits. A calendar is not a diagnosis.', slugs: ['rewire-timeline', 'flatline'] },
  { id: 'november', label: 'The November challenge', description: 'Rules, preparation and a plan for the difficult evenings.', slugs: ['no-nut-november-rules', 'no-nut-november-tips'] },
] as const;
