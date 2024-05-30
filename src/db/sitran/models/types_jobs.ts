import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Jobs from './jobs';

@Entity('types_jobs', { synchronize: true })
export default class Types_Jobs {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true, unique: true })
	name!: string;

	@OneToMany(() => Jobs, (Jobs) => Jobs.type)
	jobs?: Jobs[];

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
