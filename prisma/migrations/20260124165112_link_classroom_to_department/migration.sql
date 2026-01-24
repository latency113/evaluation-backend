-- AlterTable
ALTER TABLE `Classrooms` ADD COLUMN `dept_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Classrooms` ADD CONSTRAINT `Classrooms_dept_id_fkey` FOREIGN KEY (`dept_id`) REFERENCES `Departments`(`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE;
