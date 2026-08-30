import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Column
} from "typeorm";


import {
    User
} from "./user.entity";


import {
    Challenge
} from "./challenge.entity";
import { UserBook } from "./user-book.entity";



@Entity("user_challenges")
export class UserChallenge {



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
        () => Challenge,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "challenge_id"
    })
    challenge!: Challenge;





    @Column({
        default: false
    })
    completed!: boolean;





    @Column({
        type: "text",
        nullable: true
    })
    answer?: string;


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
    completed_at!: Date;


}