export type Constructor<T> = new (...args: unknown[]) => T;

export class Container {
    private static providers = new Map<Constructor<unknown>, Constructor<unknown>>();
    private static injections = new Map<Constructor<unknown>, Array<{ key: PropertyKey; token: Constructor<unknown> }>>();
    private static methodInjections = new Map<Constructor<unknown>, Array<{ method: PropertyKey; index: number; token: Constructor<unknown> }>>();

    static register<T>(token: Constructor<T>, provider: Constructor<T>): void {
        this.providers.set(token, provider);
    }

    static recordInjection(
        target: Constructor<unknown>,
        key: PropertyKey,
        token: Constructor<unknown>
    ): void {
        const existing = this.injections.get(target) ?? [];
        existing.push({ key, token });
        this.injections.set(target, existing);
    }

    static recordMethodInjection(
        target: Constructor<unknown>,
        methodName: PropertyKey,
        index: number,
        token: Constructor<unknown>
    ): void {
        const existing = this.methodInjections.get(target) ?? [];
        existing.push({ method: methodName, index, token });
        this.methodInjections.set(target, existing);
    }

    static resolve<T>(token: Constructor<T>): T {
        const provider = this.providers.get(token);
        const Actual = (provider ?? token) as Constructor<T>;
        const instance = new Actual();

        // property injections
        const props = this.injections.get(Actual) ?? [];
        const record = instance as Record<PropertyKey, unknown>;
        for (const { key, token: depToken } of props) {
            record[key] = Container.resolve(depToken);
        }

        // method injections
        const methods = this.methodInjections.get(Actual) ?? [];
        const byMethod = new Map<PropertyKey, Array<{ index: number; token: Constructor<unknown> }>>();
        for (const { method, index, token: depToken } of methods) {
            const arr = byMethod.get(method) ?? [];
            arr.push({ index, token: depToken });
            byMethod.set(method, arr);
        }
        for (const [methodName, params] of byMethod.entries()) {
            const args = params
                .sort((a, b) => a.index - b.index)
                .map(p => Container.resolve(p.token));
            const fn = record[methodName];
            if (typeof fn === 'function') {
                (fn as (...args: unknown[]) => unknown).apply(instance, args);
            }
        }

        return instance;
    }
}
