import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1667239044399 implements MigrationInterface {
    name = 'Migration1667239044399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "abono_cliente_rechazado" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_57ec4fddc539821c74f25847b7a" DEFAULT 1, "createdAt" date NOT NULL CONSTRAINT "DF_01543789bd8aef6b7389ee43ec1" DEFAULT getdate(), "updatedAt" date NOT NULL CONSTRAINT "DF_7342fe17efdb1042fda8278b9d6" DEFAULT getdate(), CONSTRAINT "PK_b66f33979adbd217f5a552efa30" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b16b05a9eca05d915efd03fa5a" ON "abono_cliente_rechazado" ("name") `);
        await queryRunner.query(`CREATE TABLE "contra_cargo" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255), "active" int NOT NULL CONSTRAINT "DF_c9593a5ce0226d6ae095de62021" DEFAULT 1, "createdAt" date NOT NULL CONSTRAINT "DF_9e5032bf32cb0b2e73c27e3bd58" DEFAULT getdate(), "updatedAt" date NOT NULL CONSTRAINT "DF_45a16a0539fe7b36e7aed825d12" DEFAULT getdate(), CONSTRAINT "PK_e150b9292a14450285f43f60679" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_65cada11aceb02caf4726b7b5a" ON "contra_cargo" ("name") `);
        await queryRunner.query(`CREATE TABLE "contracargo_ejecutado" ("id" int NOT NULL IDENTITY(1,1), "id_usuario" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_f0bde32fdb01128a9504ba48fd2" DEFAULT 1, "createdAt" date NOT NULL CONSTRAINT "DF_55b1052e097f6721142047ee2a9" DEFAULT getdate(), "createdAtFull" datetime NOT NULL CONSTRAINT "DF_e2c4952b27ce54134e233a8e798" DEFAULT getdate(), "updatedAt" date NOT NULL CONSTRAINT "DF_03d08177211318fd024dc76cd27" DEFAULT getdate(), CONSTRAINT "PK_b7221449b30adb4614a99e90e3c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "s_viewXprofile" ("id" int NOT NULL IDENTITY(1,1), "profileId" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_7c87002dfcc040d1758e06cc12f" DEFAULT 1, "viewId" int, CONSTRAINT "PK_ce1cf5afc3eb0e56ecda1e8cff1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5262c3bc3e259fe3e231a2811f" ON "s_viewXprofile" ("profileId", "viewId") `);
        await queryRunner.query(`CREATE TABLE "views" ("id" int NOT NULL IDENTITY(1,1), "viewId" int NOT NULL, "active" int NOT NULL CONSTRAINT "DF_a5d821bd12a20c9e7bcd8fe5678" DEFAULT 1, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_a8b7f725007cb9ddd8098a71813" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_04f7f71efc2398d52010a4ab30e" DEFAULT getdate(), CONSTRAINT "PK_ae7537f375649a618fff0fb2cb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "s_viewXprofile" ADD CONSTRAINT "FK_dec0f5bcd2b51f0c3114a11a2de" FOREIGN KEY ("viewId") REFERENCES "views"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s_viewXprofile" DROP CONSTRAINT "FK_dec0f5bcd2b51f0c3114a11a2de"`);
        await queryRunner.query(`DROP TABLE "views"`);
        await queryRunner.query(`DROP INDEX "IDX_5262c3bc3e259fe3e231a2811f" ON "s_viewXprofile"`);
        await queryRunner.query(`DROP TABLE "s_viewXprofile"`);
        await queryRunner.query(`DROP TABLE "contracargo_ejecutado"`);
        await queryRunner.query(`DROP INDEX "IDX_65cada11aceb02caf4726b7b5a" ON "contra_cargo"`);
        await queryRunner.query(`DROP TABLE "contra_cargo"`);
        await queryRunner.query(`DROP INDEX "IDX_b16b05a9eca05d915efd03fa5a" ON "abono_cliente_rechazado"`);
        await queryRunner.query(`DROP TABLE "abono_cliente_rechazado"`);
    }

}
