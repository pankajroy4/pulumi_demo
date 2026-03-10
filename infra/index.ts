import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";

import { createNetwork } from "./components/network";
import { createKeyVault } from "./components/keyvault";
import { createPostgres } from "./components/postgres";
import { createApi } from "./components/api";
import { createFrontend } from "./components/frontend";

const config = new pulumi.Config();

const env = config.require("environment");
const location = config.require("location");

const project = "pda";

const namePrefix = `${project}-prod`;

// Resource Group
const resourceGroup = new resources.ResourceGroup(`${namePrefix}-rg`, {
    location,
});

// Network
const network = createNetwork(namePrefix, resourceGroup.name, location);

// KeyVault
const keyVault = createKeyVault(namePrefix, resourceGroup.name, location);


// Postgres
const postgres = createPostgres(
    namePrefix,
    resourceGroup.name,
    location,
    network.subnetId
);

// API
const api = createApi(
    namePrefix,
    resourceGroup.name,
    location,
    // postgres.connectionString,
    postgres.host,
    keyVault.vaultUri
);

// Frontend
const frontend = createFrontend(
    namePrefix,
    resourceGroup.name,
    location,
    api.apiUrl
);

// Outputs
export const frontendUrl = frontend.url;
export const staticWebAppToken = frontend.deploymentToken;
export const apiUrl = api.apiUrl;
export const postgresHost = postgres.host;
export const resourceGroupName = resourceGroup.name;
export const keyVaultUri = keyVault.vaultUri;