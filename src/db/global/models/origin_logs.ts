import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import general_logs from './general_logs';

@Entity({ synchronize: false })
export default class origin_logs {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	name!: string;

	@OneToMany(() => general_logs, (general_logs) => general_logs.id_origin_logs)
	@JoinColumn({ name: 'general_logs' })
	general_logs?: general_logs[];
}
