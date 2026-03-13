// infra/components/api.ts
import * as web from "@pulumi/azure-native/web";
import * as pulumi from "@pulumi/pulumi";

export function createApi(
  name: string,
  rg: pulumi.Input<string>,
  location: string,
  postgresHost: pulumi.Input<string>,
  appSubnetId: pulumi.Input<string>,
  dbPasswordSecretUri: pulumi.Input<string>,
  jwtSecretUri: pulumi.Input<string>,
  frontendHost: pulumi.Input<string>,
  acrLoginServer: pulumi.Input<string>  
) {

  const stack = pulumi.getStack();
  // Pulumi config
  const config = new pulumi.Config();
  // const backendImage = config.require("backendImage");
  const backendImage = config.get("backendImage");

  // App Service Plan
  const plan = new web.AppServicePlan(`${name}-plan`, {
    resourceGroupName: rg,
    location,
    sku: { name: "B1", tier: "Basic" },
    kind: "Linux",
    reserved: true,
  });

  // Web App
  const app = new web.WebApp(`${name}-api`, {
    resourceGroupName: rg,
    location,
    serverFarmId: plan.id,

    identity: {
      type: "SystemAssigned"
    },

    virtualNetworkSubnetId: appSubnetId,

    siteConfig: {
      linuxFxVersion: pulumi.interpolate`DOCKER|${backendImage}`,
      alwaysOn: true,
      acrUseManagedIdentityCreds: true,
      cors: {
        allowedOrigins: [
          pulumi.interpolate`https://${frontendHost}`
        ],
        supportCredentials: true
      },
      appSettings: [
        { name: "DOCKER_REGISTRY_SERVER_URL", value: pulumi.interpolate`https://${acrLoginServer}` },
        // Database settings
        { name: "DB_HOST", value: postgresHost },
        { name: "DB_USER", value: "pgadmin" },
        { name: "DB_PASSWORD", value: pulumi.interpolate`@Microsoft.KeyVault(SecretUri=${dbPasswordSecretUri})` },
        { name: "DB_NAME", value: "appdb" },
        { name: "DB_PORT", value: "5432" },

        // JWT Secret
        { name: "JWT_SIGNING_KEY", value: pulumi.interpolate`@Microsoft.KeyVault(SecretUri=${jwtSecretUri})` },

        // CORS
        // {
        //   name: "CORS_ORIGINS", value: stack === "production"
        //     ? JSON.stringify(["https://zealous-pebble-0add45f00.6.azurestaticapps.net"])
        //     : JSON.stringify(["http://localhost:5173"])
        // },

        // Azure App Service settings
        { name: "WEBSITE_VNET_ROUTE_ALL", value: "1" },
        { name: "WEBSITES_PORT", value: "8000" },
        { name: "ENVIRONMENT", value: stack }
      ],
    },
  });

  return {
    apiUrl: app.defaultHostName.apply(hostname => `https://${hostname}`),
    identityPrincipalId: app.identity.apply(i => i!.principalId!)
  };
}