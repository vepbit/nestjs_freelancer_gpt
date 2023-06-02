import { TypeOrmModule } from '@nestjs/typeorm';
import { Bids } from '..//entities/bids.entity';
import { Dialogflow } from '../entities/dialogflow.entity';
import { List } from '../entities/list.entity';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

export const TypeORMMySqlTestingModule = (entities: any[]) =>
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        entities: [List, Bids],
        synchronize: false,
    });