import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  originalName!: string;

  @Column()
  filePath!: string;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ nullable: true })
  dimensions!: string;

  @Column()
  userId!: string;

  @CreateDateColumn()
  uploadDate!: Date;
}
