import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGameEndTimeStampType1701202647817 implements MigrationInterface {
    name = 'UpdateGameEndTimeStampType1701202647817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "game_end_timestamp"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "game_end_timestamp" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match_summary" DROP COLUMN "game_end_timestamp"`);
        await queryRunner.query(`ALTER TABLE "match_summary" ADD "game_end_timestamp" integer NOT NULL`);
    }

}
