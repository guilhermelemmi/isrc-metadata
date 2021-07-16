import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Track from './track.entity';

@Entity()
export default class Artist {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Track, track => track.artists)
  track: Track;
}
