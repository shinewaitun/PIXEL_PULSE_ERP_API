import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionsTable1773824646563
  implements MigrationInterface
{
  name = 'CreateSubscriptionsTable1773824646563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`subscriptions\` (\`id\` varchar(36) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`duration\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, \`discount\` decimal(5,2) NULL, \`created_by\` varchar(36) NULL, \`updated_by\` varchar(36) NULL, \`deleted_by\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_9a92203195f8367519fd64dbe09\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_e8b5d97abb5a91550b668a965d4\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_611360d97039ddc16cf2b9a7b92\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_611360d97039ddc16cf2b9a7b92\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_e8b5d97abb5a91550b668a965d4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_9a92203195f8367519fd64dbe09\``,
    );
    await queryRunner.query(`DROP TABLE \`subscriptions\``);
  }
}
