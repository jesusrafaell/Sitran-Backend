import {
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Usuarios from './Usuarios';
import Department from './Department';
import Roles from './Roles';
import s_viewXprofile from '../../global/models/ViewsXProfile';

@Entity({ synchronize: false })
@Index(['department', 'rol'], { unique: true })
export default class Profile {
	@PrimaryGeneratedColumn()
	id?: number;

	@OneToMany(() => Usuarios, (usuario) => usuario.profile)
	usuarios?: Usuarios[];

	@ManyToOne(() => Department, (department) => department.profiles)
	@JoinColumn({ name: 'department' })
	department!: Department;

	@ManyToOne(() => Roles, (roles) => roles.profiles)
	@JoinColumn({ name: 'rol' })
	rol!: Roles;

	@OneToMany(() => s_viewXprofile, (viewXprofile) => viewXprofile.profileId)
	views?: s_viewXprofile[];

	@CreateDateColumn()
	createdAt?: Date;

	@UpdateDateColumn()
	updatedAt?: Date;
}
