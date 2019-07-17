export default function isValidMillisecond(val) {
  return !Number.isNaN(val) && new Date(val).getTime > 0;
}
