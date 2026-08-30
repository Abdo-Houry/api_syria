import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";


@Entity("admins")
export class Admin {


    @PrimaryGeneratedColumn()
    id!: number;


    @Column({
        unique: true
    })
    username!: string;


    @Column()
    password!: string;


    @CreateDateColumn()
    created_at!: Date;


    @UpdateDateColumn()
    updated_at!: Date;

}