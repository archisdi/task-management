import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepo: TaskRepository,
    ) {}

    async getAllTask(filterDto: GetTaskDto) {
        const allTasks: Task[] = await this.taskRepo.getTasks(filterDto);
        return allTasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepo.createTask(createTaskDto);
    }

    async getTaskById(id: number) {
        const task = await this.taskRepo.findOne(id);
        if (!task) {
            throw new NotFoundException('TASK_NOT_FOUND');
        }

        return task;
    }

    async deleteTaskById(id: number): Promise<void> {
        const task = await this.getTaskById(id);
        if (!task) {
            throw new NotFoundException('TASK_NOT_FOUND');
        }

        await task.remove();
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        task.save();

        return task;
    }
}
