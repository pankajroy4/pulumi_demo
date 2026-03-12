// infra/index.ts
import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as authorization from "@pulumi/azure-native/authorization";

import { createNetwork } from "./components/network";
import { createKeyVault } from "./components/keyvault";
import { createPostgres } from "./components/postgres";
import { createApi } from "./components/api";
import { createFrontend } from "./components/frontend";

// Pulumi config
const config = new pulumi.Config();
const location = config.get("location") || "eastasia";

// Environment (Pulumi stack)
const stack = pulumi.getStack();   // dev-test or production

// naming convention
const project = "pda";
const namePrefix = `${project}-${stack}`;

// Resource Group
const resourceGroup = new resources.ResourceGroup(`${namePrefix}-rg`, {
    location,
});

// Network
const network = createNetwork(
    namePrefix,
    resourceGroup.name,
    location
);

// KeyVault
const keyVault = createKeyVault(
    namePrefix,
    resourceGroup.name,
    location
);

// PostgreSQL
const postgres = createPostgres(
    namePrefix,
    resourceGroup.name,
    location,
    network.dbSubnetId,
    network.vnetId,
    keyVault.dbPassword
);

// Frontend (React)
const frontend = createFrontend(
    namePrefix,
    resourceGroup.name,
    location
);

// API (FastAPI backend)
const api = createApi(
    namePrefix,
    resourceGroup.name,
    location,
    postgres.host,
    network.appSubnetId,
    keyVault.dbPasswordSecretUri,
    keyVault.jwtSecretUri,
    frontend.hostname 
);

// KeyVault Access for App Service
const keyVaultSecretsUserRole =
    "/providers/Microsoft.Authorization/roleDefinitions/" +
    "4633458b-17de-408a-b874-0445c86b69e6"; // Key Vault Secrets User

new authorization.RoleAssignment(`${namePrefix}-kv-access`, {
    scope: keyVault.vault.id,
    roleDefinitionId: keyVaultSecretsUserRole,
    principalId: api.identityPrincipalId,
    principalType: "ServicePrincipal",
});

// Pulumi Outputs
export const frontendUrl = frontend.url;
export const apiUrl = api.apiUrl;
export const postgresHost = postgres.host;
export const resourceGroupName = resourceGroup.name;
export const keyVaultUri = keyVault.vaultUri;
export const staticWebAppToken = frontend.deploymentToken;