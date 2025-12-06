import { randomUUID } from 'crypto';
import { migrate } from './schema.js';
import {
  getUserByEmail,
  createUser,
  createProduct,
  createSubmission,
} from './queries.js';
import { pool } from './pool.js';

const ingredients = [
  { id: 1, name: 'Whole Wheat Flour', origin: 'USA', allergen: false },
  { id: 2, name: 'Honey', origin: 'Argentina', allergen: false },
  { id: 3, name: 'Eggs', origin: 'USA', allergen: true },
  { id: 4, name: 'Almonds', origin: 'Spain', allergen: true },
  { id: 5, name: 'Vanilla Extract', origin: 'Madagascar', allergen: false },
];

async function seed() {
  try {
    console.log('Running seed script...');
    await migrate();

    // Create demo users
    console.log('Creating demo users...');
    const admin = await createUser('admin@example.com', 'Admin User', 'admin123456');
    const user1 = await createUser('user1@example.com', 'John Doe', 'user123456');
    const user2 = await createUser('user2@example.com', 'Jane Smith', 'user123456');

    // Manually set admin role (in production, you'd add a role column to users)
    await pool.query('UPDATE users SET trust_score = 100 WHERE id = $1', [admin.id]);

    console.log('Creating sample products...');
    const product1 = await createProduct(
      '5010477010002',
      'Organic Whole Grain Bread',
      'Nature\'s Best',
      'Bakery',
      ingredients.slice(0, 3),
      ['organic', 'vegan'],
      { calories: 150, protein: '8g', carbs: '30g' },
      user1.id
    );

    const product2 = await createProduct(
      '5010477010003',
      'Almond Butter',
      'Health Foods',
      'Spreads',
      [ingredients[3]],
      ['organic', 'gluten-free'],
      { calories: 190, protein: '7g', fat: '17g' },
      user2.id
    );

    // Create sample submissions (pending review)
    console.log('Creating sample submissions...');
    const submission1 = await createSubmission(
      user1.id,
      '5010477010004',
      'Plant-Based Yogurt',
      'Green Earth',
      'Dairy Alternatives',
      [
        { id: 6, name: 'Coconut Milk', allergen: true },
        { id: 7, name: 'Probiotic Cultures', allergen: false },
      ],
      ['vegan', 'dairy-free'],
      { calories: 120, protein: '4g', carbs: '15g' },
      'https://example.com/product',
      'Contains coconut milk alternative to dairy',
      'pending_review'
    );

    console.log('✓ Seed data created successfully');
    console.log(`  - Admin user: admin@example.com / admin123456`);
    console.log(`  - Test user 1: user1@example.com / user123456`);
    console.log(`  - Test user 2: user2@example.com / user123456`);
    console.log(`  - Sample products created`);
    console.log(`  - Sample submission (pending review) created`);
  } catch (error) {
    console.error('Seed script failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
