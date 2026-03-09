import * as web from "@pulumi/azure-native/web";

export function createApi(
    name: string,
    rg: any,
    location: string,
    dbConnection: any,
    keyVaultUri: any
) {

    const plan = new web.AppServicePlan(`${name}-plan`, {
        resourceGroupName: rg,
        location,
        sku: {
            name: "B1",
            tier: "Basic",
        },
        kind: "Linux",
        reserved: true,
    });

    const app = new web.WebApp(`${name}-api`, {
        resourceGroupName: rg,
        location,
        serverFarmId: plan.id,
        siteConfig: {
            linuxFxVersion: "DOCKER|docker.io/YOUR_DOCKER_USERNAME/fastapi-backend:latest",
            alwaysOn: true,
            appSettings: [
                {
                    name: "DATABASE_URL",
                    value: dbConnection,
                },
                {
                    name: "JWT_SIGNING_KEY",
                    value: "dummy",
                },
                {
                    name: "KEYVAULT_URI",
                    value: keyVaultUri,
                },
                {
                    name: "WEBSITES_PORT",
                    value: "8000",
                }
            ],
        },
    });

    return {
        apiUrl: app.defaultHostName.apply(
            h => `https://${h}`
        ),
    };
}