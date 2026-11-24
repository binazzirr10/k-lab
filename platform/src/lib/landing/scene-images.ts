export function sceneImage(src: string, sizes: string) {
  const stem = src.replace(".webp", "");
  const cast = /(?:joon|minji-alina)$/.test(stem);
  const widths = cast ? [192, 320, 480, 640] : [192, 320, 480, 640, 960];
  const fullWidth = cast ? 900 : 1280;
  return {
    src,
    srcSet: [...widths.map((width) => `${stem}-${width}.webp ${width}w`), `${src} ${fullWidth}w`].join(", "),
    sizes,
    width: fullWidth,
    height: stem.endsWith("joon") ? 1350 : cast ? 822 : 720,
  };
}
