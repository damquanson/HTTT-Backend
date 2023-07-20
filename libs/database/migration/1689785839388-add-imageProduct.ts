import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageProduct1689785839388 implements MigrationInterface {
    name = 'AddImageProduct1689785839388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_product\` DROP COLUMN \`filename\``);
        await queryRunner.query(`ALTER TABLE \`image_product\` DROP COLUMN \`mimetype\``);
        await queryRunner.query(`ALTER TABLE \`image_product\` ADD \`fileName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`image_product\` ADD \`mimeType\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_product\` DROP COLUMN \`mimeType\``);
        await queryRunner.query(`ALTER TABLE \`image_product\` DROP COLUMN \`fileName\``);
        await queryRunner.query(`ALTER TABLE \`image_product\` ADD \`mimetype\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`image_product\` ADD \`filename\` varchar(255) NOT NULL`);
    }

}
