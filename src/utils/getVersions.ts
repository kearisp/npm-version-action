import {Npm} from "../makes/Npm.js";
import {NotFoundException} from "../exceptions/NotFoundException.js";


export const getVersions = async (registryUrl: string, name: string): Promise<string[]> => {
    try {
        const npm = new Npm(registryUrl),
              info = await npm.getPackageInfo(name);

        return info.versions;
    }
    catch(err) {
        if(err instanceof NotFoundException) {
            return [];
        }

        throw err;
    }
};
