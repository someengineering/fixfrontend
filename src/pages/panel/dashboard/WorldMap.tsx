import { Trans } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { alpha, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { BaseType, svg as d3Svg, geoMercator, geoPath, select, Selection, zoom, zoomTransform } from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRightIcon, CloseIcon } from 'src/assets/icons'
import { MarkerIcon } from 'src/assets/raw-icons'
import { useAbsoluteNavigate } from 'src/shared/absolute-navigate'
import { panelUI } from 'src/shared/constants'
import { useNonce } from 'src/shared/providers'
import { ToggleButton } from 'src/shared/toggle-button'
import { PostWorkspaceInventoryAggregateForDashboardItem } from 'src/shared/types/server'
import { AccountCloud } from 'src/shared/types/server-shared'
import { getAccountCloudName } from 'src/shared/utils/getAccountCloudName'
import { stringToColor } from 'src/shared/utils/stringToColor'
import { worldJSON, WorldJSONFeaturesType, WorldJSONType } from './worldJson'

type NodeType = PostWorkspaceInventoryAggregateForDashboardItem & {
  country?: string
}

interface WorldMapProps {
  data: NodeType[]
  countries: string[]
}

export const WorldMap = ({ data, countries }: WorldMapProps) => {
  const allClouds = useMemo(
    () => data.reduce((prev, item) => (prev.includes(item.group.cloud) ? prev : [...prev, item.group.cloud]), [] as AccountCloud[]),
    [data],
  )
  const [clouds, setClouds] = useState(allClouds)
  const nonce = useNonce() ?? ''
  const {
    i18n: { locale },
  } = useLingui()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const buttonsRef = useRef<HTMLDivElement | null>(null)
  const navigate = useAbsoluteNavigate()
  useEffect(() => {
    if (mapRef.current) {
      const filteredData = data.filter((i) => clouds.includes(i.group.cloud))
      let svg: Selection<SVGSVGElement, unknown, null, undefined> | undefined
      let svgG: Selection<SVGGElement, unknown, null, undefined> | undefined
      let pathCountries: Selection<SVGPathElement, WorldJSONFeaturesType, SVGGElement, unknown> | undefined
      let gMarkers: Selection<SVGGElement, NodeType, SVGGElement, unknown> | undefined
      let handleRemoveTooltip: (name: string) => void | undefined
      let exited = false
      const tooltipDiv = select(tooltipRef.current)
      const tooltipClone = tooltipDiv.node()?.cloneNode(true)
      const tooltips: Record<string, Selection<HTMLDivElement, unknown, null, undefined>> = {}
      tooltipDiv.remove()
      let markerIcon: Document
      async function createMap() {
        const offsetWidth = mapRef.current?.offsetWidth ?? 0
        const width = offsetWidth > 1126 || !offsetWidth ? 1126 : offsetWidth
        const height = (width / 1126) * 500
        svg = select(mapRef.current)
          .attr('nonce', nonce)
          .style('height', `${height + 42 + 30}px`)
          .select(function () {
            if (!this) {
              throw Error('D3 internal error, this inside select is undefined')
            }
            return this.insertBefore(window.document.createElementNS('http://www.w3.org/2000/svg', 'svg'), buttonsRef.current)
          })
          .attr('width', offsetWidth ?? 1126)
          .attr('height', height)
        svgG = svg.append('g')

        const projection = geoMercator().fitSize([width, height], {
          type: 'FeatureCollection',
          features: (worldJSON as WorldJSONType).features,
        })
        const pathGenerator = geoPath().projection(projection)

        handleRemoveTooltip = function (name) {
          tooltips[name].on('click', null)
          tooltips[name].remove()
          delete tooltips[name]
        }

        const handleShowTooltip = function (this: SVGGElement, _: unknown, d: NodeType) {
          if (tooltips[d.group.name]) {
            return
          }
          Object.keys(tooltips).forEach(handleRemoveTooltip)
          const tooltipNode = tooltipClone?.cloneNode(true) as HTMLDivElement
          mapRef.current?.appendChild(tooltipNode)
          const thisTooltip = select(tooltipNode)
          const { left, top } = this.getBoundingClientRect()
          thisTooltip.select('.world-map-tooltip-title').text(d.group.long_name)
          thisTooltip.select('.world-map-tooltip-region').text(d.group.name)
          thisTooltip.select('.world-map-tooltip-country').text(d.country ?? '')
          thisTooltip.select('.world-map-tooltip-number-of-resources').text(d.resource_count.toLocaleString(locale))
          thisTooltip.select('.world-map-tooltip-close-button').on('click', () => handleRemoveTooltip(d.group.name))
          thisTooltip.style('display', 'block')
          const defaultCalculatedLeft = left + 24 + 6
          const defaultCalculatedTop = top - 44
          const isLeft = defaultCalculatedLeft + tooltipNode.offsetWidth < window.innerWidth
          const isTop = top + tooltipNode.offsetHeight - 6 < window.innerHeight
          const calculatedLeft = isLeft ? defaultCalculatedLeft : left - tooltipNode.offsetWidth - 6
          thisTooltip.style('left', `${calculatedLeft}px`).style(isTop ? 'top' : 'bottom', isTop ? `${defaultCalculatedTop}px` : '0')
          thisTooltip.select(isLeft ? '.world-map-tooltip-left-arrow' : '.world-map-tooltip-right-arrow').style('display', 'block')
          tooltips[d.group.name] = thisTooltip

          function handleClick(this: BaseType) {
            select(this).on('click', null)
            handleRemoveTooltip(d.group.name)
            navigate({
              pathname: '/inventory/search',
              search: `?q=not is(phantom_resource) and /ancestors.region.reported.name in ["${d.group.name}"] and /ancestors.cloud.reported.name in ["${d.group.cloud}"]`,
            })
          }
          thisTooltip.select('.world-map-tooltip-view-detail').on('click', handleClick)
        }

        pathCountries = svgG
          .selectAll('.country')
          .data((worldJSON as WorldJSONType).features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('d', pathGenerator)
          .attr('fill', (d) =>
            countries.includes(d.properties.name) ? panelUI.uiThemePalette.text.sub : panelUI.uiThemePalette.input.border,
          )
          .attr('stroke', panelUI.uiThemePalette.primary.white)
          .attr('stroke-width', 0.5)

        markerIcon = markerIcon ?? (await d3Svg(MarkerIcon))

        if (!exited) {
          gMarkers = svgG
            ?.selectAll('.marker')
            .data(filteredData)
            .enter()
            .append('g')
            .attr('class', 'marker')
            .attr('cursor', 'pointer')
            .attr('fill', (d) => stringToColor(d.group.name))
            .attr('transform', (d) => {
              const sizes = projection([d.group.longitude, d.group.latitude])
              if (sizes) {
                return `translate(${sizes[0] - 12} ${sizes[1] - 12})`
              }
              return ''
            })

          gMarkers?.nodes().forEach((svg) => {
            svg.appendChild(window.document.importNode(markerIcon.documentElement, true))
          })

          gMarkers?.on('click', handleShowTooltip)

          const handleZoom = (event: { transform: { k: number; x: number; y: number } }) => {
            const { k, x, y } = event.transform

            svgG?.attr('transform', `translate(${x},${y}) scale(${k})`)
            const markerWidth = (1 / k) * 24
            gMarkers
              ?.attr('transform', (d) => {
                const sizes = projection([d.group.longitude, d.group.latitude])
                if (sizes) {
                  return `translate(${sizes[0] - markerWidth / 2} ${sizes[1] - markerWidth / 2})`
                }
                return ''
              })
              .select('svg')
              .attr('width', markerWidth)
              .attr('height', markerWidth)
          }

          const handleStartZoom = function (this: BaseType) {
            select(this).attr('cursor', 'grabbing')
          }

          const handleEndZoom = function (this: BaseType) {
            select(this).attr('cursor', 'grab')
          }
          let x0 = Infinity,
            y0 = Infinity,
            x1 = -Infinity,
            y1 = -Infinity
          const bbox = svgG.node()?.getBBox()
          if (bbox) {
            x0 = Math.min(x0, bbox.x)
            y0 = Math.min(y0, bbox.y)
            x1 = Math.max(x1, bbox.x + bbox.width)
            y1 = Math.max(y1, bbox.y + bbox.height)
          }
          const translateKDefaultZoom = 1.5
          const translateXDefaultZoom = (offsetWidth - width * translateKDefaultZoom) / 2
          const translateYDefaultZoom = (height * (1 - translateKDefaultZoom)) / 2
          // handleZoom({ transform: { k: translateKDefaultZoom, x: translateXDefaultZoom, y: translateYDefaultZoom } })

          const zoomInit = zoom<SVGSVGElement, unknown>()
            .translateExtent([
              [x0, y0],
              [x1, y1],
            ])
            .scaleExtent([1, 9])
          const zoomStartFn = zoomInit.on('start', handleStartZoom)
          const zoomEndFn = zoomInit.on('end', handleEndZoom)
          const zoomFn = zoomInit.on('zoom', handleZoom)

          svg.call(zoomFn)
          svg.call(zoomStartFn)
          svg.call(zoomEndFn)
          zoomInit.transform(svg, function () {
            return zoomTransform(this).translate(translateXDefaultZoom, translateYDefaultZoom).scale(translateKDefaultZoom)
          })
        }
      }

      function cleanUp() {
        gMarkers?.on('click', null)
        gMarkers?.remove()
        pathCountries?.remove()
        Object.keys(tooltips).forEach(handleRemoveTooltip)
        svgG?.remove()
        svg?.remove()
      }

      function windowResizeListener() {
        cleanUp()
        createMap()
      }

      window.addEventListener('resize', windowResizeListener)
      createMap()

      return () => {
        cleanUp()
        exited = true
        window.removeEventListener('resize', windowResizeListener)
      }
    }
  }, [clouds, countries, data, locale, navigate, nonce])

  return (
    <Stack width="100%" position="relative" ref={mapRef} spacing={3.75} alignItems="center">
      <Stack
        position="fixed"
        boxShadow={`0px 6px 8px 0px ${alpha('#000000', 0.08)}`}
        bgcolor="common.white"
        display="none"
        ref={tooltipRef}
        pt={1.5}
        border={({ palette }) => `1px solid ${palette.divider}`}
        nonce={nonce}
        zIndex="tooltip"
      >
        <Box
          className="world-map-tooltip-left-arrow"
          display="none"
          position="absolute"
          borderTop={`1px solid transparent`}
          borderRight={`1px solid transparent`}
          borderBottom={`1px solid ${panelUI.uiThemePalette.primary.divider}`}
          borderLeft={`1px solid ${panelUI.uiThemePalette.primary.divider}`}
          top={28}
          left={-6}
          width={12}
          height={12}
          bgcolor={'common.white'}
          zIndex={-1}
          sx={{
            transform: 'translateY(-50%) rotate(45deg)',
            borderBottomLeftRadius: '3px',
          }}
        ></Box>
        <Box
          className="world-map-tooltip-right-arrow"
          display="none"
          position="absolute"
          borderTop={`1px solid ${panelUI.uiThemePalette.primary.divider}`}
          borderRight={`1px solid ${panelUI.uiThemePalette.primary.divider}`}
          borderBottom={`1px solid transparent`}
          borderLeft={`1px solid transparent`}
          top={28}
          right={-6}
          width={12}
          height={12}
          bgcolor={'common.white'}
          zIndex={-1}
          sx={{
            transform: 'translateY(-50%) rotate(45deg)',
            borderTopRightRadius: '3px',
          }}
        ></Box>
        <IconButton
          className="world-map-tooltip-close-button"
          color="default"
          size="small"
          sx={{
            bgcolor: 'common.black',
            fill: 'white',
            position: 'absolute',
            right: -12,
            top: -12,
            width: 28,
            height: 28,
            ':hover': { bgcolor: '#000000' },
          }}
        >
          <CloseIcon color="white" />
        </IconButton>
        <Typography px={2} className="world-map-tooltip-title" variant="buttonLarge" component="h5" />
        <Stack pt={1} pb={2} px={2} spacing={1}>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography variant="subtitle2" width={90}>
              <Trans>Region</Trans>
            </Typography>
            <Typography variant="subtitle2" className="world-map-tooltip-region" />
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography variant="subtitle2" width={90}>
              <Trans>Country</Trans>
            </Typography>
            <Typography variant="subtitle2" className="world-map-tooltip-country" />
          </Stack>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Typography variant="subtitle2" width={90}>
              <Trans># of Resources</Trans>
            </Typography>
            <Typography variant="buttonSmall" className="world-map-tooltip-number-of-resources" component="p" />
          </Stack>
        </Stack>
        <Divider />
        <Stack alignItems="center" justifyContent="center" p={0.75}>
          <Button className="world-map-tooltip-view-detail" size="small" endIcon={<ChevronRightIcon />}>
            <Trans>View Details</Trans>
          </Button>
        </Stack>
      </Stack>
      <Stack direction="row" mb={1.25} spacing={2} alignItems="center" justifyContent="center" ref={buttonsRef}>
        {allClouds.map((cloud) => (
          <ToggleButton
            key={cloud}
            value={clouds.includes(cloud)}
            onChange={(value) => setClouds((prev) => (value ? [...prev, cloud] : prev.filter((i) => i !== cloud)))}
          >
            <Trans>{getAccountCloudName(cloud)} Regions</Trans>
          </ToggleButton>
        ))}
      </Stack>
    </Stack>
  )
}
