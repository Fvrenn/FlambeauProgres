export function decouperEnPages<T>(elements: T[], taillePage: number): T[][] {
  const pages: T[][] = [];

  for (let debut = 0; debut < elements.length; debut += taillePage) {
    pages.push(elements.slice(debut, debut + taillePage));
  }

  return pages;
}
