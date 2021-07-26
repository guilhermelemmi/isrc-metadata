import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import artistEntity from './artist.entity';

@Entity()
export default class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  isrc: string;

  @Column()
  title: string;

  @Column()
  imageURI: string;

  @ManyToMany(() => artistEntity, artist => artist.tracks, {
    cascade: true,
  })
  @JoinTable()
  artists: artistEntity[];
}
