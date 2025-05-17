export type Constructor<T> = new (...args: unknown[]) => T;

export class Container {
    private static providers = new Map<Constructor<unknown>, Constructor<unknown>>();
    private static injections = new Map<Constructor<unknown>, Array<{ key: PropertyKey; token: Constructor<unknown> }>>();

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

    static resolve<T>(token: Constructor<T>): T {
        const provider = this.providers.get(token) as Constructor<T> | undefined;
        const Actual = (provider ?? token) as Constructor<T>;
        const instance = new Actual();

        const injections = this.injections.get(Actual as Constructor<unknown>) ?? [];
        const record = instance as Record<PropertyKey, unknown>;

        for (const { key, token: depToken } of injections) {
            record[key] = Container.resolve(depToken);
        }

        return instance;
    }
}