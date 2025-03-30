export type PrimaryKey = string

export interface Save {
  name: string
  timestamp: number
  data: string
}

export type DataType = 'base64' | 'json' | 'any'

export interface GameSettings {
  enabled: boolean
  dataType: DataType
  saves: Save[]
}
