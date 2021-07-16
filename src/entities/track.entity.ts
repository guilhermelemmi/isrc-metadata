import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Artist from './artist.entity';

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

  @OneToMany(() => Artist, artist => artist.track)
  artists: Artist[];
}
