module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['!.storybook', '__mocks__/*', 'public/*.min.js', 'src/locales/**/messages.po', 'dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['prettier', '@typescript-eslint', 'react-refresh'],
  overrides: [
    {
      files: ['*.js'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
    {
      files: ['lingui.config.ts', 'src/locales/*/messages.d.ts', '.storybook/*.ts', 'mock-apis/**/*.ts'],
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    {
      files: ['vite.config.ts', 'vite.config.test.ts'],
      parserOptions: {
        project: './tsconfig.node.json',
      },
    },
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': ['warn'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              '@mui/material/*',
              '!@mui/material/locale',
              '@mui/lab/*',
              '@mui/x-date-pickers/*',
              '!@mui/x-date-pickers/locales',
              '!@mui/x-date-pickers/AdapterDayjs',
              '@mui/x-tree-view/*',
              '!@mui/x-tree-view/locales',
              '@mui/x-data-grid/*',
              '!@mui/x-data-grid/locales',
              '@mui/base*',
              '@mui/system*',
              '@mui/types*',
              '@mui/utils*',
              '@mui/core-downloads-tracker*',
              '@mui/private-theming*',
              '@mui/styled-engine*',
              '@emotion*',
            ],
            message: 'Only import usage of @mui/material, @mui/lab, @mui/x-date-pickers, @mui/x-data-grid and @mui/x-tree-view is allowed.',
          },
          {
            group: ['../*'],
            message: 'Relative import is not allowed.',
          },
          {
            group: [
              'src/*/*/*',
              '!src/pages/panel/shared',
              'src/pages/panel/shared/*/*',
              '!src/shared/utils/*',
              '!src/shared/types/shared',
              '!src/shared/types/server',
              '!src/shared/types/server-shared',
              'src/shared/types/server/*',
              '!src/shared/layouts/*',
              'src/shared/layouts/*/*',
            ],
            message:
              'Every components in shared should have index.ts for re-export and import from top folder of shared is only allowed with the exception of layouts/parent, types/parent, utils/util',
          },
        ],
        paths: [
          {
            name: '@mui/icons-material',
            message: 'Only import usage of @mui/icons-material/Icon is allowed (do not named import icons).',
          },
          {
            name: '.',
            message:
              "No import should be getting from '.' (index.ts). This makes so sense, the import should point to the file in the same folder EG. './Component'",
          },
        ],
      },
    ],
    'no-restricted-globals': [
      'error',
      'document',
      'name',
      'location',
      'customElements',
      'history',
      'navigation',
      'locationbar',
      'menubar',
      'personalbar',
      'scrollbars',
      'statusbar',
      'toolbar',
      'status',
      'closed',
      'frames',
      'length',
      'top',
      'opener',
      'parent',
      'frameElement',
      'navigator',
      'origin',
      'external',
      'screen',
      'innerWidth',
      'innerHeight',
      'scrollX',
      'pageXOffset',
      'scrollY',
      'pageYOffset',
      'visualViewport',
      'screenX',
      'screenY',
      'outerWidth',
      'outerHeight',
      'devicePixelRatio',
      'clientInformation',
      'screenLeft',
      'screenTop',
      'styleMedia',
      'onsearch',
      'isSecureContext',
      'trustedTypes',
      'performance',
      'onappinstalled',
      'onbeforeinstallprompt',
      'crypto',
      'indexedDB',
      'sessionStorage',
      'localStorage',
      'onbeforexrselect',
      'onabort',
      'onbeforeinput',
      'onbeforetoggle',
      'onblur',
      'oncancel',
      'oncanplay',
      'oncanplaythrough',
      'onchange',
      'onclick',
      'onclose',
      'oncontextlost',
      'oncontextmenu',
      'oncontextrestored',
      'oncuechange',
      'ondblclick',
      'ondrag',
      'ondragend',
      'ondragenter',
      'ondragleave',
      'ondragover',
      'ondragstart',
      'ondrop',
      'ondurationchange',
      'onemptied',
      'onended',
      'onerror',
      'onfocus',
      'onformdata',
      'oninput',
      'oninvalid',
      'onkeydown',
      'onkeypress',
      'onkeyup',
      'onload',
      'onloadeddata',
      'onloadedmetadata',
      'onloadstart',
      'onmousedown',
      'onmouseenter',
      'onmouseleave',
      'onmousemove',
      'onmouseout',
      'onmouseover',
      'onmouseup',
      'onmousewheel',
      'onpause',
      'onplay',
      'onplaying',
      'onprogress',
      'onratechange',
      'onreset',
      'onresize',
      'onscroll',
      'onsecuritypolicyviolation',
      'onseeked',
      'onseeking',
      'onselect',
      'onslotchange',
      'onstalled',
      'onsubmit',
      'onsuspend',
      'ontimeupdate',
      'ontoggle',
      'onvolumechange',
      'onwaiting',
      'onwebkitanimationend',
      'onwebkitanimationiteration',
      'onwebkitanimationstart',
      'onwebkittransitionend',
      'onwheel',
      'onauxclick',
      'ongotpointercapture',
      'onlostpointercapture',
      'onpointerdown',
      'onpointermove',
      'onpointerrawupdate',
      'onpointerup',
      'onpointercancel',
      'onpointerover',
      'onpointerout',
      'onpointerenter',
      'onpointerleave',
      'onselectstart',
      'onselectionchange',
      'onanimationend',
      'onanimationiteration',
      'onanimationstart',
      'ontransitionrun',
      'ontransitionstart',
      'ontransitionend',
      'ontransitioncancel',
      'onafterprint',
      'onbeforeprint',
      'onbeforeunload',
      'onhashchange',
      'onlanguagechange',
      'onmessage',
      'onmessageerror',
      'onoffline',
      'ononline',
      'onpagehide',
      'onpageshow',
      'onpopstate',
      'onrejectionhandled',
      'onstorage',
      'onunhandledrejection',
      'onunload',
      'crossOriginIsolated',
      'scheduler',
      'alert',
      'atob',
      'blur',
      'btoa',
      'cancelAnimationFrame',
      'cancelIdleCallback',
      'captureEvents',
      'clearInterval',
      'clearTimeout',
      'close',
      'confirm',
      'createImageBitmap',
      'fetch',
      'find',
      'focus',
      'getComputedStyle',
      'getSelection',
      'matchMedia',
      'moveBy',
      'moveTo',
      'open',
      'postMessage',
      'print',
      'prompt',
      'queueMicrotask',
      'releaseEvents',
      'reportError',
      'requestAnimationFrame',
      'requestIdleCallback',
      'resizeBy',
      'resizeTo',
      'scroll',
      'scrollBy',
      'scrollTo',
      'setInterval',
      'setTimeout',
      'stop',
      'structuredClone',
      'webkitCancelAnimationFrame',
      'webkitRequestAnimationFrame',
      'chrome',
      'fence',
      'caches',
      'cookieStore',
      'ondevicemotion',
      'ondeviceorientation',
      'ondeviceorientationabsolute',
      'launchQueue',
      'sharedStorage',
      'documentPictureInPicture',
      'onbeforematch',
      'getScreenDetails',
      'queryLocalFonts',
      'showDirectoryPicker',
      'showOpenFilePicker',
      'showSaveFilePicker',
      'originAgentCluster',
      'credentialless',
      'speechSynthesis',
      'oncontentvisibilityautostatechange',
      'onscrollend',
      'webkitRequestFileSystem',
      'webkitResolveLocalFileSystemURL',
      'webpackChunk',
      'IncludeFragmentElement',
      'ActionBarElement',
      'DetailsMenuElement',
      'AnchoredPositionElement',
      'FocusGroupElement',
      'ImageCropElement',
      'ModalDialogElement',
      'NavListElement',
      'SegmentedControlElement',
      'ToggleSwitchElement',
      'ToolTipElement',
      'XBannerElement',
      'AutocompleteElement',
      'ClipboardCopyElement',
      'RelativeTimeElement',
      'TabContainerElement',
      'PrimerMultiInputElement',
      'AutoCheckElement',
      'PrimerTextFieldElement',
      'ToggleSwitchInputElement',
      'ActionMenuElement',
      'DetailsDialogElement',
      'FileAttachmentElement',
      'FilterInputElement',
      'GEmojiElement',
      'MarkdownHeaderButtonElement',
      'MarkdownBoldButtonElement',
      'MarkdownItalicButtonElement',
      'MarkdownQuoteButtonElement',
      'MarkdownCodeButtonElement',
      'MarkdownLinkButtonElement',
      'MarkdownImageButtonElement',
      'MarkdownUnorderedListButtonElement',
      'MarkdownOrderedListButtonElement',
      'MarkdownTaskListButtonElement',
      'MarkdownMentionButtonElement',
      'MarkdownRefButtonElement',
      'MarkdownStrikethroughButtonElement',
      'MarkdownToolbarElement',
      'RemoteInputElement',
      'TaskListsElement',
      'TextExpanderElement',
      'TypingEffectElement',
      'FuzzyListElement',
      'GitCloneHelpElement',
      'MarkedTextElement',
      'PasswordStrengthElement',
      'PollIncludeFragmentElement',
      'SlashCommandExpanderElement',
      'TextSuggesterElement',
      'VirtualFilterInputElement',
      'VirtualListElement',
      'VisiblePasswordElement',
      'BatchDeferredContentElement',
      'Turbo',
      'litHtmlVersions',
      'WebauthnGetElement',
      'SudoCredentialOptionsElement',
      'CollapsibleSidebarWidgetElement',
      'SidebarMemexInputElement',
      'NotificationsListSubscriptionFormElement',
      'NotificationsTeamSubscriptionFormElement',
      'NotificationsDialogLabelItemElement',
      'NotificationsListSubscriptionFormDialogElement',
      'CommentActionsContainerElement',
      'DiscussionSpotlightPreviewElement',
      'DiscussionSpotlightContainerElement',
      'CommandPaletteModeElement',
      'CommandPaletteTipElement',
      'CommandPaletteScopeElement',
      'CommandPaletteTokenElement',
      'CommandPaletteItemGroupElement',
      'ClientDefinedProviderElement',
      'commandPalette',
      'CommandPalette',
      'ServerDefinedProviderElement',
      'CommandPaletteHelpElement',
      'CommandPaletteInputElement',
      'EditHistoryElement',
      'ExperimentalActionMenuElement',
      'InlineMachineTranslationElement',
      'CommandPaletteItemElement',
      'CommandPalettePageElement',
      'NotificationShelfWatcherElement',
      'CommandPalettePageStackElement',
      'CustomScopesElement',
      'DeferredSidePanelElement',
      'UserDrawerSidePanelElement',
      'SlashCommandToolbarButtonElement',
      'SiteHeaderLoggedInUserMenuElement',
      'NotificationIndicatorElement',
      'QueryBuilderElement',
      'QbsearchInputElement',
      'ReactionsMenuElement',
    ],
  },
}
