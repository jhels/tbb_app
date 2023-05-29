import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export type THSL = {h: number; s: number; l: number};

export type TRGB = {r: number; g: number; b: number};

export type THex = string;

export type TTopNavProps = {
  handlePress: () => void;
};

export type TPieChartData = {
  name: string;
  value: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export type TTextInputStyle = {
  borderColor: string;
  borderWidth: number;
};

export type TMarkerData = {
  latitude: number;
  longitude: number;
  isSafe: boolean;
  date: string;
};

export type TColorSliceState = {
  pageContrast: any;
  textContrast: any;
  containerContrast: any;
  darkMode: boolean;
  colors: string[];
  lightColors: string[];
};

export type TRootNav = {
  name: string;
  focused: boolean;
  icon: IconDefinition;
};

export type TRootNavSliceState = {
  rootNavs: TRootNav[];
};

export type TAccountSliceState = {
  uid: string | null;
  isLoading: boolean;
  hasError: boolean;
};

export type TReadingSliceState = {
  isLoading: boolean;
  hasError: boolean;
  syncedReadings: TReading[];
  unsyncedReadings: TReading[];
  currentReading: TReading | null;
};

export type TNewsSliceState = {
  isLoading: boolean;
  hasError: boolean;
  news: TNews[];
};

export type TMeasurement = {
  name: string;
  value: number | number[];
};

export type TReading = {
  location: {
    latitude: number;
    longitude: number;
  };
  datetime: {
    date: string;
    time: string;
  };
  id: string;
  isSafe: boolean;
  hasSynced: boolean;
  measurements: TMeasurement[];
  timeIntervals?: number[];
};

export type TNews = {
  id: string;
  title: string;
  author: string;
  datetime: {
    date: string;
    time: string;
  };
  description: string;
  contents: {
    heading: string;
    paragraphs: string[];
  }[];
};

export type TAbstractDevice = {
  name: string;
  id: string;
  serviceUUIDs: Array<string>;
};

export type TBluetoothSliceState = {
  availableDevices: TAbstractDevice[];
  connectedDeviceDetails: TAbstractDevice | null;
  isLoading: boolean;
  hasError: boolean;
  permissionsGranted: boolean;
  waitingForResponse: boolean;
  receivedData: any | null;
};
