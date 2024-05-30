import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Prefijos', { synchronize: false })
@Index(['value', 'name'], { unique: true })
export default class Prefijo {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ nullable: false })
	value!: string;

	@Column({ nullable: false })
	name!: string;

	@Column({ nullable: false })
	subname!: string;
}
