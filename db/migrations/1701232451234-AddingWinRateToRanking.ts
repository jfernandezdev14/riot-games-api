import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingWinRateToRanking1701232451234 implements MigrationInterface {
    name = 'AddingWinRateToRanking1701232451234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" ADD "win_rate" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "win_rate"`);
    }

}
