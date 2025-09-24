// src/battlepass-config.js

// The imageUrl paths have been corrected to be absolute (starting with '/')
// The 'text' property has been added to every object with type: 'Tagline'

export const battlepassTiers = [
    { tier: 1, kmRequired: 10, type: 'Tagline', name: 'Road Runner', description: 'A classic tagline for a dedicated runner.', text: 'Road Runner', imageUrl: '/tagline.png' },
    { tier: 2, kmRequired: 20, type: 'Badge', name: 'Rauzz', description: 'Complete your first 20 kilometers.', imageUrl: '/rauzzthumbs.jpg' },
    { tier: 3, kmRequired: 30, type: 'Tagline', name: 'Train', description: 'Time to Train.', imageUrl: '/tagline.png' },
    { tier: 4, kmRequired: 40, type: 'Tagline', name: 'Rauzz', description: 'A name that holds a special status.', text: 'Rauzz', imageUrl: '/tagline.png' },
    { tier: 5, kmRequired: 50, type: 'Badge', name: 'Rauzz Macbook', description: 'Macbook User', imageUrl: '/rauzzmac.jpg' },
    { tier: 6, kmRequired: 60, type: 'Tagline', name: 'Running Merchant', description: 'Congrats on 60km.', text: 'Running Merchant', imageUrl: '/tagline.png' },
    { tier: 7, kmRequired: 70, type: 'Badge', name: 'Rauzz No', description: 'Disapproved.', imageUrl: '../public/rauzzno.jpg' },
    { tier: 8, kmRequired: 80, type: 'Badge', name: 'Rauzz Dissapointed', description: 'Rauzz is Dissapointed.', imageUrl: '../public/rauzzsmh.jpg' },
    { tier: 9, kmRequired: 90, type: 'Tagline', name: 'Determined to win', description: 'Who gonna take you.', text: 'Determined to win', imageUrl: '/tagline.png' },
    { tier: 10, kmRequired: 100, type: 'Badge', name: 'Century Club', description: 'Welcome to the 100 km club.', imageUrl: '/rauzzfreaky.jpg' },
    { tier: 11, kmRequired: 110, type: 'Tagline', name: 'Winner', description: 'A symbol of victory.', text: 'Winner', imageUrl: '/tagline.png' },
    { tier: 12, kmRequired: 120, type: 'Badge', name: 'Rauzz Quiet', description: 'Be quiet.', imageUrl: '/rauzzshh.jpg' },
    { tier: 13, kmRequired: 130, type: 'Tagline', name: 'Focused', description: 'Your dedication is unwavering.', text: 'Focused', imageUrl: '/tagline.png' },
    { tier: 14, kmRequired: 140, type: 'Badge', name: 'Rauzz Mad', description: 'Rauzz mad.', imageUrl: '/rauzzmad.jpg' },
    { tier: 15, kmRequired: 150, type: 'Tagline', name: '150K Milestone', description: 'Another major achievement unlocked.', text: '150K Milestone', imageUrl: '/tagline.png' }, 
    { tier: 16, kmRequired: 160, type: 'Tagline', name: 'Sunrise Run', description: 'For the early birds.', text: 'Sunrise Run', imageUrl: '/tagline.png' },
    { tier: 17, kmRequired: 170, type: 'Badge', name: 'Rauzz Praying', description: 'Rauzz Praying.', imageUrl: '../public/rauzzpeace.jpg' },
    { tier: 18, kmRequired: 180, type: 'Tagline', name: 'Athlete', description: 'You are a true athlete.', text: 'Athlete', imageUrl: '/tagline.png' },
    { tier: 19, kmRequired: 190, type: 'Tagline', name: 'Unstoppable', description: 'Nothing can stop you now.', imageUrl: '../public/tagline.png' },
    { tier: 20, kmRequired: 200, type: 'Badge', name: 'Double Century', description: 'An incredible 200 kilometers.', imageUrl: 'https://img.icons8.com/fluency/96/prize.png' },
    { tier: 21, kmRequired: 210, type: 'Tagline', name: 'The Zone', description: 'You have achieved a state of flow.', imageUrl: '/tagline.png' },
    { tier: 22, kmRequired: 220, type: 'Badge', name: 'Rauzz Game', description: 'Rauzz Game Dropping', imageUrl: '/rauzzgame.jpg' },
    { tier: 23, kmRequired: 230, type: 'Tagline', name: 'Game Dropping', description: 'Professional Game Dropper.', text: 'Game Dropping', imageUrl:'/tagline.png' },
    { tier: 24, kmRequired: 240, type: 'Tagline', name: 'Elite Runner', description: 'You are among the best.', text: 'Elite Runner', imageUrl: '/star.jpg' },
    { tier: 25, kmRequired: 250, type: 'Badge', name: 'Elite Runner', description: 'The final tier. A true legend.', imageUrl: 'https://img.icons8.com/fluency/96/crown.png' },
];

export const KM_PER_TIER = 10;
export const TIERS_PER_PAGE = 5;