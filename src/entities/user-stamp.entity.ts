import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn
} from "typeorm";


import {
    User
} from "./user.entity";


import {
    Stamp
} from "./stamp.entity";
import { UserBook } from "./user-book.entity";



@Entity("user_stamps")
export class UserStamp {



    @PrimaryGeneratedColumn()
    id!: number;





    @ManyToOne(
        () => User,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "user_id"
    })
    user!: User;





    @ManyToOne(
        () => Stamp,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "stamp_id"
    })
    stamp!: Stamp;


    @ManyToOne(
        () => UserBook,
        {
            nullable: false,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "user_book_id"
    })
    userBook!: UserBook;





    @CreateDateColumn()
    collected_at!: Date;



}