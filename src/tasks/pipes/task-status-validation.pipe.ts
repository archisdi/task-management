import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements  PipeTransform {
    readonly ALLOWED_STATUSES = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    private isStatusValid(status: any) {
        return this.ALLOWED_STATUSES.includes(status);
    }

    public transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException( `${value} is invalid status`);
        }

        return value;
    }
}
