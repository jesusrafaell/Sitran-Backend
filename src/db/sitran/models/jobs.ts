import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Category_Job from './category';
import jobs_prod from './Jobs_Prod';
import Types_Jobs from './types_jobs';

@Entity('jobs', { synchronize: true })
export default class Jobs {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	id_job!: string;

	@ManyToOne(() => Category_Job, (Category_Job) => Category_Job.jobs)
	@JoinColumn({ name: 'category' })
	category!: Category_Job;

	@Column({ nullable: true, unique: true })
	name!: string;

	@ManyToOne(() => Types_Jobs, (Types_Jobs) => Types_Jobs.jobs)
	@JoinColumn({ name: 'type' })
	type: Types_Jobs;

	@Column({ nullable: true, unique: true })
	order_exec!: number;

	@Column({ nullable: true })
	descripcion!: string;

	@Column({ nullable: true })
	server_origin!: string;

	@OneToMany(() => jobs_prod, (jobs_prod) => jobs_prod.job)
	@JoinColumn()
	jobs_prod?: jobs_prod[];

	@Column({ nullable: true })
	active!: number;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
