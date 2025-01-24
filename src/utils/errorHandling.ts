export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', 500);
};

export const createErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle MongoDB duplicate key error
    if (error.message.includes('E11000 duplicate key error')) {
      return 'An account with this email already exists. Please login instead.';
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}; 