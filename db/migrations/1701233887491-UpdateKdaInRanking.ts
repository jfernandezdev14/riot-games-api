import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateKdaInRanking1701233887491 implements MigrationInterface {
    name = 'UpdateKdaInRanking1701233887491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "kda"`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD "kda" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "kda"`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD "kda" integer NOT NULL`);
    }

}
