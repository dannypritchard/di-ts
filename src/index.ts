import { Injectable, Inject } from './decorators.js';
import { Container } from './container.js';

type ILoggerService = {
    log(msg: string): void;
}

@Injectable()
class LoggerService {
    log(msg: string): void {
        console.log(`[LOG] ${msg}`);
    }
}

@Injectable()
export class UserService {
    private logger!: ILoggerService;

    // also viable
    // @Inject(LoggerService) private logger!: ILoggerService;

    construct(
        @Inject(LoggerService) logger: ILoggerService,
    ) {
        this.logger = logger;
    }

    doWork() {
        this.logger.log('the user service is doing some work');
    }
}


const userService = Container.resolve(UserService);
console.log(userService.doWork());
