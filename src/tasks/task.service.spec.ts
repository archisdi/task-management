import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskDto } from './dto/get-task.dto';
import { TaskStatus } from './task.model';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    remove: jest.fn(),
});

const mockUser = {
    id: 69,
    username: 'user',
};

describe('TaskService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all task from repository', async () => {
            // mock
            taskRepository.getTasks.mockResolvedValue('tasks');

            // case
            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filters: GetTaskDto = { status: TaskStatus.OPEN, search: 'wow' };
            const result = await tasksService.getAllTask(filters, mockUser);

            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('tasks');
        });
    });

    describe('getTaskById', () => {
        it('returns related task if found', async () => {
            const mockTask = { title: 'A fancy title', description: 'a desc' };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(666, mockUser);
            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ id: 666, userId: mockUser.id });
        });

        it('throws NotFoundException if no data found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(666, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('create a new task and returns the object', async () => {
            const mockTask = { title: 'A fancy title', description: 'a desc' };
            taskRepository.createTask.mockResolvedValue(mockTask);

            expect(taskRepository.createTask).not.toHaveBeenCalled();

            await tasksService.createTask(mockTask, mockUser)
                .then(result => {
                    expect(taskRepository.createTask).toHaveBeenCalled();
                    expect(result).toEqual(mockTask);
                });
        });
    });

    describe('deleteTask', () => {
        it('delete an exsisting task', async () => {
            const mockTask = { title: 'A fancy title', description: 'a desc' };
            taskRepository.findOne.mockResolvedValue(mockTask);

            expect(taskRepository.remove).not.toHaveBeenCalled();
            await tasksService.deleteTaskById(666, mockUser);
            expect(taskRepository.remove).toHaveBeenCalled();
        });
    });

    describe('updateTask', () => {
        it('update exsisting task status', async () => {
            const saveMock = jest.fn().mockReturnValue(true);
            const mockTask = { title: 'A fancy title', description: 'a desc', status: 'OPEN', save: saveMock };
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.updateTaskStatus(666, 'DONE', mockUser);
            expect(saveMock).toHaveBeenCalled();
            expect(result.status).toEqual('DONE');
        });
    });
});
