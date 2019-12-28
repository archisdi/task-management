import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v4';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskDto } from './dto/get-task.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTask(filterDto: GetTaskDto) {
        const { search, status } = filterDto;
        let allTasks: Task[] = this.tasks;

        if (!status) {
            allTasks = this.tasks.filter(task => task.title.includes(search) || task.description.includes(search));
        } else if (!search) {
            allTasks = this.tasks.filter(task => task.status === status);
        } else {
            allTasks = this.tasks.filter(
                task => task.title.includes(search) || task.description.includes(search) && task.status === status,
            );
        }

        return allTasks;
    }

    createTask(createTaskDto: CreateTaskDto) {
        const {
            title,
            description,
        } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);

        return task;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    deleteTaskById(id: string): void {
        const taskIndex: number | undefined = this.tasks.findIndex(item => item.id === id);

        if (taskIndex) {
            this.tasks.splice(taskIndex, 1);
        }
    }

    updateTaskStatus(id: string, updateTaskDto: UpdateTaskDto): Task {
        const task = this.getTaskById(id);
        task.status = updateTaskDto.status;

        return task;
    }
}
