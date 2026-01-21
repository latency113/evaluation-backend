import prisma from "@/providers/database/database.provider";
export var departmentRepository;
(function (departmentRepository) {
    departmentRepository.getAllDepartments = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.department.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    };
    departmentRepository.countDepartments = async () => {
        return await prisma.department.count();
    };
    departmentRepository.getDepartmentById = async (id) => {
        return await prisma.department.findUnique({
            where: {
                id: id
            }
        });
    };
    departmentRepository.getDepartmentByName = async (name) => {
        return await prisma.department.findFirst({
            where: {
                dept_name: name
            }
        });
    };
    departmentRepository.createDepartment = async (data) => {
        return await prisma.department.create({
            data: {
                dept_name: data.dept_name
            }
        });
    };
    departmentRepository.updateDepartment = async (id, data) => {
        return await prisma.department.update({
            where: {
                id: id
            },
            data: {
                dept_name: data.dept_name
            }
        });
    };
    departmentRepository.deleteDepartment = async (id) => {
        return await prisma.department.delete({
            where: {
                id: id
            }
        });
    };
})(departmentRepository || (departmentRepository = {}));
