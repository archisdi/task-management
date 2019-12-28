import { TaskStatus } from '../task.model';

export class GetTaskDto {
    status: TaskStatus;
    search: string;
}
