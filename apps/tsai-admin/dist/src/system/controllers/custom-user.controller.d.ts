import { CustomUserService } from '../services/custom-user.service';
export declare class CustomUserController {
    private readonly customService;
    constructor(customService: CustomUserService);
    getByUserno(no: string): any;
}
