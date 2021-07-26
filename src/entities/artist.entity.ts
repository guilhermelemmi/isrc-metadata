import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import Track from './track.entity';

@Entity()
export default class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Track, (track) => track.artists)
  tracks: Track[];
}
