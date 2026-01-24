import prisma from "./src/providers/database/database.provider.js";
import dotenv from "dotenv";

dotenv.config();

async function cleanupTeachers() {
    console.log("Starting teacher cleanup and merge...");

    // 1. Get all teachers who have "-" or "" as last_name (the duplicates)
    const incompleteTeachers = await prisma.teacher.findMany({
        where: {
            OR: [
                { last_name: "-" },
                { last_name: "" }
            ]
        }
    });

    console.log(`Found ${incompleteTeachers.length} incomplete records.`);

    for (const badTeacher of incompleteTeachers) {
        // Find potential matches with the same first name but different ID and valid last name
        const goodTeacher = await prisma.teacher.findFirst({
            where: {
                first_name: { contains: badTeacher.first_name },
                id: { not: badTeacher.id },
                NOT: [
                    { last_name: "-" },
                    { last_name: "" }
                ]
            }
        });

        if (goodTeacher) {
            console.log(`Merging ID ${badTeacher.id} (${badTeacher.first_name}) into ID ${goodTeacher.id} (${goodTeacher.first_name} ${goodTeacher.last_name})`);
            
            // Reassign assignments
            const updateResult = await prisma.courseAssignment.updateMany({
                where: { teacher_id: badTeacher.id },
                data: { teacher_id: goodTeacher.id }
            });
            
            console.log(`  Moved ${updateResult.count} assignments.`);

            // Delete the bad record
            await prisma.teacher.delete({
                where: { id: badTeacher.id }
            });
            console.log(`  Deleted incomplete record ID ${badTeacher.id}.`);
        } else {
            console.log(`No clear match found for ${badTeacher.first_name} (ID: ${badTeacher.id}). Skipping.`);
        }
    }

    console.log("Cleanup finished.");
}

cleanupTeachers()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
