import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskDto } from './dto/get-task.dto';
import { TaskStatus } from './task.model';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get('/')
    getAllTasks(@Query(ValidationPipe) filterDto: GetTaskDto, @getUser() user: User) {
        const tasks = this.tasksService.getAllTask(filterDto);
        console.log(user); // get auth user
        return tasks;
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number) {
        const task = this.tasksService.getTaskById(id);
        return task;
    }

    @Post('/')
    @UsePipes(ValidationPipe)
    createNewTask(@Body() createTaskDto: CreateTaskDto) {
        const task = this.tasksService.createTask(createTaskDto);
        return task;
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus) {
        const task = this.tasksService.updateTaskStatus(id, status);
        return task;
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number) {
        this.tasksService.deleteTaskById(id);
        return {};
    }
}
