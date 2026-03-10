// import * as web from "@pulumi/azure-native/web";

// export function createFrontend(
//     name: string,
//     rg: any,
//     location: string,
//     apiUrl: any
// ) {

//     const staticApp = new web.StaticSite(`${name}-frontend`, {
//         resourceGroupName: rg,
//         location,
//         sku: {
//             name: "Free",
//             tier: "Free",
//         },
//         repositoryUrl: "",
//         branch: "main",
//     });

//     return {
//         url: staticApp.defaultHostname.apply(
//             h => `https://${h}`
//         )
//     };
// }


// ================================

// import * as web from "@pulumi/azure-native/web";

// export function createFrontend(name: string, rg: any, location: string, apiUrl: any) {

//     const staticApp = new web.StaticSite(`${name}-frontend`, {
//         resourceGroupName: rg,
//         location,
//         sku: {
//             name: "Free",
//             tier: "Free",
//         },
//         repositoryUrl: "https://github.com/your-username/your-repo-name",
//         branch: "main",
//         // Note: We may also need a 'repositoryToken' if the repo is private
//     });

//     return {
//         url: staticApp.defaultHostname.apply(h => `https://${h}`)
//     };
// }


// =======================================
// // infra/components/frontend.ts
// import * as web from "@pulumi/azure-native/web";

// export function createFrontend( name: string, rg: any, location: string, apiUrl: any) {
//   const staticApp = new web.StaticSite(`${name}-frontend`, {
//       resourceGroupName: rg,
//       location,
//       sku: {
//           name: "Free",
//           tier: "Free",
//       },
//       // 1. Point this to your actual repository URL
//       repositoryUrl: "https://github.com/pankajroy4/pulumi_demo", 
//       branch: "main",

//       // 2. Define where the code is in your monorepo
//       buildProperties: {
//           appLocation: "apps/react-frontend", // Path to your React app
//           apiLocation: "",                   // Leave empty since Python API is separate
//           appArtifactLocation: "dist",      // Or "build", depending on your React setup
//       },
//   });

//   return {
//       url: staticApp.defaultHostname.apply(h => `https://${h}`)
//   };
// }
// // ======================================================================

// import * as web from "@pulumi/azure-native/web";

// export function createFrontend(name: string, rg: any, location: string, apiUrl: any) {

//   const staticApp = new web.StaticSite(`${name}-frontend`, {
//       resourceGroupName: rg,
//       location,
//       sku: {
//           name: "Free",
//           tier: "Free",
//       },

//       repositoryUrl: "https://github.com/pankajroy4/pulumi_demo",
//       branch: "main",

//       buildProperties: {
//           appLocation: "apps/react-frontend",
//           apiLocation: "",
//           appArtifactLocation: "dist",
//           appBuildCommand: "npm run build"
//       },
//   });

//   return {
//       url: staticApp.defaultHostname.apply(h => `https://${h}`)
//   };
// }


// ===================================================================

import * as web from "@pulumi/azure-native/web";

export function createFrontend(name: string, rg: any, location: string) {

  const staticApp = new web.StaticSite(`${name}-frontend`, {
      resourceGroupName: rg,
      location,
      sku: {
          name: "Free",
          tier: "Free",
      },
  });

  const secrets = web.listStaticSiteSecretsOutput({
      name: staticApp.name,
      resourceGroupName: rg,
  }, {
      dependsOn: [staticApp]
  });

  return {
      url: staticApp.defaultHostname.apply(h => `https://${h}`),
      deploymentToken: secrets.properties.apiKey
  };
}