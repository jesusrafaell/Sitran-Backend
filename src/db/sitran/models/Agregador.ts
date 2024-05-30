import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Usuarios from './Usuarios';

@Entity({ synchronize: false })
export default class Agregador {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: false })
	name!: string;

	@Column({ nullable: false })
	key!: number;

	@Column({ default: 1 })
	active?: number;

	@OneToMany(() => Usuarios, (user) => user.agregador)
	usuarios?: Usuarios[];
}
