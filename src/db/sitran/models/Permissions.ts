import {
	Entity,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne,
	Column,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import actions from './Actions';

@Entity({ synchronize: false })
export default class Permissions {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	profile!: number;

	@ManyToOne(() => actions, (actions) => actions.permissions)
	@JoinColumn({ name: 'id_action' })
	id_action!: actions;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
