export interface IEntity {
  name: string
  company: string
  homepage?: string
  categories: string[]
  domains: string[]
  averageExecutionTime: number
  totalExecutionTime: number
  totalOccurrences: number
}

export declare const entities: IEntity[]
export declare function getRootDomain(url: string): string
export declare function getEntity(url: string): IEntity | undefined
