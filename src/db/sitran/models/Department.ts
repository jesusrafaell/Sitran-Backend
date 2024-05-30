import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Profile from './Profile';

@Entity({ synchronize: false })
@Index(['name'], { unique: true })
export default class Department {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	name!: string;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;

	@OneToMany(() => Profile, (Profile) => Profile.department)
	profiles?: Profile[];
}
