import { AppDataSource } from "./config/database";

import app from "./app";

import { env } from "./config/env";

AppDataSource.initialize()

.then(() => {

    console.log("Database Connected");

    app.listen(

        env.PORT,

        () => {

            console.log(

                `Server Running On Port ${env.PORT}`

            );

        }

    );

})

.catch((error) => {

    console.error(error);

});