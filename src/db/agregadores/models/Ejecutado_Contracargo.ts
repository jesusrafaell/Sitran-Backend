import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	Index,
	OneToOne,
	JoinColumn,
} from 'typeorm';

@Entity('contracargo_ejecutado', { synchronize: false })
export default class ejecutado_contracargo {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ name: 'id_usuario' })
	id_usuario!: number;

	@Column({ default: 1 })
	active?: number;

	@CreateDateColumn({ type: 'date' })
	createdAt?: Date;

	@CreateDateColumn({ type: 'datetime' })
	createdAtFull?: Date;

	@UpdateDateColumn({ type: 'date' })
	updatedAt?: Date;
}
