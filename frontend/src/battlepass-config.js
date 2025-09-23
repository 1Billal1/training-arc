// src/battlepass-config.js

// Using a consistent set of running-themed icons from icons8.com.
export const battlepassTiers = [
    { tier: 1, kmRequired: 10, type: 'Badge', name: 'First Strides', description: 'Complete your first 10 kilometers.', imageUrl: 'https://img.icons8.com/fluency/96/running-shoe.png' },
    { tier: 2, kmRequired: 20, type: 'Icon', name: 'Road Runner', description: 'A classic icon for a dedicated runner.', imageUrl: 'https://img.icons8.com/fluency/96/running.png' },
    { tier: 3, kmRequired: 30, type: 'Badge', name: 'Hydration Hero', description: 'Staying hydrated is key.', imageUrl: 'https://img.icons8.com/fluency/96/bottle-of-water.png' },
    { tier: 4, kmRequired: 40, type: 'Icon', name: 'Heartbeat', description: 'A sign of a healthy heart.', imageUrl: 'https://img.icons8.com/fluency/96/like.png' },
    { tier: 5, kmRequired: 50, type: 'Badge', name: '50K Finisher', description: 'A major milestone: 50 kilometers.', imageUrl: 'https://img.icons8.com/fluency/96/medal2.png' },
    { tier: 6, kmRequired: 60, type: 'Icon', name: 'Stopwatch', description: 'For those who chase the clock.', imageUrl: 'https://img.icons8.com/fluency/96/stopwatch.png' },
    { tier: 7, kmRequired: 70, type: 'Banner', name: 'Mountain View', description: 'A banner for reaching new heights.', imageUrl: 'https://i.imgur.com/example-banner-1.png' },
    { tier: 8, kmRequired: 80, type: 'Badge', name: 'Endurance', description: 'You have proven your stamina.', imageUrl: 'https://img.icons8.com/fluency/96/lightning-bolt.png' },
    { tier: 9, kmRequired: 90, type: 'Icon', name: 'Trailblazer', description: 'For those who run off the beaten path.', imageUrl: 'https://img.icons8.com/fluency/96/trekking.png' },
    { tier: 10, kmRequired: 100, type: 'Badge', name: 'Century Club', description: 'Welcome to the 100 km club.', imageUrl: 'https://img.icons8.com/fluency/96/1st-place-medal.png' },
    { tier: 11, kmRequired: 110, type: 'Icon', name: 'Podium', description: 'A symbol of victory.', imageUrl: 'https://img.icons8.com/fluency/96/podium-with-audience.png' },
    { tier: 12, kmRequired: 120, type: 'Banner', name: 'City Runner', description: 'A banner for the urban explorer.', imageUrl: 'https://i.imgur.com/example-banner-2.png' },
    { tier: 13, kmRequired: 130, type: 'Icon', name: 'Focused', description: 'Your dedication is unwavering.', imageUrl: 'https://img.icons8.com/fluency/96/target.png' },
    { tier: 14, kmRequired: 140, type: 'Badge', name: 'Road Warrior', description: 'You own the road.', imageUrl: 'https://img.icons8.com/fluency/96/finish-flag.png' },
    { tier: 15, kmRequired: 150, type: 'Badge', name: '150K Milestone', description: 'Another major achievement unlocked.', imageUrl: 'https://img.icons8.com/fluency/96/trophy.png' },
    // Continue adding up to 25 tiers...
    { tier: 16, kmRequired: 160, type: 'Icon', name: 'Sunrise Run', description: 'For the early birds.', imageUrl: 'https://img.icons8.com/fluency/96/sunrise.png' },
    { tier: 17, kmRequired: 170, type: 'Banner', name: 'Forest Trail', description: 'A banner for nature lovers.', imageUrl: 'https://i.imgur.com/example-banner-3.png' },
    { tier: 18, kmRequired: 180, type: 'Icon', name: 'Athlete', description: 'You are a true athlete.', imageUrl: 'https://img.icons8.com/fluency/96/olympic-games.png' },
    { tier: 19, kmRequired: 190, type: 'Badge', name: 'Unstoppable', description: 'Nothing can stop you now.', imageUrl: 'https://img.icons8.com/fluency/96/infinity.png' },
    { tier: 20, kmRequired: 200, type: 'Badge', name: 'Double Century', description: 'An incredible 200 kilometers.', imageUrl: 'https://img.icons8.com/fluency/96/prize.png' },
    { tier: 21, kmRequired: 210, type: 'Icon', name: 'The Zone', description: 'You have achieved a state of flow.', imageUrl: 'https://img.icons8.com/fluency/96/brain.png' },
    { tier: 22, kmRequired: 220, type: 'Banner', name: 'Night Sky', description: 'A banner for the night owls.', imageUrl: 'https://i.imgur.com/example-banner-4.png' },
    { tier: 23, kmRequired: 230, type: 'Icon', name: 'Globe Trotter', description: 'You could run across the world.', imageUrl: 'https://img.icons8.com/fluency/96/globe.png' },
    { tier: 24, kmRequired: 240, type: 'Badge', name: 'Elite Runner', description: 'You are among the best.', imageUrl: 'https://img.icons8.com/fluency/96/gold-bars.png' },
    { tier: 25, kmRequired: 250, type: 'Badge', name: 'Master of the Run', description: 'The final tier. A true legend.', imageUrl: 'https://img.icons8.com/fluency/96/crown.png' },
];

export const KM_PER_TIER = 10;
export const TIERS_PER_PAGE = 5; // We can adjust this later if needed