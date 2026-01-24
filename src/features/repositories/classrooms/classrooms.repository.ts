import prisma from "@/providers/database/database.provider.js";

export namespace classroomRepository {
  export const getAllClassrooms = async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
    deptId?: number,
  ) => {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (deptId) {
      where.level = {
        dept_id: deptId,
      };
    }

    if (searchTerm) {
      where.OR = [
        { room_name: { contains: searchTerm } },
        { level: { level_name: { contains: searchTerm } } },
        { level: { department: { dept_name: { contains: searchTerm } } } },
      ];
    }

    return await prisma.classroom.findMany({
      where,
      skip,
      take: limit,
      include: {
        level: {
          include: {
            department: true,
          },
        },
        _count: {
          select: { students: true }
        }
      },
            orderBy: [
                { level: { department: { dept_name: 'asc' } } },
                { level: { level_name: 'asc' } },
                { room_name: 'asc' }
            ]
        });
    }

  export const countClassrooms = async (
    searchTerm?: string,
    deptId?: number,
  ) => {
    const where: any = {};

    if (deptId) {
      where.level = {
        dept_id: deptId,
      };
    }

    if (searchTerm) {
      where.OR = [
        { room_name: { contains: searchTerm } },
        { level: { level_name: { contains: searchTerm } } },
        { level: { department: { dept_name: { contains: searchTerm } } } },
      ];
    }

    return await prisma.classroom.count({ where });
  };

  export const getClassroomById = async (id: number) => {
    return await prisma.classroom.findUnique({
      where: {
        id: id,
      },
      include: {
        level: {
          include: {
            department: true,
          },
        },
        _count: {
          select: { students: true }
        }
      },
    });
  };

  export const getClassroomByName = async (name: string) => {
    // 1. Try exact match
    let classroom = await prisma.classroom.findFirst({
      where: {
        room_name: name,
      },
      include: { level: true }
    });

    if (classroom) return classroom;

    // 2. Try to find if the name is part of the room_name or level_name
    const cleanName = name.replace(/^(ปวช\.|ปวส\.|ปวช|ปวส)\s*/, '').replace(/\s*(ปวช|ปวส)$/, '').trim();
    
    return await prisma.classroom.findFirst({
        where: {
            OR: [
                { room_name: { contains: cleanName } },
                { level: { level_name: { contains: cleanName } } }
            ]
        },
        include: { level: true }
    });
  };

  export const createClassroom = async (data: {
    room_name: string;
    level_id?: number | null;
  }) => {
    return await prisma.classroom.create({
      data: {
        room_name: data.room_name,
        level_id: data.level_id,
      },
    });
  };

  export const updateClassroom = async (
    id: number,
    data: { room_name?: string; level_id?: number | null; dept_id?: number | null },
  ) => {
    return await prisma.classroom.update({
      where: {
        id: id,
      },
      data: {
        room_name: data.room_name,
        level_id: data.level_id,
        dept_id: data.dept_id,
      },
    });
  };

  export const deleteClassroom = async (id: number) => {
    return await prisma.classroom.delete({
      where: {
        id: id,
      },
    });
  };

  export const createWithDependencies = async (data: {
    roomName: string;
    departmentName: string;
    levelName: string;
    teacherName: string;
    students: { studentCode: string; firstName: string; lastName: string }[];
  }) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Find or Create Department
      let dept = await tx.department.findFirst({
        where: { dept_name: data.departmentName },
      });
      if (!dept) {
        dept = await tx.department.create({
          data: { dept_name: data.departmentName },
        });
      }

      // 2. Find or Create Level
      let level = await tx.level.findFirst({
        where: { level_name: data.levelName, dept_id: dept.id },
      });
      if (!level) {
        level = await tx.level.create({
          data: { level_name: data.levelName, dept_id: dept.id },
        });
      }

      // 3. Find or Create Teacher
      const nameParts = data.teacherName.split(/\s+/);
      const tFirstName = nameParts[0];
      const tLastName = nameParts.slice(1).join(" ") || "-";
      let teacher = await tx.teacher.findFirst({
        where: { first_name: tFirstName, last_name: tLastName },
      });
      if (!teacher) {
        teacher = await tx.teacher.create({
          data: { first_name: tFirstName, last_name: tLastName },
        });
      }

      // 4. Find or Create Classroom
      let classroom = await tx.classroom.findFirst({
        where: { room_name: data.roomName, level_id: level.id },
      });
      if (!classroom) {
        classroom = await tx.classroom.create({
          data: { 
            room_name: data.roomName, 
            level_id: level.id,
            dept_id: dept.id // Link to department
          },
        });
      } else if (!classroom.dept_id) {
        // Update existing classroom if it doesn't have a dept_id
        classroom = await tx.classroom.update({
          where: { id: classroom.id },
          data: { dept_id: dept.id }
        });
      }

      // 5. Create/Update Students
      for (const s of data.students) {
        await tx.student.upsert({
          where: { student_code: s.studentCode },
          update: {
            first_name: s.firstName,
            last_name: s.lastName,
            classroom_id: classroom.id,
          },
          create: {
            student_code: s.studentCode,
            first_name: s.firstName,
            last_name: s.lastName,
            classroom_id: classroom.id,
          },
        });
      }

      return classroom;
    });
  };
}
