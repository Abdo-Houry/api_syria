import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Column,
    OneToMany
} from "typeorm";


import {
    User
} from "./user.entity";


import {
    BookCopy
} from "./book-copy.entity";
import { UserStamp } from "./user-stamp.entity";
import { UserChallenge } from "./user-challenge.entity";
import { UserVisit } from "./user-visit.entity";



@Entity("user_books")
export class UserBook {



    @PrimaryGeneratedColumn()
    id!: number;




    @ManyToOne(
        () => User,
        user => user.books,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "user_id"
    })
    user!: User;





    @ManyToOne(
        () => BookCopy,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "book_copy_id"
    })
    book_copy!: BookCopy;





    @Column({
        default: true
    })
    active!: boolean;


    @OneToMany(
        () => UserVisit,
        visit => visit.userBook
    )
    visits!: UserVisit[];





    @OneToMany(
        () => UserChallenge,
        challenge => challenge.userBook
    )
    challenges!: UserChallenge[];





    @OneToMany(
        () => UserStamp,
        stamp => stamp.userBook
    )
    stamps!: UserStamp[];





    @CreateDateColumn()
    purchased_at!: Date;


}