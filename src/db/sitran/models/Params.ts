import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: false })
export default class Params {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: false })
	key!: string;

	@Column({ nullable: false })
	name!: string;

	@Column({ nullable: false })
	description!: string;

	@Column({ nullable: false })
	value!: string;
}
