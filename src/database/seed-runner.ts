import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './typeorm.datasource';

async function run() {
  console.log('🚀 Initializing Data Source...');
  await AppDataSource.initialize();

  console.log('🌱 Starting Seeding Process...');
  await runSeeders(AppDataSource);

  console.log('✅ Seeding complete!');
  process.exit();
}

run().catch((err) => {
  console.error('❌ Seeding failed:');
  console.error(err);
  process.exit(1);
});
