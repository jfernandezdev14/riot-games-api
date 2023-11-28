import { MigrationInterface, QueryRunner } from "typeorm";

export class IncludeTierInRanking1701210687640 implements MigrationInterface {
    name = 'IncludeTierInRanking1701210687640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" ADD "tier" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "tier"`);
    }

}
