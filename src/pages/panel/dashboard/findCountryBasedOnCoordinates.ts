import { polygonContains } from 'd3'
import { PostWorkspaceInventoryAggregateForDashboardItem } from 'src/shared/types/server'
import { worldJSON, WorldJSONType } from './worldJson'

export const findCountryBasedOnCoordinates = (item: PostWorkspaceInventoryAggregateForDashboardItem) => {
  return (
    (worldJSON as WorldJSONType).features.find(({ geometry: { coordinates, type } }) =>
      type === 'Polygon'
        ? coordinates.find((coordinatesItem) => polygonContains(coordinatesItem, [item.group.longitude, item.group.latitude]))
        : coordinates.find((coordinatesItem) =>
            coordinatesItem.find((coordinatesItemItem) =>
              polygonContains(coordinatesItemItem, [item.group.longitude, item.group.latitude]),
            ),
          ),
    ) ??
    (worldJSON as WorldJSONType).features.find(({ geometry: { coordinates, type } }) =>
      type === 'Polygon'
        ? coordinates.find((coordinatesItem) =>
            polygonContains(
              coordinatesItem.map(
                (coordinatesItemItem) =>
                  coordinatesItemItem.map((coordinatesItemItemItem) => coordinatesItemItemItem - 0.2) as [number, number],
              ),
              [item.group.longitude, item.group.latitude],
            ),
          )
        : coordinates.find((coordinatesItem) =>
            coordinatesItem.find((coordinatesItemItem) =>
              polygonContains(
                coordinatesItemItem.map(
                  (coordinatesItemItemItem) =>
                    coordinatesItemItemItem.map((coordinatesItemItemItemItem) => coordinatesItemItemItemItem - 0.2) as [number, number],
                ),
                [item.group.longitude, item.group.latitude],
              ),
            ),
          ),
    ) ??
    (worldJSON as WorldJSONType).features.find(({ geometry: { coordinates, type } }) =>
      type === 'Polygon'
        ? coordinates.find((coordinatesItem) =>
            polygonContains(
              coordinatesItem.map(
                (coordinatesItemItem) =>
                  coordinatesItemItem.map((coordinatesItemItemItem) => coordinatesItemItemItem + 0.2) as [number, number],
              ),
              [item.group.longitude, item.group.latitude],
            ),
          )
        : coordinates.find((coordinatesItem) =>
            coordinatesItem.find((coordinatesItemItem) =>
              polygonContains(
                coordinatesItemItem.map(
                  (coordinatesItemItemItem) =>
                    coordinatesItemItemItem.map((coordinatesItemItemItemItem) => coordinatesItemItemItemItem + 0.2) as [number, number],
                ),
                [item.group.longitude, item.group.latitude],
              ),
            ),
          ),
    )
  )?.properties.name
}
