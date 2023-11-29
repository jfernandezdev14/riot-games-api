import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRankingTypes1701223952101 implements MigrationInterface {
    name = 'UpdateRankingTypes1701223952101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "avg_vision_score"`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD "avg_vision_score" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "avg_cs_per_minute"`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD "avg_cs_per_minute" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "avg_cs_per_minute"`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD "avg_cs_per_minute" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "avg_vision_score"`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD "avg_vision_score" integer NOT NULL`);
    }

}
