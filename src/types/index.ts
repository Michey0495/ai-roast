export interface RoastInput {
  name: string;
  job: string;
  hobbies: string;
  selfpr: string;
  bio: string;
}

export interface RoastResult {
  id: string;
  input: RoastInput;
  roast: string;
  createdAt: string;
}
