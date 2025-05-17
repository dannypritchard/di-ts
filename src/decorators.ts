import { Container, type Constructor } from './container.js';

export function Injectable<T>(token?: Constructor<T>) {
    return (target: Constructor<T>) => {
        Container.register(token ?? target, target);
    };
}

export function Inject<T>(token: Constructor<T>) {
    return (
        target: Object,
        propertyKey: string | symbol,
        parameterIndex?: number
    ): void => {
        const ctor = target.constructor as Constructor<unknown>;
        if (typeof parameterIndex === 'number') {
            Container.recordMethodInjection(ctor, propertyKey, parameterIndex, token);
        } else {
            Container.recordInjection(ctor, propertyKey, token);
        }
    };
}
