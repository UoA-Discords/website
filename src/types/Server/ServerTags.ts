/**
 * Tags for servers that describe the general faculty/faculties they pertain to.
 *
 * Servers can have any combination of these tags, as long as they are somewhat relevant.
 *
 * Servers can also have no tags, in which case their value here would be 0.
 *
 * These values (mostly) come from https://www.auckland.ac.nz/en/study/our-faculties.html
 */
export enum ServerTags {
    /** Humanities, social sciences, languages, and indigenous studies. */
    Arts = 1 << 0,

    /** Topics that are forward-focused and relevant to the commercial world. */
    Business = 1 << 1,

    /** [Custom] The main focus of this server is a club (e.g. UoA Esports). */
    Club = 1 << 2,

    /** [Custom] Since CompSci students are terminally online, they can have their own tag :) */
    ComputerScience = 1 << 3,

    /** Creativity, research, teaching and practice. */
    CreativeArts = 1 << 4,

    /** Education and social services. */
    Education = 1 << 5,

    /** Improving the quality of life in national and global communities. */
    Engineering = 1 << 6,

    Law = 1 << 7,

    HealthAndMedicine = 1 << 8,

    /** Cross-disciplinary research. */
    Research = 1 << 9,

    Science = 1 << 10,

    Statistics = 1 << 11,

    /** [Custom] Partnered with the UoA Discords organization. */
    Partnered = 1 << 12,
}
