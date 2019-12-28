import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskDto } from './dto/get-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get('/')
    getAllTasks(@Query() filterDto: GetTaskDto) {
        const tasks = this.tasksService.getAllTask(filterDto);
        return {
            data: tasks,
        };
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string) {
        const task = this.tasksService.getTaskById(id);
        return {
            data: task,
        };
    }

    @Post('/')
    createNewTask(@Body() createTaskDto: CreateTaskDto) {
        const task = this.tasksService.createTask(createTaskDto);
        return {
            data: task,
        };
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        const task = this.tasksService.updateTaskStatus(id, updateTaskDto);
        return {
            data: task,
        };
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string) {
        this.tasksService.deleteTaskById(id);
        return {};
    }
}
