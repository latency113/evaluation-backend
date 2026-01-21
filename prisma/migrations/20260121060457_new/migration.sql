-- CreateTable
CREATE TABLE `Users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'teacher') NOT NULL DEFAULT 'teacher',
    `ref_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departments` (
    `dept_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Levels` (
    `level_id` INTEGER NOT NULL AUTO_INCREMENT,
    `level_name` VARCHAR(50) NOT NULL,
    `dept_id` INTEGER NULL,

    PRIMARY KEY (`level_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classrooms` (
    `classroom_id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_name` VARCHAR(20) NOT NULL,
    `level_id` INTEGER NULL,

    PRIMARY KEY (`classroom_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teachers` (
    `teacher_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subjects` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_code` VARCHAR(10) NOT NULL,
    `subject_name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Subjects_subject_code_key`(`subject_code`),
    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseAssignments` (
    `assignment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NULL,
    `subject_id` INTEGER NULL,
    `classroom_id` INTEGER NULL,
    `term` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`assignment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Students` (
    `student_id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_code` VARCHAR(20) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `classroom_id` INTEGER NULL,

    UNIQUE INDEX `Students_student_code_key`(`student_code`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluations` (
    `eval_id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignment_id` INTEGER NULL,
    `student_id` INTEGER NULL,
    `suggestion` TEXT NULL,
    `eval_date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Evaluations_assignment_id_student_id_key`(`assignment_id`, `student_id`),
    PRIMARY KEY (`eval_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationQuestions` (
    `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_text` TEXT NOT NULL,

    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationAnswers` (
    `answer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `eval_id` INTEGER NULL,
    `question_id` INTEGER NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`answer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Levels` ADD CONSTRAINT `Levels_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `Departments`(`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classrooms` ADD CONSTRAINT `Classrooms_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `Levels`(`level_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignments` ADD CONSTRAINT `CourseAssignments_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teachers`(`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignments` ADD CONSTRAINT `CourseAssignments_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subjects`(`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignments` ADD CONSTRAINT `CourseAssignments_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classrooms`(`classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classrooms`(`classroom_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_assignment_id_fkey` FOREIGN KEY (`assignment_id`) REFERENCES `CourseAssignments`(`assignment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluations` ADD CONSTRAINT `Evaluations_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Students`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationAnswers` ADD CONSTRAINT `EvaluationAnswers_eval_id_fkey` FOREIGN KEY (`eval_id`) REFERENCES `Evaluations`(`eval_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationAnswers` ADD CONSTRAINT `EvaluationAnswers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `EvaluationQuestions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;
