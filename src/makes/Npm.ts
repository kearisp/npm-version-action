export class Npm {
    public constructor(
        public readonly registryUrl: string
    ) {}

    public async getPackageInfo(name: string) {
        const res = await fetch(`${this.registryUrl}/${name}`);

        if(res.status !== 200) {
            throw new Error("Failed to fetch package info from the registry");
        }

        return res.json();
    }
}
