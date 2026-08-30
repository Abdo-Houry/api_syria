import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany
} from "typeorm";

import { Province } from "./province.entity";
import { Place } from "./place.entity";
import { Translations } from "../types/translations";

/*
    منطقة تجمع عدة أماكن داخل محافظة واحدة.
    مثال: «أبواب حلب» وتحتها باب أنطاكية، باب النصر، باب الحديد…
    المكان قد لا ينتمي إلى أي منطقة (area = null).
*/
@Entity("areas")
export class Area {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({
        type: "text",
        nullable: true
    })
    description?: string;

    @Column({
        default: true
    })
    status!: boolean;

    @ManyToOne(
        () => Province,
        {
            onDelete: "CASCADE"
        }
    )
    province!: Province;

    @OneToMany(
        () => Place,
        place => place.area
    )
    places!: Place[];

    @Column({
        type: "jsonb",
        nullable: true
    })
    translations?: Translations;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}
