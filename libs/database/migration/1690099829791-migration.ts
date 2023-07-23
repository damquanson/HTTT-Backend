import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1690099829791 implements MigrationInterface {
  name = 'Migration1690099829791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`link\``);
    await queryRunner.query(`ALTER TABLE \`video\` ADD \`link\` text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`link\``);
    await queryRunner.query(
      `ALTER TABLE \`video\` ADD \`link\` varchar(255) NOT NULL`,
    );
  }
}
