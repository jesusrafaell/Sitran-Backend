import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ synchronize: false })
export default class Contactos {
	@PrimaryGeneratedColumn()
	contCode?: number;

	@Column({ nullable: false })
	contCodComer!: number;

	@Column({ nullable: false })
	contNombres!: string;

	@Column({ nullable: false })
	contApellidos!: string;

	@Column({ nullable: false })
	contTelefLoc!: string;

	@Column({ nullable: false })
	contTelefMov!: string;

	@Column({ nullable: false })
	contMail!: string;

	@Column({ nullable: true })
	contCodUsuario: string;

	@Column({ type: 'smalldatetime', nullable: true })
	contFreg: Date;
}
