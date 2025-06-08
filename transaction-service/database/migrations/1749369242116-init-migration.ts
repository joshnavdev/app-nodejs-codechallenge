import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1749369242116 implements MigrationInterface {
    name = 'InitMigration1749369242116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_types" ("transaction_type_id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_1162d10d757ef42c8aeb2d25389" UNIQUE ("name"), CONSTRAINT "PK_ed413125cd0a40ea415d0df5569" PRIMARY KEY ("transaction_type_id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_statuses" ("transaction_status_id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_5a267d699e9ca7b5fd56d9f3ca8" UNIQUE ("name"), CONSTRAINT "PK_6b999e6bdcc7738c60279477a0d" PRIMARY KEY ("transaction_status_id"))`);
        await queryRunner.query(`CREATE TABLE "transfer_types" ("transfer_type_id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_628ab9b67f4ed1cae3135c4d467" UNIQUE ("name"), CONSTRAINT "PK_eb39cc9487ae3dba9bc761f8d1f" PRIMARY KEY ("transfer_type_id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("transaction_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_external_id_debit" character varying NOT NULL, "account_external_id_credit" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL, "transfer_type_id" integer, "transaction_type_id" integer, "transaction_status_id" integer, CONSTRAINT "PK_9162bf9ab4e31961a8f7932974c" PRIMARY KEY ("transaction_id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_303b5efab792f9ecaf5d18c0f72" FOREIGN KEY ("transfer_type_id") REFERENCES "transfer_types"("transfer_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_0088fd11d7d79f73d8824a10fcc" FOREIGN KEY ("transaction_type_id") REFERENCES "transaction_types"("transaction_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_b5e07d789946c4e3ee03bb035a4" FOREIGN KEY ("transaction_status_id") REFERENCES "transaction_statuses"("transaction_status_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_b5e07d789946c4e3ee03bb035a4"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_0088fd11d7d79f73d8824a10fcc"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_303b5efab792f9ecaf5d18c0f72"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "transfer_types"`);
        await queryRunner.query(`DROP TABLE "transaction_statuses"`);
        await queryRunner.query(`DROP TABLE "transaction_types"`);
    }

}
