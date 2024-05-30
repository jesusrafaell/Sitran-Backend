import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Jobs from './jobs';
import jobs_prod from './Jobs_Prod';

@Entity('category_job', { synchronize: true })
export default class Category_Job {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true, unique: true })
	name!: string;

	@OneToMany(() => Jobs, (Jobs) => Jobs.category)
	jobs?: Jobs[];

	@OneToMany(() => jobs_prod, (jobs_prod) => jobs_prod.category)
	prod?: jobs_prod[];

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
