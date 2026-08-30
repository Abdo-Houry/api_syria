import { AreaService } from "../services/area.service";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";
import {
    createAreaSchema,
    updateAreaSchema
} from "../validations/area.validation";

const service = new AreaService();

export const createArea =
    asyncHandler(async (req, res) => {
        const data = createAreaSchema.parse(req.body);
        const area = await service.create(data);

        res.status(201).json(
            new ApiResponse(true, "Area created", area)
        );
    });

export const getAreas =
    asyncHandler(async (req, res) => {
        const areas = await service.findAll();

        res.json(
            new ApiResponse(true, "Areas", areas)
        );
    });

export const getAreaById =
    asyncHandler(async (req, res) => {
        const area = await service.findById(Number(req.params.id));

        res.json(
            new ApiResponse(true, "Area", area)
        );
    });

export const updateArea =
    asyncHandler(async (req, res) => {
        const data = updateAreaSchema.parse(req.body);
        const area = await service.update(Number(req.params.id), data);

        res.json(
            new ApiResponse(true, "Area updated", area)
        );
    });

export const deleteArea =
    asyncHandler(async (req, res) => {
        await service.delete(Number(req.params.id));

        res.json(
            new ApiResponse(true, "Area deleted")
        );
    });
