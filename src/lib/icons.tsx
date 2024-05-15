import { colors } from "@/lib/theme";
import { Path, Svg } from "react-native-svg";

export const MicrophoneIcon = () => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke={colors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18 12a6 6 0 0 1-6 6m0 0a6 6 0 0 1-6-6m6 6v3m0 0h3m-3 0H9m6-15v6a3 3 0 1 1-6 0V6a3 3 0 1 1 6 0Z"
    />
  </Svg>
);

export const SendIcon = () => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke={colors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 4 3 11l7 3M20 4l-7 17-3-7M20 4 10 14"
    />
  </Svg>
);

export const SettingsIcon = () => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke={colors.primary}
      strokeWidth={1.5}
      d="M11 3h2a1 1 0 0 1 1 1v.569c0 .428.287.8.682.963.396.164.856.102 1.158-.2l.403-.403a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1 0 1.414l-.402.403c-.303.302-.365.762-.201 1.158.164.395.535.682.963.682H20a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.569c-.428 0-.8.287-.963.682-.164.396-.102.856.2 1.158l.403.403a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414 0l-.403-.402c-.302-.303-.762-.365-1.158-.201-.395.164-.682.535-.682.963V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.569c0-.428-.287-.8-.682-.963-.396-.164-.856-.102-1.158.2l-.403.403a1 1 0 0 1-1.414 0L4.93 17.657a1 1 0 0 1 0-1.414l.402-.403c.303-.302.365-.762.201-1.158-.164-.395-.535-.682-.963-.682H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.569c.428 0 .8-.287.963-.682.164-.396.102-.856-.2-1.158l-.403-.403a1 1 0 0 1 0-1.414L6.343 4.93a1 1 0 0 1 1.414 0l.403.402c.302.303.762.365 1.158.201.395-.164.682-.535.682-.963V4a1 1 0 0 1 1-1Z"
    />
    <Path
      stroke={colors.primary}
      strokeWidth={1.5}
      d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    />
  </Svg>
);

export const ArrowLeftIcon = () => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke={colors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 12h16M4 12l6-6m-6 6 6 6"
    />
  </Svg>
);