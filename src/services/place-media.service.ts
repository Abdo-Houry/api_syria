import {
    AppDataSource
} from "../config/database";


import {
    Place
} from "../entities/place.entity";


import {
    PlaceImage
} from "../entities/place-image.entity";


import {
    PlaceVideo
} from "../entities/place-video.entity";


import {
    ApiError
} from "../utils/api-error";



export class PlaceMediaService {



    private placeRepository =
        AppDataSource.getRepository(Place);



    private imageRepository =
        AppDataSource.getRepository(PlaceImage);



    private videoRepository =
        AppDataSource.getRepository(PlaceVideo);





    async addImages(

        placeId: number,

        files: Express.Multer.File[]

    ) {


        const place =
            await this.placeRepository.findOne({

                where: {
                    id: placeId
                }

            });



        if (!place) {

            throw new ApiError(
                404,
                "Place not found"
            );

        }



        const images =
            files.map(
                file => {


                    return this.imageRepository.create({

                        image_url:
                            `/uploads/places/${file.filename}`,

                        place

                    });


                }
            );



        return await this.imageRepository.save(
            images
        );


    }







    async addVideos(

        placeId: number,

        files: Express.Multer.File[]

    ) {


        const place =
            await this.placeRepository.findOne({

                where: {
                    id: placeId
                }

            });



        if (!place) {

            throw new ApiError(
                404,
                "Place not found"
            );

        }



        const videos =
            files.map(
                file => {


                    return this.videoRepository.create({

                        video_url:
                            `/uploads/places/${file.filename}`,

                        place

                    });


                }
            );



        return await this.videoRepository.save(
            videos
        );


    }




    /*
        حذف عنصر وسائط مفرد — الرفع بلا حذف يجعل أي خطأ دائماً.
    */

    async removeImage(
        imageId: number
    ) {


        const image =
            await this.imageRepository.findOne({

                where: {
                    id: imageId
                }

            });



        if (!image) {

            throw new ApiError(
                404,
                "Image not found"
            );

        }



        await this.imageRepository.remove(image);


        return true;


    }




    async removeVideo(
        videoId: number
    ) {


        const video =
            await this.videoRepository.findOne({

                where: {
                    id: videoId
                }

            });



        if (!video) {

            throw new ApiError(
                404,
                "Video not found"
            );

        }



        await this.videoRepository.remove(video);


        return true;


    }


}