import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageProduct1689129981344 implements MigrationInterface {
    name = 'AddImageProduct1689129981344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`image_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`productId\` int NOT NULL, \`size\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`imageArray\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatarUrl\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`collection\` ADD \`image\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`image_product\` ADD CONSTRAINT \`FK_46730a20b58d86123a5bedada8d\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_product\` DROP FOREIGN KEY \`FK_46730a20b58d86123a5bedada8d\``);
        await queryRunner.query(`ALTER TABLE \`collection\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatarUrl\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`imageArray\``);
        await queryRunner.query(`DROP TABLE \`image_product\``);
    }

}
