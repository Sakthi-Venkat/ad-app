export const splitStyles = (styles) => {
    // Basic implementation to split styles
    if (!styles) return {};
    return Array.isArray(styles) ? styles : [styles];
};
