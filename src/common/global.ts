export {};

declare global {
  interface GHConfigClient {
    title: string;
    apiHost: string;
    socialGitHub: string;
    socialFacebook: string;
    socialTwitter: string;
    socialDiscord: string;
  }

  interface GHConfigServer {
    port: number;
    apiPath: string;
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
