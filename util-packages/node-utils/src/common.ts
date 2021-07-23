export function isNodeError(error: unknown, code: string): error is Error {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return error instanceof Error && (error as any).code === code;
}
