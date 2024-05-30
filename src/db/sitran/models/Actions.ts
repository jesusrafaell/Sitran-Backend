import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	OneToMany,
	JoinColumn,
	CreateDateColumn,
	ManyToOne,
} from 'typeorm';
import Permissions from './Permissions';
import Views from './Global_Views';

@Entity({ synchronize: false })
export default class Actions {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	name!: string;

	@Column({ nullable: true })
	description!: string;

	// @ManyToOne(() => Views, (Views) => Views.actions)
	// @JoinColumn({ name: 'id_views' })
	// view!: number;

	@OneToMany(() => Permissions, (Permissions) => Permissions.id_action)
	@JoinColumn({ name: 'permissions' })
	permissions?: Permissions[];

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
