import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1671738286159 implements MigrationInterface {
	name = 'Migration1671738286159';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "JOBS_PROD" ("id" int NOT NULL IDENTITY(1,1), "date_exec" nvarchar(255), "hours_init_exec" nvarchar(255), "hours_end_exec" nvarchar(255), "duration_exec" nvarchar(255), "status" int, "message" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_9dd4d5b898091ab597ff997203c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_d38c279d27a6bf860cbb6e10244" DEFAULT getdate(), "job" int, "category" int, CONSTRAINT "PK_aefdb31be9be4db018b9a579148" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "types_jobs" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_81ab1f99f0d702d1288545aa860" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_645a5e976625b1b26918ea4a387" DEFAULT getdate(), CONSTRAINT "UQ_44744e1507629e7fcc45fb43c54" UNIQUE ("name"), CONSTRAINT "PK_2e52db9694fa5559ad26bea93fe" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "jobs" ("id" int NOT NULL IDENTITY(1,1), "id_job" nvarchar(255), "name" nvarchar(255), "order_exec" int, "descripcion" nvarchar(255), "server_origin" nvarchar(255), "active" int, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_656cf816796738c59563a797878" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c62c4a00c1c3c6c4f5174d2b08e" DEFAULT getdate(), "category" int, "type" int, CONSTRAINT "UQ_e480da468fa5ef0b9a8f90c438e" UNIQUE ("name"), CONSTRAINT "UQ_c01a07f8f10cfebc060e8d3cedc" UNIQUE ("order_exec"), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "category_job" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_6a6192b7be0b6733c008bce598a" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_905da7059c8accb89864a716b0e" DEFAULT getdate(), CONSTRAINT "UQ_9e63ad285c70bd14d4487b31f9a" UNIQUE ("name"), CONSTRAINT "PK_1eb829181271fbbb36a75540a6e" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "JOBS_PROD" ADD CONSTRAINT "FK_161952d8736efb71ad1d0f412fb" FOREIGN KEY ("job") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "JOBS_PROD" ADD CONSTRAINT "FK_1ada474e75e29be81bf57bd4003" FOREIGN KEY ("category") REFERENCES "category_job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "jobs" ADD CONSTRAINT "FK_2b6d4fc98010e4fb9c4c4b8e6aa" FOREIGN KEY ("category") REFERENCES "category_job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "jobs" ADD CONSTRAINT "FK_b3dc188bb49c6597addebf9a184" FOREIGN KEY ("type") REFERENCES "types_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_b3dc188bb49c6597addebf9a184"`);
		await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_2b6d4fc98010e4fb9c4c4b8e6aa"`);
		await queryRunner.query(`ALTER TABLE "JOBS_PROD" DROP CONSTRAINT "FK_1ada474e75e29be81bf57bd4003"`);
		await queryRunner.query(`ALTER TABLE "JOBS_PROD" DROP CONSTRAINT "FK_161952d8736efb71ad1d0f412fb"`);
		await queryRunner.query(`DROP TABLE "category_job"`);
		await queryRunner.query(`DROP TABLE "jobs"`);
		await queryRunner.query(`DROP TABLE "types_jobs"`);
		await queryRunner.query(`DROP TABLE "JOBS_PROD"`);
	}
}
