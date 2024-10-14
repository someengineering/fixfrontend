import { panelUI } from 'src/shared/constants'
import { AccountCloud } from 'src/shared/types/server-shared'

export const cloudToColor = (cloud: AccountCloud) => panelUI.uiThemePalette.clouds[cloud as 'fix'] ?? panelUI.uiThemePalette.clouds.fix
