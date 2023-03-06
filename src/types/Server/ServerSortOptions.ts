/** Options for sorting an array of servers. */
export enum ServerSortOptions {
    /** Sort by Discord ID. */
    Id = 0,

    /** Sort by status. */
    Status = 1,

    /** Sort by 'created at' timestamp. */
    CreatedAt = 2,

    /** Sort by approximate count of total members (may be outdated). */
    MemberCount = 3,
}
