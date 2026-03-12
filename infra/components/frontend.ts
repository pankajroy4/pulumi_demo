import * as web from "@pulumi/azure-native/web";
import * as pulumi from "@pulumi/pulumi";

export function createFrontend(
  name: string,
  rg: pulumi.Input<string>,
  location: string
) {

  const staticApp = new web.StaticSite(`${name}-frontend`, {
      resourceGroupName: rg,
      location: "eastasia",
      sku: {
          name: "Free",
          tier: "Free",
      },
      buildProperties: {
          appLocation: "apps/react-frontend",
          appArtifactLocation: "dist",
      }
  });

  const secrets = web.listStaticSiteSecretsOutput({
      name: staticApp.name,
      resourceGroupName: rg,
  }, {
      dependsOn: [staticApp]
  });

  const deploymentToken = secrets.apply(
      s => s.properties?.apiKey
  );

  return {
      url: staticApp.defaultHostname.apply(h => `https://${h}`),
      deploymentToken
  };
}