import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import artistyEntity from './artist.entity';

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

  @OneToMany(() => artistyEntity, artist => artist.track, {
    cascade: true,
  })
  artists: artistyEntity[];
}
