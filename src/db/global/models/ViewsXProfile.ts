import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Views from './Views';

@Entity('s_viewXprofile', { synchronize: false })
@Index(['profileId', 'view'], { unique: true })
export default class s_viewXprofile {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	profileId!: number;

	@ManyToOne(() => Views, (v) => v.profiles)
	view!: Views;

	@Column({ default: 1 })
	active?: number;
}
