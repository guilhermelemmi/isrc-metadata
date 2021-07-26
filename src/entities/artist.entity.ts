import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import trackEntity from './track.entity';

@Entity()
export default class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => trackEntity, track => track.artists)
  tracks: trackEntity[];
}
