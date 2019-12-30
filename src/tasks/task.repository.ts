import { Repository, EntityRepository } from 'typeorm';
import { Task } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTaskDto } from './dto/get-task.dto';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTaskDto, user: User): Promise<Task[]> {
        try {
            const { search, status } = filterDto;
            const query = this.createQueryBuilder('task');

            query.where('task.userId = :userId', { userId: user.id });

            if (status) {
                await query.andWhere('task.status = :status', { status });
            }

            if (search) {
                await query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
            }

            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`failed to get task for user ${user.username}, ${error.message}`, error.stack);
            throw error;
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();
        delete task.user;

        return task;
    }
}
