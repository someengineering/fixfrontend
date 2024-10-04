import worldJSON from './world.json'

export type WorldJSONFeaturesType = {
  geometry:
    | {
        type: 'Polygon'
        coordinates: [number, number][][]
      }
    | {
        type: 'MultiPolygon'
        coordinates: [number, number][][][]
      }
  properties: { name: string; childNum: number }
  type: 'Feature'
}

export type WorldJSONType = {
  type: 'FeatureCollection'
  crs: { type: 'name'; properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } }
  features: WorldJSONFeaturesType[]
}

export { worldJSON }
