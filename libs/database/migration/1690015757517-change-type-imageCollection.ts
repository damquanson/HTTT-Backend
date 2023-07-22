import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeImageCollection1690015757517
  implements MigrationInterface
{
  name = 'ChangeTypeImageCollection1690015757517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`collection\` DROP COLUMN \`image\``);
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD \`image\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`collection\` DROP COLUMN \`image\``);
    await queryRunner.query(
      `ALTER TABLE \`collection\` ADD \`image\` json NOT NULL`,
    );
  }
}
