// Aquaphil brand palette. Swap values here to re-skin the whole app.
export const colors = {
  primary: '#0A6CFF',
  primaryDark: '#0047B3',
  primaryLight: '#E8F1FF',
  aqua: '#1EC8E8',
  heroTop: '#0057E0',
  heroBottom: '#2BB8F0',
  accent: '#FFB020',
  green: '#11A55A',
  greenLight: '#E7F7EE',
  red: '#E5484D',
  ink: '#111111',
  text: '#1C2330',
  textMuted: '#5E6878',
  border: '#E3E8EF',
  tile: '#EEF4FF',
  bg: '#FFFFFF',
  bgSoft: '#F5F8FC',
  white: '#FFFFFF',
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

export const shadow = {
  shadowColor: '#0B2A5B',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');
