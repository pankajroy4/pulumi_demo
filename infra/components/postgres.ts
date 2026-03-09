// infra/components/postgres.ts
import * as postgres from "@pulumi/azure-native/dbforpostgresql";
import * as pulumi from "@pulumi/pulumi";

// export function createPostgres(
//     name: string,
//     rg: any,
//     location: string,
//     subnetId: any
// ) {



//     const server = new postgres.Server(`${name}-pg`, {
//         resourceGroupName: rg,
//         location,
//         version: "14",
//         administratorLogin: "pgadmin",
//         administratorLoginPassword: "StrongPassword123!",
//         storage: {
//             storageSizeGB: 32,
//         },
//         sku: {
//             name: "Standard_B1ms",
//             tier: "Burstable",
//         },
//     });


//     const firewall = new postgres.FirewallRule(`${name}-allow-azure`, {
//         resourceGroupName: rg,
//         serverName: server.name,
//         startIpAddress: "0.0.0.0",
//         endIpAddress: "0.0.0.0",
//     });


//     const db = new postgres.Database(`${name}-db`, {
//         resourceGroupName: rg,
//         serverName: server.name,
//         databaseName: "appdb",
//     });

//     // const connectionString = server.fullyQualifiedDomainName.apply(
//     //     host =>
//     //         `postgresql://pgadmin:StrongPassword123!@${host}:5432/appdb`
//     // );

//     const connectionString = pulumi.interpolate`postgresql://${adminUser}:${adminPassword}@${server.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require`;

//     return {
//         host: server.fullyQualifiedDomainName,
//         connectionString
//     };
// }


export function createPostgres(
    name: string,
    rg: any,
    location: string,
    subnetId: any
) {

    const adminUser = "pgadmin";
    const adminPassword = "StrongPassword123!";
    const databaseName = "appdb";

    const server = new postgres.Server(`${name}-pg`, {
        resourceGroupName: rg,
        location,
        version: "14",
        administratorLogin: adminUser,
        administratorLoginPassword: adminPassword,
        storage: {
            storageSizeGB: 32,
        },
        sku: {
            name: "Standard_B1ms",
            tier: "Burstable",
        },
    });

    const firewall = new postgres.FirewallRule(`${name}-allow-azure`, {
        resourceGroupName: rg,
        serverName: server.name,
        startIpAddress: "0.0.0.0",
        endIpAddress: "0.0.0.0",
    });

    const db = new postgres.Database(`${name}-db`, {
        resourceGroupName: rg,
        serverName: server.name,
        databaseName,
    });

    const connectionString = pulumi.interpolate`
postgresql://${adminUser}@${server.name}:${adminPassword}@${server.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require
`;

    return {
        host: server.fullyQualifiedDomainName,
        connectionString
    };
}