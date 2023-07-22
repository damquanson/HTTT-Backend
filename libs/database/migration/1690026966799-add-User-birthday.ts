import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBirthday1690026966799 implements MigrationInterface {
  name = 'AddUserBirthday1690026966799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`dateOfBirth\` datetime NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`detail\``);
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`detail\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`detail\``);
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD \`detail\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`dateOfBirth\``);
  }
}
