import type { Role } from '~/components/reusable/RolePicker';

export interface IOrganizationLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    domain: string;
    metadata: object;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IApiKeyLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    description: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  }[];
}

export interface IApplicationLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    grant: string;
    secret: string;
    redirectUri: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IPermissionLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    key: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IRoleLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    key: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    Permissions: [];
  }[];
}

export interface IUserLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    Role: Role;
  }[];
}

export interface IWebhookLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    url: string;
    description: string;
    events: string[];
    createdAt: string;
    updatedAt: string;
  }[];
}

export type IHomeLoaderData = [number, number, number, [string, string]];

export interface IOrganizationLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    domain: string;
    metadata: object;
    createdAt: string;
    updatedAt: string;
  }[];
}
