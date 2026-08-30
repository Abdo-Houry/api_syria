import { AppDataSource } from "../config/database";
import { Area } from "../entities/area.entity";
import { Province } from "../entities/province.entity";
import { ApiError } from "../utils/api-error";
import { CreateAreaDTO, UpdateAreaDTO } from "../models/area.model";

export class AreaService {

    private repository =
        AppDataSource.getRepository(Area);

    private provinceRepository =
        AppDataSource.getRepository(Province);

    private async getProvince(id: number) {
        const province =
            await this.provinceRepository.findOne({
                where: { id }
            });

        if (!province) {
            throw new ApiError(404, "Province not found");
        }

        return province;
    }

    async create(data: CreateAreaDTO) {
        const province =
            await this.getProvince(data.provinceId);

        const area =
            this.repository.create({
                name: data.name,
                description: data.description,
                translations: data.translations,

                province
            });

        return await this.repository.save(area);
    }

    async findAll() {
        return await this.repository.find({
            relations: {
                province: true,
                places: true
            },
            order: {
                created_at: "DESC"
            }
        });
    }

    async findById(id: number) {
        const area =
            await this.repository.findOne({
                where: { id },
                relations: {
                    province: true,
                    places: true
                }
            });

        if (!area) {
            throw new ApiError(404, "Area not found");
        }

        return area;
    }

    async update(id: number, data: UpdateAreaDTO) {
        const area =
            await this.findById(id);

        const { provinceId, ...rest } = data;

        if (provinceId !== undefined) {
            area.province =
                await this.getProvince(provinceId);
        }

        Object.assign(area, rest);

        return await this.repository.save(area);
    }

    async delete(id: number) {
        const area =
            await this.findById(id);

        await this.repository.softRemove(area);

        return true;
    }
}
