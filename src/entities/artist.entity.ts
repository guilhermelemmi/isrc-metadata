import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import trackEntity from './track.entity';

@Entity()
export default class Artist {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => trackEntity, track => track.artists)
  @JoinColumn({ name: 'track_id' })
  track: trackEntity;
}
