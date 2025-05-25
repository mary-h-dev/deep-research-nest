import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ai_deep_search')
export class AiDeepSearch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ type: 'text', nullable: true })
  finalResult?: string;

  @Column({ type: 'json', nullable: true })
  rawResult?: any;

  @Column({ type: 'json', nullable: true })
  deepSearchContext?: {
    searchParameters: Record<string, any>;
    sources: string[];
  };

  @Column({ type: 'json', nullable: true })
  metadata?: {
    createdBy?: string;
    createdAt?: string;
    tags?: string[];
  };

  @Column({ nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
