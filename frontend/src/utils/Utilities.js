// Utilities.js

export function GetUrlArgs() {
    const url = window.location.href;
    const args = url.split('?')[1];
    if (args === undefined) {
        return {};
    }
    const argList = args.split('&');
    const argDict = {};
    argList.forEach(arg => {
        const [key, value] = arg.split('=');
        argDict[key] = value;
    });
    return argDict;
}

