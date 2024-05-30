import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('HISTORICO_CONTRACARGO', { synchronize: false })
export default class Historico_Contracargo {
	@PrimaryGeneratedColumn()
	ID?: number;

	@Column({ nullable: false })
	TERMINAL!: string;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
	MONTO_COBRA!: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
	MONTO_PAGO!: number;
}
