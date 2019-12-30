import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepo: TaskRepository,
    ) {}

    async getAllTask(filterDto: GetTaskDto, user: User) {
        const allTasks: Task[] = await this.taskRepo.getTasks(filterDto, user);
        return allTasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepo.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user?: User) {
        const task = await this.taskRepo.findOne({ id, userId: user.id });
        if (!task) {
            throw new NotFoundException('TASK_NOT_FOUND');
        }

        return task;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const task = await this.getTaskById(id, user);
        await this.taskRepo.remove(task);
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        task.save();

        return task;
    }
}
