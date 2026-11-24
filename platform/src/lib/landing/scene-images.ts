export function sceneImage(src: string, sizes: string) {
  const stem = src.replace(".webp", "");
  const widths = [192, 320, 480, 640];
  const fullWidth = /(?:joon|minji-alina)$/.test(stem) ? 720 : 1120;
  return {
    src,
    srcSet: [...widths.map((width) => `${stem}-${width}.webp ${width}w`), `${src} ${fullWidth}w`].join(", "),
    sizes,
  };
}
