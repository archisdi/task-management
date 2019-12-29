import { Repository, EntityRepository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTaskDto } from './dto/get-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskDto): Promise<Task[]> {
        const { search, status } = filterDto;
        const query = this.createQueryBuilder('task');

        if (status) {
            await query.andWhere('task.status = :status', { status });
        }

        if (search) {
            await query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        await task.save();

        return task;
    }
}
