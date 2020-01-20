declare module '@octokit/graphql' {
  export type Variables = {};
  export type GraphQlQueryResponse = {};
}
declare module '@octokit/rest' {
  namespace Octokit {
    export type Options = {};
  }
  class Octokit {
    pulls: {
      list: { (params?: any): Promise<any> }
    }
    gists: {
      create: { (params?: any): Promise<any> }
      update: { (params?: any): Promise<any> }
      list: { (params?: any): Promise<any> }
    }
  }
  export = Octokit;
}