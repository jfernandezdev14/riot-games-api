import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCSPerMinuteType1701202466138 implements MigrationInterface {
    name = 'UpdateCSPerMinuteType1701202466138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "cs_per_minute"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "cs_per_minute" numeric(6,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "vision_score"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "vision_score" numeric(6,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "vision_score"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "vision_score" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "cs_per_minute"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "cs_per_minute" integer NOT NULL`);
    }

}
