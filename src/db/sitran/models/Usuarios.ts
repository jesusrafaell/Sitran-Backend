import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Agregador from './Agregador';
import Prefijo from './Prefijo';
import Profile from './Profile';
import Status from './Status';

@Entity('Usuarios', { synchronize: false })
@Index(['id_type', 'ident'], { unique: true })
export default class Usuarios {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: false })
	login!: string;

	@Column({ nullable: false })
	password!: string;

	@Column({ nullable: false })
	name!: string;

	@Column({ nullable: false })
	id_type!: string;

	@Column({ nullable: false })
	ident!: string;

	@Column({ nullable: false })
	email!: string;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;

	@Column({ type: 'date' })
	expiration!: Date;

	@Column({ default: 0 })
	entrys?: number;

	@ManyToOne(() => Status, (status) => status.usuarios)
	status!: Status;

	@ManyToMany(() => Prefijo)
	@JoinTable({ name: 'usuarioXprefijo' })
	prefijos?: Prefijo[];

	@ManyToOne(() => Profile, (profile) => profile.usuarios)
	profile: Profile;

	@ManyToOne(() => Agregador, (agr) => agr.usuarios)
	agregador?: Agregador;
}
