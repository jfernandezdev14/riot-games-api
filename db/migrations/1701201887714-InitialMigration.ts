import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1701201887714 implements MigrationInterface {
  name = 'InitialMigration1701201887714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "player" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "summoner_id" character varying NOT NULL, "puuid" character varying NOT NULL, "name" character varying NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_73e6ad80c534615c1a5a28b6b4" ON "player" ("summoner_id", "name", "puuid") `,
    );
    await queryRunner.query(
      `CREATE TABLE "match_summary" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "match_id" character varying NOT NULL, "summoner_name" character varying NOT NULL, "champion_name" character varying NOT NULL, "kills" integer NOT NULL, "deaths" integer NOT NULL, "assists" integer NOT NULL, "kda" integer NOT NULL, "lane" character varying NOT NULL, "time_played" integer NOT NULL, "true_damage_dealt" integer NOT NULL, "true_damage_dealt_to_champions" integer NOT NULL, "cs_per_minute" integer NOT NULL, "vision_score" integer NOT NULL, "win" boolean NOT NULL, "queue_id" integer NOT NULL, "game_end_timestamp" integer NOT NULL, "player_id" uuid NOT NULL, CONSTRAINT "PK_efe56d9ef2f46c04ffe7e22c125" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c6026c8792fb36a8e6091fd33b" ON "match_summary" ("match_id", "player_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ranking" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "summoner_id" character varying NOT NULL, "summoner_name" character varying NOT NULL, "region" character varying NOT NULL, "rank" character varying NOT NULL, "league_points" integer NOT NULL, "kills" integer NOT NULL, "deaths" integer NOT NULL, "assists" integer NOT NULL, "kda" integer NOT NULL, "avg_vision_score" integer NOT NULL, "avg_cs_per_minute" integer NOT NULL, "summoner_level" integer NOT NULL, "queue_id" integer NOT NULL, "queue_type" character varying NOT NULL, "player_id" uuid NOT NULL, CONSTRAINT "PK_bf82b8f271e50232e6a3fcb09a9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_277827889d13137627f4f95164" ON "ranking" ("summoner_id", "queue_type", "region") `,
    );
    await queryRunner.query(
      `ALTER TABLE "match_summary" ADD CONSTRAINT "FK_53c1366595f3ed7d2ebfe9387d3" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ranking" ADD CONSTRAINT "FK_d6c4c65a9d6e9ac4f579539a6a9" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ranking" DROP CONSTRAINT "FK_d6c4c65a9d6e9ac4f579539a6a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match_summary" DROP CONSTRAINT "FK_53c1366595f3ed7d2ebfe9387d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_277827889d13137627f4f95164"`,
    );
    await queryRunner.query(`DROP TABLE "ranking"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c6026c8792fb36a8e6091fd33b"`,
    );
    await queryRunner.query(`DROP TABLE "match_summary"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_73e6ad80c534615c1a5a28b6b4"`,
    );
    await queryRunner.query(`DROP TABLE "player"`);
  }
}
