export const inputs = {
    "registry-url": "https://registry.npmjs.org"
};

export const setInputs = (values): void => {
    for(const key in inputs) {
        delete inputs[key];
    }

    for(const key in values) {
        inputs[key] = values[key];
    }
};
