export const isVersionHighEnough = (minVersion: string) => {
  const v1 = 1;
  const v2 = 0;
  const v3 = 6;
  const [m1, m2, m3] = minVersion.split('.').map(item => parseInt(item));
  if (m1 < v1) {
    return true;
  } else if (m1 == v1 && m2 < v2) {
    return true;
  } else if (m1 == v1 && m2 == v2 && m3 <= v3) {
    return true;
  } else {
    return false;
  }
};
