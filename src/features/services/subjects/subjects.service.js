import { subjectRepository } from "../../repositories/subjects/subjects.repository";
import { subjectSchema } from "./subjects.schema";
export var SubjectService;
(function (SubjectService) {
    SubjectService.getAllSubjects = async (page = 1, limit = 10) => {
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
    };
    SubjectService.getSubjectById = async (id) => {
        const subject = await subjectRepository.getSubjectById(id);
        if (!subject)
            return null;
        return subjectSchema.parse(subject);
    };
    SubjectService.createSubject = async (data) => {
        const newSubject = await subjectRepository.createSubject(data);
        return subjectSchema.parse(newSubject);
    };
    SubjectService.updateSubject = async (id, data) => {
        const updatedSubject = await subjectRepository.updateSubject(id, data);
        return subjectSchema.parse(updatedSubject);
    };
    SubjectService.deleteSubject = async (id) => {
        const deletedSubject = await subjectRepository.deleteSubject(id);
        return subjectSchema.parse(deletedSubject);
    };
})(SubjectService || (SubjectService = {}));
