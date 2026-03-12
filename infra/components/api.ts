// import * as web from "@pulumi/azure-native/web";
// import * as pulumi from "@pulumi/pulumi";

// export function createApi(
//     name: string,
//     rg: pulumi.Input<string>,
//     location: string,
//     postgresHost: pulumi.Input<string>,
//     appSubnetId: pulumi.Input<string>,
//     dbPasswordSecretUri: pulumi.Input<string>,
//     jwtSecretUri: pulumi.Input<string>
// ) {

//     const stack = pulumi.getStack();

//     // const plan = new web.AppServicePlan(`${name}-plan`, {
//     //     resourceGroupName: rg,
//     //     location,
//     //     sku: stack === "production"
//     //         ? { name: "P1v3", tier: "PremiumV3" }
//     //         : { name: "B1", tier: "Basic" },
//     //     kind: "Linux",
//     //     reserved: true,
//     // });

//     const plan = new web.AppServicePlan(`${name}-plan`, {
//         resourceGroupName: rg,
//         location,
//         sku: { name: "B1", tier: "Basic" },
//         kind: "Linux",
//         reserved: true,
//     });


//     const databaseUrl = pulumi.interpolate`postgresql://pgadmin:@${postgresHost}:5432/appdb`;

//     const app = new web.WebApp(`${name}-api`, {
//         resourceGroupName: rg,
//         location,
//         serverFarmId: plan.id,

//         identity: {
//             type: "SystemAssigned"
//         },

//         virtualNetworkSubnetId: appSubnetId,

//         siteConfig: {
//             linuxFxVersion: "DOCKER|docker.io/pankajroy4/fastapi-backend:latest",
//             alwaysOn: true,

//             appSettings: [

//                 {
//                     name: "DATABASE_URL",
//                     value: databaseUrl
//                 },

//                 {
//                     name: "JWT_SIGNING_KEY",
//                     value: pulumi.interpolate`@Microsoft.KeyVault(SecretUri=${jwtSecretUri})`
//                 },

//                 {
//                     name: "CORS_ORIGINS",
//                     value: stack === "production"
//                         ? "https://production-frontend-domain"
//                         : "http://localhost:5173"
//                 },

//                 { name: "WEBSITES_PORT", value: "8000" },
//                 { name: "ENVIRONMENT", value: stack }
//             ],
//         },
//     });

//     return {
//         apiUrl: app.defaultHostName.apply(
//             hostname => `https://${hostname}`
//         ),

//         identityPrincipalId: app.identity.apply(i => i!.principalId!)
//     };
// }


import * as web from "@pulumi/azure-native/web";
import * as pulumi from "@pulumi/pulumi";

export function createApi(
    name: string,
    rg: pulumi.Input<string>,
    location: string,
    postgresHost: pulumi.Input<string>,
    appSubnetId: pulumi.Input<string>,
    dbPasswordSecretUri: pulumi.Input<string>,
    jwtSecretUri: pulumi.Input<string>
) {

    const stack = pulumi.getStack();

    /**
     * Pulumi config
     */
    const config = new pulumi.Config();
    const backendImage = config.require("backendImage");

    /**
     * App Service Plan
     */
    const plan = new web.AppServicePlan(`${name}-plan`, {
        resourceGroupName: rg,
        location,
        sku: { name: "B1", tier: "Basic" },
        kind: "Linux",
        reserved: true,
    });

    /**
     * Web App
     */
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

            appSettings: [

                /**
                 * Database settings
                 */
                {
                    name: "DB_HOST",
                    value: postgresHost
                },

                {
                    name: "DB_USER",
                    value: pulumi.output(postgresHost).apply(h =>
                        `pgadmin@${h.split(".")[0]}`
                    )
                },

                {
                    name: "DB_PASSWORD",
                    value: pulumi.interpolate`@Microsoft.KeyVault(SecretUri=${dbPasswordSecretUri})`
                },

                {
                    name: "DB_NAME",
                    value: "appdb"
                },

                {
                    name: "DB_PORT",
                    value: "5432"
                },

                /**
                 * JWT Secret
                 */
                {
                    name: "JWT_SIGNING_KEY",
                    value: pulumi.interpolate`@Microsoft.KeyVault(SecretUri=${jwtSecretUri})`
                },

                /**
                 * CORS
                 */
                {
                    name: "CORS_ORIGINS",
                    value: stack === "production"
                        ? JSON.stringify(["https://lively-wave-04961ca00.4.azurestaticapps.net"])
                        : JSON.stringify(["http://localhost:5173"])
                },

                /**
                 * Azure App Service settings
                 */
                {
                    name: "WEBSITE_VNET_ROUTE_ALL",
                    value: "1"
                },

                {
                    name: "WEBSITES_PORT",
                    value: "8000"
                },

                {
                    name: "ENVIRONMENT",
                    value: stack
                }
            ],
        },
    });

    return {
        apiUrl: app.defaultHostName.apply(
            hostname => `https://${hostname}`
        ),

        identityPrincipalId: app.identity.apply(i => i!.principalId!)
    };
}