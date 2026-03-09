// infra/components/api.ts
// import * as web from "@pulumi/azure-native/web";

// export function createApi(
//     name: string,
//     rg: any,
//     location: string,
//     dbConnection: any,
//     keyVaultUri: any
// ) {

//     const plan = new web.AppServicePlan(`${name}-plan`, {
//         resourceGroupName: rg,
//         location,
//         sku: {
//             name: "B1",
//             tier: "Basic",
//         },
//         kind: "Linux",
//         reserved: true,
//     });

//     const app = new web.WebApp(`${name}-api`, {
//         resourceGroupName: rg,
//         location,
//         serverFarmId: plan.id,
//         siteConfig: {
//             linuxFxVersion: "DOCKER|docker.io/pankajroy4/fastapi-backend:latest",
//             alwaysOn: true,
//             appSettings: [
//                 { name: "DB_HOST", value: dbConnection},
//                 { name: "DB_USER", value: "pgadmin"},
//                 { name: "DB_PASSWORD",value: "StrongPassword123!"},
//                 { name: "DB_NAME",value: "appdb"},
//                 { name: "DB_PORT", value: "5432"},
//                 { name: "JWT_SIGNING_KEY", value: "dummy" },
//                 { name: "KEYVAULT_URI", value: keyVaultUri },
//                 { name: "WEBSITES_PORT", value: "8000"}
//             ],
//         },
//     });

//     return {
//         apiUrl: app.defaultHostName.apply(
//             h => `https://${h}`
//         ),
//     };
// }




import * as web from "@pulumi/azure-native/web";
import * as pulumi from "@pulumi/pulumi";

export function createApi(
    name: string,
    rg: pulumi.Input<string>,
    location: string,
    postgresHost: pulumi.Input<string>,
    keyVaultUri: pulumi.Input<string>
) {

    const plan = new web.AppServicePlan(`${name}-plan`, {
        resourceGroupName: rg,
        location: location,
        sku: {
            name: "B1",
            tier: "Basic",
        },
        kind: "Linux",
        reserved: true,
    });

    const app = new web.WebApp(`${name}-api`, {
        resourceGroupName: rg,
        location: location,
        serverFarmId: plan.id,
        siteConfig: {
            linuxFxVersion: "DOCKER|docker.io/pankajroy4/fastapi-backend:latest",
            alwaysOn: true,
            appSettings: [
                { name: "DB_HOST",value: postgresHost},
                { name: "DB_USER", value: "pgadmin"},
                { name: "DB_PASSWORD", value: "StrongPassword123!"},
                { name: "DB_NAME", value: "appdb"},
                { name: "DB_PORT", value: "5432"},
                { name: "JWT_SIGNING_KEY", value: "dummy"},
                { name: "KEYVAULT_URI",value: keyVaultUri},
                { name: "WEBSITES_PORT", value: "8000"},
                { name: "ENVIRONMENT", value: "production"}
            ],
        },
    });

    return {
        apiUrl: app.defaultHostName.apply(
            hostname => `https://${hostname}`
        ),
    };
}