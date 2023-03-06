/** Options for sorting an array of users. */
export enum UserSortOptions {
    /** Sort by Discord ID */
    Id = 0,

    /** Sort by 'registered' timestamp. */
    Registered = 1,

    /** Sort by 'last login or refresh' timestamp. */
    LastLoginOrRefresh = 2,
}
