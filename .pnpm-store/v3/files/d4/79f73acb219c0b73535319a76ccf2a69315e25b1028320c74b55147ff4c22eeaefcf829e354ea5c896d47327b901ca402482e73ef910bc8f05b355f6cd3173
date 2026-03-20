function filterArgs(args, selectedArgs, inverse = false) {
    if (!selectedArgs)
        return {};
    return Object.keys(args)
        .filter((key) => inverse ? !selectedArgs.includes(key) : selectedArgs.includes(key))
        .reduce((obj, key) => {
        obj[key] = args[key];
        return obj;
    }, {});
}
// Add all required search params with user inputs as values
export function formatUrl(url, params, args, slug) {
    const newUrl = slug && Object.keys(slug).length > 0
        ? new URL(Object.values(slug)[0], url) // If there's a user inputted param for the URL slug, replace the default existing slug or include it
        : new URL(url);
    if (params && args) {
        params.forEach((param) => {
            if (args[param])
                newUrl.searchParams.set(param, args[param]);
        });
    }
    return newUrl.toString();
}
// Construct HTML element and include all default attributes and user-inputted attributes
export function createHtml(element, attributes, htmlAttrArgs, urlQueryParamArgs, slugParamArg) {
    if (!attributes)
        return `<${element}></${element}>`;
    const formattedAttributes = attributes.src?.url
        ? {
            ...attributes,
            src: formatUrl(attributes.src.url, attributes.src.params, urlQueryParamArgs, slugParamArg),
        }
        : attributes;
    const htmlAttributes = Object.keys({
        ...formattedAttributes,
        ...htmlAttrArgs,
    }).reduce((acc, name) => {
        const userVal = htmlAttrArgs?.[name];
        const defaultVal = formattedAttributes[name];
        const finalVal = userVal ?? defaultVal; // overwrite
        const attrString = finalVal === true ? name : `${name}="${finalVal}"`;
        return finalVal ? acc + ` ${attrString}` : acc;
    }, '');
    return `<${element}${htmlAttributes}></${element}>`;
}
// Format JSON by including all default and user-required parameters
export function formatData(data, args) {
    const allScriptParams = data.scripts?.reduce((acc, script) => [
        ...acc,
        ...(Array.isArray(script.params) ? script.params : []),
    ], []);
    // First, find all input arguments that map to parameters passed to script URLs
    const scriptUrlParamInputs = filterArgs(args, allScriptParams);
    // Second, find all input arguments that map to parameters passed to the HTML src attribute
    const htmlUrlParamInputs = filterArgs(args, data.html?.attributes.src?.params);
    // Third, find the input argument that maps to the slug parameter passed to the HTML src attribute if present
    const htmlSlugParamInput = filterArgs(args, [
        data.html?.attributes.src?.slugParam,
    ]);
    // Lastly, all remaining arguments are forwarded as separate HTML attributes
    const htmlAttrInputs = filterArgs(args, [
        ...Object.keys(scriptUrlParamInputs),
        ...Object.keys(htmlUrlParamInputs),
        ...Object.keys(htmlSlugParamInput),
    ], true);
    return {
        ...data,
        // Pass any custom attributes to HTML content
        html: data.html
            ? createHtml(data.html.element, data.html.attributes, htmlAttrInputs, htmlUrlParamInputs, htmlSlugParamInput)
            : null,
        // Pass any required query params with user values for relevant scripts
        scripts: data.scripts
            ? data.scripts.map((script) => ({
                ...script,
                url: formatUrl(script.url, script.params, scriptUrlParamInputs),
            }))
            : null,
    };
}
