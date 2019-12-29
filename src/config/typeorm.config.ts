import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    port: 32771,
    database: 'task_management',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};
