export default function isValidMillisecond (val) {
  return !Number.isNaN(val) && val > 0;
}
