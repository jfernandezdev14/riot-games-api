import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateKdaMatchSummary1701233405192 implements MigrationInterface {
    name = 'UpdateKdaMatchSummary1701233405192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "kda"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "kda" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "kda"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "kda" integer NOT NULL`);
    }

}
