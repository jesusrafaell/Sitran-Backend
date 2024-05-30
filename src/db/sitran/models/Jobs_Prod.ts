import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Category_Job from './category';
import Jobs from './jobs';

@Entity('JOBS_PROD', { synchronize: true })
export default class jobs_prod {
	@PrimaryGeneratedColumn()
	id?: number;

	@ManyToOne(() => Jobs, (job) => job.jobs_prod)
	@JoinColumn({ name: 'job' })
	job!: Jobs;

	@ManyToOne(() => Category_Job, (Category_Job) => Category_Job.prod)
	@JoinColumn({ name: 'category' })
	category!: Category_Job;

	@Column({ nullable: true })
	date_exec!: string;

	@Column({ nullable: true })
	hours_init_exec!: string;

	@Column({ nullable: true })
	hours_end_exec!: string;

	@Column({ nullable: true })
	duration_exec!: string;

	@Column({ nullable: true })
	status!: number;

	@Column({ nullable: true })
	message!: string;

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
