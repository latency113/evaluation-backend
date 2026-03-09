-- AlterTable
ALTER TABLE `Classrooms` MODIFY `room_name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `CourseAssignments` MODIFY `term` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `Students` MODIFY `student_code` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Subjects` MODIFY `subject_code` VARCHAR(50) NOT NULL;
