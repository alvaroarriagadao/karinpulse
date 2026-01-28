/**
 * Utility functions for the application
 */

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
