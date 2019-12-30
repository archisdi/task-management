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
        const tasks = this.tasksService.getAllTask(filterDto, user);
        return tasks;
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @getUser() user: User) {
        const task = this.tasksService.getTaskById(id, user);
        return task;
    }

    @Post('/')
    @UsePipes(ValidationPipe)
    createNewTask(@Body() createTaskDto: CreateTaskDto, @getUser() user: User) {
        const task = this.tasksService.createTask(createTaskDto, user);
        return task;
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @getUser() user: User,
    ) {
        const task = this.tasksService.updateTaskStatus(id, status, user);
        return task;
    }

    @Delete('/:id')
    async deleteTaskById(@Param('id', ParseIntPipe) id: number, @getUser() user: User) {
        await this.tasksService.deleteTaskById(id, user);
        return {};
    }
}
