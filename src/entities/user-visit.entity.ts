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
    Province
} from "./province.entity";


import {
    Place
} from "./place.entity";
import { UserBook } from "./user-book.entity";



@Entity("user_visits")
export class UserVisit {


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




    /*
        إذا كانت الزيارة للمحافظة
    */

    @ManyToOne(
        () => Province,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "province_id"
    })
    province?: Province;





    /*
        إذا كانت الزيارة لمكان أثري
    */

    @ManyToOne(
        () => Place,
        {
            nullable: true,
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({
        name: "place_id"
    })
    place?: Place;


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





    @Column({
        default: false
    })
    completed!: boolean;




    @CreateDateColumn()
    visited_at!: Date;


}