import { Container, type Constructor } from './container.js';

export function Injectable<T>(token?: Constructor<T>) {
    return (target: Constructor<T>) => {
        Container.register(token ?? target, target);
    };
}

export function Inject<T>(token: Constructor<T>) {
    return <K extends PropertyKey>(
        target: { [P in K]: T },
        propertyKey: K
    ): void => {
        Container.recordInjection(target.constructor as Constructor<unknown>, propertyKey, token);
    };
}
