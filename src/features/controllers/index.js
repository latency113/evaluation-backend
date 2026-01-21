import { Router } from "express";
import { UserController } from "./users/users.controller";
import { DepartmentController } from "./departments/departments.controller";
import { LevelController } from "./levels/levels.controller";
import { ClassroomController } from "./classrooms/classrooms.controller";
import { TeacherController } from "./teachers/teachers.controller";
import { SubjectController } from "./subjects/subjects.controller";
import { CourseAssignmentController } from "./course-assignments/course-assignments.controller";
import { StudentController } from "./students/students.controller";
import { EvaluationController } from "./evaluations/evaluations.controller";
import { EvaluationQuestionController } from "./evaluation-questions/evaluation-questions.controller";
import { EvaluationAnswerController } from "./evaluation-answers/evaluation-answers.controller";
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
// User routes
router.get("/users", UserController.getAllUsersHandler);
router.get("/users/:id", UserController.getUserByIdHandler);
router.post("/users", UserController.createUserHandler);
router.put("/users/:id", UserController.updateUserHandler);
router.delete("/users/:id", UserController.deleteUserHandler);
// Department routes
router.get("/departments", DepartmentController.getAllDepartmentsHandler);
router.get("/departments/search", DepartmentController.getDepartmentByNameHandler);
router.get("/departments/:id", DepartmentController.getDepartmentByIdHandler);
router.post("/departments", DepartmentController.createDepartmentHandler);
router.put("/departments/:id", DepartmentController.updateDepartmentHandler);
router.delete("/departments/:id", DepartmentController.deleteDepartmentHandler);
// Level routes
router.get("/levels", LevelController.getAllLevelsHandler);
router.get("/levels/search", LevelController.getLevelByNameHandler);
router.get("/levels/:id", LevelController.getLevelByIdHandler);
router.post("/levels", LevelController.createLevelHandler);
router.put("/levels/:id", LevelController.updateLevelHandler);
router.delete("/levels/:id", LevelController.deleteLevelHandler);
// Classroom routes
router.get("/classrooms", ClassroomController.getAllClassroomsHandler);
router.get("/classrooms/search", ClassroomController.getClassroomByNameHandler);
router.post("/classrooms/import", upload.single('file'), ClassroomController.importClassroomHandler);
router.get("/classrooms/:id", ClassroomController.getClassroomByIdHandler);
router.post("/classrooms", ClassroomController.createClassroomHandler);
router.put("/classrooms/:id", ClassroomController.updateClassroomHandler);
router.delete("/classrooms/:id", ClassroomController.deleteClassroomHandler);
// Teacher routes
router.get("/teachers", TeacherController.getAllTeachersHandler);
router.get("/teachers/search", TeacherController.getTeacherByNameHandler);
router.get("/teachers/:id", TeacherController.getTeacherByIdHandler);
router.post("/teachers", TeacherController.createTeacherHandler);
router.put("/teachers/:id", TeacherController.updateTeacherHandler);
router.delete("/teachers/:id", TeacherController.deleteTeacherHandler);
// Subject routes
router.get("/subjects", SubjectController.getAllSubjectsHandler);
router.get("/subjects/:id", SubjectController.getSubjectByIdHandler);
router.post("/subjects", SubjectController.createSubjectHandler);
router.put("/subjects/:id", SubjectController.updateSubjectHandler);
router.delete("/subjects/:id", SubjectController.deleteSubjectHandler);
// Course Assignment routes
router.get("/course-assignments", CourseAssignmentController.getAllAssignmentsHandler);
router.get("/course-assignments/:id", CourseAssignmentController.getAssignmentByIdHandler);
router.post("/course-assignments", CourseAssignmentController.createAssignmentHandler);
router.put("/course-assignments/:id", CourseAssignmentController.updateAssignmentHandler);
router.delete("/course-assignments/:id", CourseAssignmentController.deleteAssignmentHandler);
// Student routes
router.get("/students", StudentController.getAllStudentsHandler);
router.get("/students/:id", StudentController.getStudentByIdHandler);
router.post("/students", StudentController.createStudentHandler);
router.put("/students/:id", StudentController.updateStudentHandler);
router.delete("/students/:id", StudentController.deleteStudentHandler);
// Evaluation routes
router.get("/evaluations", EvaluationController.getAllEvaluationsHandler);
router.get("/evaluations/:id", EvaluationController.getEvaluationByIdHandler);
router.post("/evaluations", EvaluationController.createEvaluationHandler);
router.put("/evaluations/:id", EvaluationController.updateEvaluationHandler);
router.delete("/evaluations/:id", EvaluationController.deleteEvaluationHandler);
// Evaluation Question routes
router.get("/evaluation-questions", EvaluationQuestionController.getAllQuestionsHandler);
router.get("/evaluation-questions/:id", EvaluationQuestionController.getQuestionByIdHandler);
router.post("/evaluation-questions", EvaluationQuestionController.createQuestionHandler);
router.put("/evaluation-questions/:id", EvaluationQuestionController.updateQuestionHandler);
router.delete("/evaluation-questions/:id", EvaluationQuestionController.deleteQuestionHandler);
// Evaluation Answer routes
router.get("/evaluation-answers", EvaluationAnswerController.getAllAnswersHandler);
router.get("/evaluation-answers/:id", EvaluationAnswerController.getAnswerByIdHandler);
router.post("/evaluation-answers", EvaluationAnswerController.createAnswerHandler);
router.put("/evaluation-answers/:id", EvaluationAnswerController.updateAnswerHandler);
router.delete("/evaluation-answers/:id", EvaluationAnswerController.deleteAnswerHandler);
export default router;
