import { t } from '@lingui/macro'
import { ReactNode } from 'react'
import {
  instructionImage1,
  instructionImage10,
  instructionImage11,
  instructionImage12,
  instructionImage13,
  instructionImage14,
  instructionImage15,
  instructionImage16,
  instructionImage17,
  instructionImage18,
  instructionImage19,
  instructionImage2,
  instructionImage20,
  instructionImage21,
  instructionImage22,
  instructionImage23,
  instructionImage3,
  instructionImage4,
  instructionImage5,
  instructionImage6,
  instructionImage7,
  instructionImage8,
  instructionImage9,
} from 'src/assets/azure-config-instructions'

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

export const maxInstructionImageWidth = Math.max(
  instructionImage1.width,
  instructionImage2.width,
  instructionImage3.width,
  instructionImage4.width,
  instructionImage5.width,
  instructionImage6.width,
  instructionImage7.width,
  instructionImage8.width,
  instructionImage9.width,
  instructionImage10.width,
  instructionImage11.width,
  instructionImage12.width,
  instructionImage13.width,
  instructionImage14.width,
  instructionImage15.width,
  instructionImage16.width,
  instructionImage17.width,
  instructionImage18.width,
  instructionImage19.width,
  instructionImage20.width,
  instructionImage21.width,
  instructionImage22.width,
  instructionImage23.width,
)

export const getInstructions = (isMobile: boolean): InstructionType[] => [
  {
    label: t`Register a new App`,
    image: instructionImage1,
    instruction: t`In the Azure console search, type App Registrations and go to App Registrations page.`,
  },
  { label: t`New registration`, image: instructionImage2, instruction: t`On the App Registration, click New registration.` },
  {
    label: t`Register an application`,
    image: instructionImage3,
    instruction: t`On the Register an application page, fill the name of the application. Write the name down, it will be needed later. The rest can be left as is. Click the Register button.`,
  },
  {
    label: t`Application (client) ID`,
    image: instructionImage4,
    instruction: t`On the new screen, copy Application (client) ID and Directory (tenant) ID and paste them in the fields ${isMobile ? t`bellow` : t`on the left side`}.`,
  },
  {
    label: t`Create an App secret`,
    image: instructionImage5,
    instruction: t`Now, Go to the certificates and secrets section.`,
  },
  {
    label: t`New client secret`,
    image: instructionImage6,
    instruction: t`Click New client secret:`,
  },
  {
    label: t`Add a client secret`,
    image: instructionImage7,
    instruction: t`Enter the secret description and set the expiration date:`,
  },
  {
    label: t`Client secret`,
    image: instructionImage8,
    instruction: t`Copy the Secret Value of the created secret and paste it in the Secret Value field ${isMobile ? t`bellow` : t`on the left side`}, but don't press the submit button yet.`,
  },
  {
    label: t`Assign permission to the App`,
    image: instructionImage9,
    instruction: t`Open the Manage section and go to the App permissions page:`,
  },
  {
    label: t`Add permission`,
    image: instructionImage10,
    instruction: t`Click Add permission:`,
  },
  {
    label: t`Azure Service Management`,
    image: instructionImage11,
    instruction: t`Go to Azure Service Management:`,
  },
  {
    label: t`User Impersonation permission`,
    image: instructionImage12,
    instruction: t`Select User Impersonation permission:`,
  },
  {
    label: t`Add Permission`,
    image: instructionImage13,
    instruction: t`Click the Add a permission button:`,
  },
  {
    label: t`Add the Role assignment to the App`,
    image: instructionImage14,
    instruction: t`In the search field, type Subscriptions:`,
  },
  {
    label: t`Subscriptions`,
    image: instructionImage15,
    instruction: t`Click on the Subscriptions link, then navigate to your subscription:`,
  },
  {
    label: t`Access Control (IAM)`,
    image: instructionImage16,
    instruction: t`Go to the Access Control (IAM):`,
  },
  {
    label: t`Add Role Assignment`,
    image: instructionImage17,
    instruction: t`Click Add Role Assignment`,
  },
  {
    label: t`Select the reader Role (1)`,
    image: instructionImage18,
    instruction: t`On the Add Role Assignment page, select the reader Role:`,
  },
  {
    label: t`Select the reader Role (2)`,
    image: instructionImage19,
    instruction: t`Click Next:`,
  },
  {
    label: t`Select Members (1)`,
    image: instructionImage20,
    instruction: t`On the next step click Select Members:`,
  },
  {
    label: t`Select Members (2)`,
    image: instructionImage21,
    instruction: t`In the Select Members window, type the name of the App you created earlier:`,
  },
  {
    label: t`Select Members (3)`,
    image: instructionImage22,
    instruction: t`Click on it and then click select:`,
  },
  {
    label: t`Review and assign (1)`,
    image: instructionImage23,
    instruction: t`Click review and assign:`,
  },
  {
    label: t`Review and assign (2)`,
    instruction: t`Click review and assign one more time, press the submit button ${isMobile ? t`bellow` : t`on the left side`}, and Done. 🎉🎊`,
  },
]
