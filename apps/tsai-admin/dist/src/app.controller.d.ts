import { AppService } from './app.service';
export declare class AppController {
    private readonly service;
    constructor(service: AppService);
    getHealth(): Promise<string>;
}
