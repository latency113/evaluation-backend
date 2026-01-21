import { subjectRepository } from "../../repositories/subjects/subjects.repository";
import { UpdateSubjectInput, CreateSubjectInput, subjectSchema } from "./subjects.schema";

export namespace SubjectService {
    export const getAllSubjects = async (page: number = 1, limit: number = 10) => {
        const [subjects, total] = await Promise.all([
            subjectRepository.getAllSubjects(page, limit),
            subjectRepository.countSubjects()
        ]);

        return {
            subjects: subjects.map(subject => subjectSchema.parse(subject)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getSubjectById = async (id: number) => {
        const subject = await subjectRepository.getSubjectById(id);
        if (!subject) return null;
        return subjectSchema.parse(subject);
    }

    export const createSubject = async (data: CreateSubjectInput) => {
        const newSubject = await subjectRepository.createSubject(data);
        return subjectSchema.parse(newSubject);
    }

    export const updateSubject = async (id: number, data: UpdateSubjectInput) => {
        const updatedSubject = await subjectRepository.updateSubject(id, data);
        return subjectSchema.parse(updatedSubject);
    }

    export const deleteSubject = async (id: number) => {
        const deletedSubject = await subjectRepository.deleteSubject(id);
        return subjectSchema.parse(deletedSubject);
    }
}
