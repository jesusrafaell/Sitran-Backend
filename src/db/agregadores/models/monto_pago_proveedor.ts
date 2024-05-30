import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MONTOS_PAGO_PROVEEDORES', { synchronize: false })
export default class monto_pago_proveedor {
	@PrimaryGeneratedColumn()
	ID?: number;

	@Column({ nullable: false })
	TERMINAL!: string;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
	MONTO!: number;
}
