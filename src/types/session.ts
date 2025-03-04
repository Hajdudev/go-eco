export type User = {
  name: string;
  email: string; // Email is required for identification
  image: string;
  recent_rides?: string[]; // Fixed the type from [string] to string[]
};
