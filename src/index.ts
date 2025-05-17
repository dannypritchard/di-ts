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
class BadService {
    incompatible(): void {
        console.log('I am not a logger');
    }
}

@Injectable()
class UserService {
    @Inject(LoggerService)
    public logger!: ILoggerService;

    // @Inject(BadService) public logger2!: ILoggerService; // fails

    getUser() {
        this.logger.log('fetching user...');
        return { id: 1, name: 'Alice' };
    }
}

const userSvc = Container.resolve(UserService);
console.log(userSvc.getUser());
