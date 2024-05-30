import { Trans, t } from '@lingui/macro'
import { Stack } from '@mui/material'
import { ReactNode } from 'react'
import {
  instructionImage1,
  instructionImage2,
  instructionImage3,
  instructionImage4,
  instructionImage5,
  instructionImage6,
  instructionImage7,
  instructionImage8,
} from 'src/assets/gcp-upload-config-instructions'

export interface InstructionType {
  image?: {
    width: number
    height: number
    src: string
  }
  divComponent?: boolean
  label: string
  instruction: ReactNode
}

const rolesToAssign = ['roles/resourcemanager.organizationViewer', 'roles/viewer', 'roles/iam.securityReviewer']

export const maxInstructionImageWidth = Math.max(
  instructionImage1.width,
  instructionImage2.width,
  instructionImage3.width,
  instructionImage4.width,
  instructionImage5.width,
  instructionImage6.width,
  instructionImage7.width,
  instructionImage8.width,
)

export const getInstructions = (isMobile: boolean): InstructionType[] => [
  {
    label: t`Select Project`,
    image: instructionImage1,
    instruction: t`Select the project in Google Cloud Console that should hold the service account.`,
  },
  { label: t`IAM`, image: instructionImage2, instruction: t`Go To IAM and select Service Accounts.` },
  { label: t`Create Service Account`, image: instructionImage3, instruction: t`Press: Create Service and fill out the form.` },
  {
    label: t`Email Address`,
    image: instructionImage4,
    instruction: t`Press Done. This will bring you to the list of service accounts. Copy the email address of the created service account.`,
  },
  {
    label: t`Service Account Key`,
    image: instructionImage5,
    instruction: (
      <Trans>
        Click the service Account, go to the "Keys" Tab, and Click "Add Key" -&gt; "Create new Key".
        <br />A file is downloaded to your Downloads folder. We will need this file later on.
      </Trans>
    ),
  },
  {
    label: t`Select Organization`,
    image: instructionImage6,
    instruction: t`Now, switch to the organization or folder that holds the resources you want to connect.`,
  },
  {
    label: t`Grant Access`,
    image: instructionImage7,
    instruction: t`Select IAM and press Grant Access. Fill out the form by pasting the email address as the new principal.`,
  },
  {
    label: t`Define Roles`,
    image: instructionImage8,
    divComponent: true,
    instruction: (
      <Trans>
        <p>You need to assign three roles for Fix Security to work:</p>
        <Stack component="ul" spacing={1}>
          {rolesToAssign.map((role, i) => (
            <li key={i}>{role}</li>
          ))}
        </Stack>
        <p>And Press Save.</p>
      </Trans>
    ),
  },
  {
    label: t`Drop Service Account Key File`,
    instruction: (
      <Trans>
        Go to your download folder and drop the service account JSON file in the drop zone {isMobile ? t`below` : t`on the left side`}.
      </Trans>
    ),
  },
]
