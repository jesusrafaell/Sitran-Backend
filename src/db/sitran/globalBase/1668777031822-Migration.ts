import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1668777031822 implements MigrationInterface {
	name = 'Migration1668777031822';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "permissions" ("id" int NOT NULL IDENTITY(1,1), "profile" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_6c05a77b08a9c4631ec33871490" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_da04f89054f39981438894dfe30" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_14936cb23d7de4c7b31b5cef053" DEFAULT getdate(), "id_action" int, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "global_views" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "root" nvarchar(255), "description" nvarchar(255) NOT NULL, "key" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_fe4fdd49784cd1a8557a7376e81" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_d770efc2aaa2d115d5c01b787c3" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_5a141e8f660779493de95813d9d" DEFAULT getdate(), CONSTRAINT "PK_42646f9def00439958e58eb2075" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_8548d1895f3f0329f8497c8fe6" ON "global_views" ("name", "root", "key") `
		);
		await queryRunner.query(
			`CREATE TABLE "actions" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "description" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_518723f5b5d234707f8ec0e4569" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_772bb765d8b7f552174e815c67c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_405998cf04de4518f9f0f3a6365" DEFAULT getdate(), "id_views" int, CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "Prefijos" ("id" int NOT NULL IDENTITY(1,1), "value" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "subname" nvarchar(255) NOT NULL, CONSTRAINT "PK_39fab5a960234aa7a3cf1c0f3d4" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_3c7e9d0204128037852c098df6" ON "Prefijos" ("value", "name") `
		);
		await queryRunner.query(
			`CREATE TABLE "department" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "active" int NOT NULL CONSTRAINT "DF_a0a617cd021b1c9e608ca43c745" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_7fab33683a2bfb9bcfa001aa995" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_633cc6089e6ceb143dfd64a0ca0" DEFAULT getdate(), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "department" ("name") `);
		await queryRunner.query(
			`CREATE TABLE "roles" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_8879c4534a254c4b0871adc75ba" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4d018866397b1e7e78d03b45662" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c13070745ded32a88c920015f7e" DEFAULT getdate(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "views" ("id" int NOT NULL IDENTITY(1,1), "viewId" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_a5d821bd12a20c9e7bcd8fe5678" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_a8b7f725007cb9ddd8098a71813" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_04f7f71efc2398d52010a4ab30e" DEFAULT getdate(), CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "s_viewXprofile" ("id" int NOT NULL IDENTITY(1,1), "profileId" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_7c87002dfcc040d1758e06cc12f" DEFAULT 1, "viewId" int, CONSTRAINT "PK_ce1cf5afc3eb0e56ecda1e8cff1" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_5262c3bc3e259fe3e231a2811f" ON "s_viewXprofile" ("profileId", "viewId") `
		);
		await queryRunner.query(
			`CREATE TABLE "profile" ("id" int NOT NULL IDENTITY(1,1), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3b983631651f08d8b5b66a4e1fe" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_d32cdbff673d9f7be9f263229f3" DEFAULT getdate(), "department" int, "rol" int, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_9510ea66b9e182ee95ae813b3a" ON "profile" ("department", "rol") `
		);
		await queryRunner.query(
			`CREATE TABLE "status" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "Usuarios" ("id" int NOT NULL IDENTITY(1,1), "login" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "id_type" nvarchar(255) NOT NULL, "ident" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_8ea30944c02c793cc28ce98e68c" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_486654875d84763c946f1e2c739" DEFAULT getdate(), "expiration" date NOT NULL, "entrys" int NOT NULL CONSTRAINT "DF_259911c5fa284ad72e0278a3319" DEFAULT 0, "statusId" int, "profileId" int, "agregadorId" int, CONSTRAINT "PK_6b4c9e5c7d35b294307b3fd0fea" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_6d831da89d1af23a619faa299e" ON "Usuarios" ("id_type", "ident") `
		);
		await queryRunner.query(
			`CREATE TABLE "agregador" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "key" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_e47ac194cd23478637f14aec37b" DEFAULT 1, CONSTRAINT "PK_24296609d93b9c8b2125b826ec4" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "params" ("id" int NOT NULL IDENTITY(1,1), "key" nvarchar(255) NOT NULL, "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "value" nvarchar(255) NOT NULL, CONSTRAINT "PK_54f49c25753910452dedc4df0f0" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "origin_logs" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_e70649ca2d0953e9423376fc545" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "general_logs" ("id" int NOT NULL IDENTITY(1,1), "email" nvarchar(255) NOT NULL, "descript" nvarchar(255) NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_026abf71d97cbc51dd1090c7f4d" DEFAULT getdate(), "id_origin_logs" int, CONSTRAINT "PK_7a29767ad952aab18d5b2df6b10" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "usuarioXprefijo" ("usuariosId" int NOT NULL, "prefijosId" int NOT NULL, CONSTRAINT "PK_89c8e331299c43b422de2955c95" PRIMARY KEY ("usuariosId", "prefijosId"))`
		);
		await queryRunner.query(`CREATE INDEX "IDX_8a8da9b633bf46f431cabed502" ON "usuarioXprefijo" ("usuariosId") `);
		await queryRunner.query(`CREATE INDEX "IDX_cf329d7293f6d354cd245401d5" ON "usuarioXprefijo" ("prefijosId") `);
		await queryRunner.query(
			`ALTER TABLE "permissions" ADD CONSTRAINT "FK_4ff7f0e8e6ea828332a38c5f8c7" FOREIGN KEY ("id_action") REFERENCES "actions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "actions" ADD CONSTRAINT "FK_dd8cca9369ae4fee07d2a26c22c" FOREIGN KEY ("id_views") REFERENCES "global_views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "s_viewXprofile" ADD CONSTRAINT "FK_dec0f5bcd2b51f0c3114a11a2de" FOREIGN KEY ("viewId") REFERENCES "views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "profile" ADD CONSTRAINT "FK_be323659aaa1cc2be8a756d0c7f" FOREIGN KEY ("department") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "profile" ADD CONSTRAINT "FK_ad2b90516ac88568151ea1ed9b6" FOREIGN KEY ("rol") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_0ffde2a9c23cdadbda9fa63f5a0" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_896dd7717275f13efacede330d7" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "Usuarios" ADD CONSTRAINT "FK_dfccb527e059f170075be4510aa" FOREIGN KEY ("agregadorId") REFERENCES "agregador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "general_logs" ADD CONSTRAINT "FK_a9ebaa9beeca8aafa085ea66bb5" FOREIGN KEY ("id_origin_logs") REFERENCES "origin_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "usuarioXprefijo" ADD CONSTRAINT "FK_8a8da9b633bf46f431cabed502b" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
		await queryRunner.query(
			`ALTER TABLE "usuarioXprefijo" ADD CONSTRAINT "FK_cf329d7293f6d354cd245401d5e" FOREIGN KEY ("prefijosId") REFERENCES "Prefijos"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "usuarioXprefijo" DROP CONSTRAINT "FK_cf329d7293f6d354cd245401d5e"`);
		await queryRunner.query(`ALTER TABLE "usuarioXprefijo" DROP CONSTRAINT "FK_8a8da9b633bf46f431cabed502b"`);
		await queryRunner.query(`ALTER TABLE "general_logs" DROP CONSTRAINT "FK_a9ebaa9beeca8aafa085ea66bb5"`);
		await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_dfccb527e059f170075be4510aa"`);
		await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_896dd7717275f13efacede330d7"`);
		await queryRunner.query(`ALTER TABLE "Usuarios" DROP CONSTRAINT "FK_0ffde2a9c23cdadbda9fa63f5a0"`);
		await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_ad2b90516ac88568151ea1ed9b6"`);
		await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_be323659aaa1cc2be8a756d0c7f"`);
		await queryRunner.query(`ALTER TABLE "s_viewXprofile" DROP CONSTRAINT "FK_dec0f5bcd2b51f0c3114a11a2de"`);
		await queryRunner.query(`ALTER TABLE "actions" DROP CONSTRAINT "FK_dd8cca9369ae4fee07d2a26c22c"`);
		await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_4ff7f0e8e6ea828332a38c5f8c7"`);
		await queryRunner.query(`DROP INDEX "IDX_cf329d7293f6d354cd245401d5" ON "usuarioXprefijo"`);
		await queryRunner.query(`DROP INDEX "IDX_8a8da9b633bf46f431cabed502" ON "usuarioXprefijo"`);
		await queryRunner.query(`DROP TABLE "usuarioXprefijo"`);
		await queryRunner.query(`DROP TABLE "general_logs"`);
		await queryRunner.query(`DROP TABLE "origin_logs"`);
		await queryRunner.query(`DROP TABLE "params"`);
		await queryRunner.query(`DROP TABLE "agregador"`);
		await queryRunner.query(`DROP INDEX "IDX_6d831da89d1af23a619faa299e" ON "Usuarios"`);
		await queryRunner.query(`DROP TABLE "Usuarios"`);
		await queryRunner.query(`DROP TABLE "status"`);
		await queryRunner.query(`DROP INDEX "global_views.IDX_8548d1895f3f0329f8497c8fe6" ON "profile"`);
		await queryRunner.query(`DROP TABLE "profile"`);
		await queryRunner.query(`DROP INDEX "IDX_5262c3bc3e259fe3e231a2811f" ON "s_viewXprofile"`);
		await queryRunner.query(`DROP TABLE "s_viewXprofile"`);
		await queryRunner.query(`DROP TABLE "views"`);
		await queryRunner.query(`DROP TABLE "roles"`);
		await queryRunner.query(`DROP INDEX "IDX_471da4b90e96c1ebe0af221e07" ON "department"`);
		await queryRunner.query(`DROP TABLE "department"`);
		await queryRunner.query(`DROP INDEX "IDX_3c7e9d0204128037852c098df6" ON "Prefijos"`);
		await queryRunner.query(`DROP TABLE "Prefijos"`);
		await queryRunner.query(`DROP TABLE "actions"`);
		await queryRunner.query(`DROP INDEX "IDX_8548d1895f3f0329f8497c8fe6" ON "global_views"`);
		await queryRunner.query(`DROP TABLE "global_views"`);
		await queryRunner.query(`DROP TABLE "permissions"`);
	}
}
