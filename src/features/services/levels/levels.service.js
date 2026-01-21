import { levelRepository } from "../../repositories/levels/levels.repository";
import { levelSchema } from "./levels.schema";
export var LevelService;
(function (LevelService) {
    LevelService.getAllLevels = async (page = 1, limit = 10) => {
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
    };
    LevelService.getLevelById = async (id) => {
        const level = await levelRepository.getLevelById(id);
        if (!level)
            return null;
        return levelSchema.parse(level);
    };
    LevelService.createLevel = async (data) => {
        const newLevel = await levelRepository.createLevel(data);
        return levelSchema.parse(newLevel);
    };
    LevelService.updateLevel = async (id, data) => {
        const updatedLevel = await levelRepository.updateLevel(id, data);
        return levelSchema.parse(updatedLevel);
    };
    LevelService.deleteLevel = async (id) => {
        const deletedLevel = await levelRepository.deleteLevel(id);
        return levelSchema.parse(deletedLevel);
    };
})(LevelService || (LevelService = {}));
