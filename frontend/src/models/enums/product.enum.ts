/* eslint-disable perfectionist/sort-modules */

export enum AttributeSetName {
  Accessory = 'Phụ kiện',
  Headphone = 'Tai nghe',
  Keyboard = 'Bàn phím',
  Laptop = 'Laptop',
  Monitor = 'Màn hình',
  Mouse = 'Chuột',
  PC = 'PC',
}

export enum CardType {
  Article = 'article',
  Product = 'product',
}

export enum ECategoryLevel {
  Main = 2,
  Root = 1,
  Sub = 3,
}

export enum EProdInfomationType {
  Articles = 'articles',
  Documents = 'documents',
  Specifications = 'specifications',
}

export enum EProductBaseAttributeCode {
  BatteryCapacity = 'battery_capacity',
  CategoryIds = 'category_ids',
  Description = 'description',
  GeneralInfo = 'general_info',
  Image = 'image',
  MetaDescription = 'meta_description',
  MetaKeywords = 'meta_keyword',
  MetaTitle = 'meta_title',
  ReleaseYear = 'release_year',
  ShortDescription = 'short_description',
  SmallImage = 'small_image',
  SwatchImage = 'swatch_image',
  TaxClassId = 'tax_class_id',
  Thumbnail = 'thumbnail',
  UrlKey = 'url_key',
}

export enum EProductFeaturesAndPorts {
  Connectivity = 'connectivity',
  Ergonomics = 'ergonomics',
  GiftMessageAvailable = 'gift_message_available',
  HasOptions = 'has_options',
  MsrpDisplayActualPriceType = 'msrp_display_actual_price_type',
  OptionsContainer = 'options_container',
  PageLayout = 'page_layout',
  RequiredOptions = 'required_options',
  VesaMount = 'vesa_mount',
}

export enum EProductPowerAndDimensions {
  DepthWithoutStand = 'depth_without_stand',
  DepthWithStand = 'depth_with_stand',
  HeightWithoutStand = 'height_without_stand',
  HeightWithStand = 'height_with_stand',
  PowerConsumption = 'power_consumption',
  WeightWithoutStand = 'weight_without_stand',
  WeightWithStand = 'weight_with_stand',
  WidthWithoutStand = 'width_without_stand',
  WidthWithStand = 'width_with_stand',
}

export enum EProductSpecs {
  Brightness = 'brightness',
  ColorDepth = 'color_depth',
  ColorGamut = 'color_gamut',
  Cpu = 'cpu',
  Display = 'screen_size',
  Gpu = 'gpu',
  PanelType = 'panel_type',
  Ram = 'ram',
  RefreshRate = 'filter_refresh_rate',
  Resolution = 'resolution',
  ResponseTime = 'response_time',
  ScreenTechnology = 'screen_technology',
  ScreenType = 'screen_type',
  Storage = 'storage_type',
  TouchScreen = 'touch_screen',
  ViewingAngle = 'viewing_angle',
}

export enum PcSpecs {
  Cpu = 'cpu',
  Display = 'screen_size',
  Gpu = 'gpu',
  PanelType = 'panel_type',
  Ram = 'ram',
  RefreshRate = 'refresh_rate',
  Resolution = 'resolution',
  Storage = 'storage',
}

// filter options

export enum EKeyboardSpecFilter {
  Backlight = 'backlight',
  Color = 'color',
  ConnectionType = 'connection_type',
  HotSwappable = 'hot_swappable',
  MacroKeys = 'macro_keys',
  MediaKeys = 'media_keys',
  NKeyRollover = 'n_key_rollover',
}

export enum EMouseSpecFilter {
  MouseFeature = 'mouse_feature',
}

export enum ELaptopSpecFilter {
  Color = 'color',
  CpuType = 'cpu_type',
  RefreshRate = 'filter_refresh_rate',
  Resolution = 'resolution',
  ScreenSize = 'screen_size',
  StorageType = 'storage_type',
  TouchScreen = 'touch_screen',
}

export enum EMonitorSpecFilter {
  Color = 'color',
  RefreshRate = 'filter_refresh_rate',
  Resolution = 'resolution',
  ScreenSize = 'screen_size',
  TouchScreen = 'touch_screen',
}

export enum EPCSpecFilter {
  RamCapacity = 'ram_capacity',
  StorageCapacity = 'storage_capacity',
  StorageType = 'storage_type',
}

export enum EAccessorySpecFilter {
  Brand = 'filter_brand',
  Color = 'color',
}

export enum EHeadphoneSpecFilter {
  Color = 'color',
  Foldable = 'foldable',
  HeadphoneType = 'headphone_type',
  SwivelingEarCups = 'swiveling_ear_cups',
}

export enum EProductFilter {
  Accessory = 'accessory',
  Headphone = 'headphone',
  Keyboard = 'keyboard',
  Laptop = 'laptop',
  Monitor = 'monitor',
  Mouse = 'mouse',
  PC = 'pc',
}

// properties
export enum EProductProperties {
  Backlight = 'backlight',
  ConnectionType = 'connection_type',
  Cpu = 'cpu',
  Display = 'screen_size',
  Gpu = 'gpu',
  PanelType = 'panel_type',
  Ram = 'ram',
  RefreshRate = 'filter_refresh_rate',
  Resolution = 'resolution',
  Storage = 'storage',
  TouchScreen = 'touch_screen',
}

export enum EDocumentType {
  CSV = 'csv',
  DOC = 'doc',
  DOCX = 'docx',
  PDF = 'pdf',
  PPT = 'ppt',
  PPTX = 'pptx',
  TXT = 'txt',
  XLS = 'xls',
  XLSX = 'xlsx',
}
