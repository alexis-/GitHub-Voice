export {};

declare global {
  interface GHConfigCommon {
    apiUrl: string;
    webUrl: string;
    apiOrigin: string;
    webOrigin: string;
    apiHost: string;
    webHost: string;
    apiPath: string;
    webPath: string;
  }

  interface GHConfigClient {
    title: string;
    publicPath: string;
    socialGitHub: string;
    socialFacebook: string;
    socialTwitter: string;
    socialDiscord: string;
  }

  interface GHConfigServer {
    port: number;
    serveStaticFiles: boolean;
    cors: boolean | string | Array<string>;
    dataPath: string;
    sessionsPath: string;
    sessionsSecret: string;
    gitHubClientId: string;
    gitHubClientSecret: string;
  }

  interface GHConfigRepository {
    orgAndRepo: string;
    displayName: string;
  }

  interface GHConfig {
    common: GHConfigCommon;
    server: GHConfigServer;
    client: GHConfigClient;
    repositories: Array<GHConfigRepository>;
  }

  namespace NodeJS {
    interface Global {
       cfg: GHConfig;
    }
  }

  type StringPromise = string | Promise<string>;
}
