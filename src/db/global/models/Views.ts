import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import s_viewXprofile from './ViewsXProfile';

@Entity({ synchronize: false })
export default class Views {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	viewId!: number;

	@OneToMany(() => s_viewXprofile, (viewXprofile) => viewXprofile.view)
	profiles?: s_viewXprofile[];

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ select: false })
	createdAt?: Date;

	@UpdateDateColumn({ select: false })
	updatedAt?: Date;
}
