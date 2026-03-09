// infra/components/postgres.ts
import * as postgres from "@pulumi/azure-native/dbforpostgresql";

export function createPostgres(
    name: string,
    rg: any,
    location: string,
    subnetId: any
) {



    const server = new postgres.Server(`${name}-pg`, {
        resourceGroupName: rg,
        location,
        version: "14",
        administratorLogin: "pgadmin",
        administratorLoginPassword: "StrongPassword123!",
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
        databaseName: "appdb",
    });

    const connectionString = server.fullyQualifiedDomainName.apply(
        host =>
            `postgresql://pgadmin:StrongPassword123!@${host}:5432/appdb`
    );

    return {
        host: server.fullyQualifiedDomainName,
        connectionString
    };
}