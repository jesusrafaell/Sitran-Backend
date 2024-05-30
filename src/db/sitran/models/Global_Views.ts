import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Actions from './Actions';

@Entity({ synchronize: false })
export default class Global_Views {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true, unique: true })
	name!: string;

	@Column({ nullable: true, unique: true })
	root!: string;

	@Column()
	description: string;

	@Column({ nullable: false, unique: true })
	key!: number;

	// @OneToMany(() => Actions, (Actions) => Actions.view)
	// @JoinColumn({ name: 'actions' })
	// actions?: Actions[];

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
