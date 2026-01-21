import { levelRepository } from "../../repositories/levels/levels.repository.js";
import { UpdateLevelInput, CreateLevelInput, levelSchema } from "./levels.schema.js";

export namespace LevelService {
    export const getAllLevels = async (page: number = 1, limit: number = 10) => {
        const [levels, total] = await Promise.all([
            levelRepository.getAllLevels(page, limit),
            levelRepository.countLevels()
        ]);

        return {
            levels: levels.map(level => levelSchema.parse(level)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getLevelById = async (id: number) => {
        const level = await levelRepository.getLevelById(id);
        if (!level) return null;
        return levelSchema.parse(level);
    }

    export const createLevel = async (data: CreateLevelInput) => {
        const newLevel = await levelRepository.createLevel(data);
        return levelSchema.parse(newLevel);
    }

    export const updateLevel = async (id: number, data: UpdateLevelInput) => {
        const updatedLevel = await levelRepository.updateLevel(id, data);
        return levelSchema.parse(updatedLevel);
    }

    export const deleteLevel = async (id: number) => {
        const deletedLevel = await levelRepository.deleteLevel(id);
        return levelSchema.parse(deletedLevel);
    }
}
