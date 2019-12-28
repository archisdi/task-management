import { TaskStatus } from '../task.model';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class GetTaskDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    search: string;
}
