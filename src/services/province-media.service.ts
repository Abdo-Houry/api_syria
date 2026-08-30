import {
    AppDataSource
} from "../config/database";


import {
    Province
} from "../entities/province.entity";


import {
    ProvinceImage
} from "../entities/province-image.entity";


import {
    ProvinceVideo
} from "../entities/province-video.entity";


import {
    ApiError
} from "../utils/api-error";



export class ProvinceMediaService {


    private provinceRepository =
        AppDataSource.getRepository(Province);



    private imageRepository =
        AppDataSource.getRepository(ProvinceImage);



    private videoRepository =
        AppDataSource.getRepository(ProvinceVideo);





    async addImages(
        provinceId: number,
        files: Express.Multer.File[]
    ) {


        const province =
            await this.provinceRepository.findOne({

                where: {
                    id: provinceId
                }

            });



        if (!province) {

            throw new ApiError(
                404,
                "Province not found"
            );

        }



        const images =
            files.map(file => {


                return this.imageRepository.create({

                    image_url:
                        `/uploads/provinces/${file.filename}`,

                    province

                });


            });



        return await this.imageRepository.save(images);


    }







    async addVideos(
        provinceId: number,
        files: Express.Multer.File[]
    ) {


        const province =
            await this.provinceRepository.findOne({

                where: {
                    id: provinceId
                }

            });



        if (!province) {

            throw new ApiError(
                404,
                "Province not found"
            );

        }



        const videos =
            files.map(file => {


                return this.videoRepository.create({

                    video_url:
                        `/uploads/provinces/${file.filename}`,

                    province

                });


            });



        return await this.videoRepository.save(videos);


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