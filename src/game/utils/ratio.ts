export const ASPECTS = {
  ['5/7']: 5/7,
  ['3/4']: 3/4
}

export function getWidth(height: number, aspect: number) {
  return height * aspect;
}

export function getHeight(width: number, aspect: number) {
  return width / aspect;
}
