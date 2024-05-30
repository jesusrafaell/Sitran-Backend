import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ synchronize: false })
@Index(['name'], { unique: true })
export default class contra_cargo {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: true })
	name!: string;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ type: 'date' })
	createdAt?: Date;

	@UpdateDateColumn({ type: 'date' })
	updatedAt?: Date;
}
