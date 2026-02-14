export const compareVersions = (v1: number[], v2: number[]): number => {
    const maxLength = Math.max(v1.length, v2.length);
    for (let i = 0; i < maxLength; i++) {
        const v1Part = v1[i] ?? 0;
        const v2Part = v2[i] ?? 0;
        if (v1Part !== v2Part) {
            return v1Part - v2Part;
        }
    }
    return 0;
};