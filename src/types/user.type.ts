import { RepositoryType } from "./repository.type";

export interface UserType {
  fullName: string;
  username: string;
  company: string;
  city: string;
  repositories?: RepositoryType[];
}