import { endPoints } from 'src/shared/constants'
import {
  PutWorkspaceNotificationAddEmailRequest,
  PutWorkspaceNotificationAddOpsgenieRequest,
  PutWorkspaceNotificationAddPagerdutyRequest,
  PutWorkspaceNotificationAddTeamsRequest,
} from 'src/shared/types/server'
import { NotificationChannel } from 'src/shared/types/server-shared'
import { axiosWithAuth } from 'src/shared/utils/axios'

type PutWorkspaceNotificationParamType = Exclude<NotificationChannel, 'slack' | 'discord'>

type PutWorkspaceNotificationAddMutationParams = {
  workspaceId: string
  channel: PutWorkspaceNotificationParamType
} & (
  | ({ channel: 'email' } & PutWorkspaceNotificationAddEmailRequest)
  | ({ channel: 'pagerduty' } & PutWorkspaceNotificationAddPagerdutyRequest)
  | ({ channel: 'teams' } & PutWorkspaceNotificationAddTeamsRequest)
  | ({ channel: 'opsgenie' } & PutWorkspaceNotificationAddOpsgenieRequest)
)

export const putWorkspaceNotificationAddMutation = async ({
  workspaceId,
  channel,
  ...params
}: PutWorkspaceNotificationAddMutationParams) => {
  return axiosWithAuth
    .put<undefined>(
      `${endPoints.workspaces.workspace(workspaceId).notification.add(channel)}${channel === 'email' ? `?name=${params.name}&email=${(params as PutWorkspaceNotificationAddEmailRequest).email.join('&email=')}` : ''}`,
      null,
      channel === 'email' ? undefined : { params },
    )
    .then((res) => res.data)
}
