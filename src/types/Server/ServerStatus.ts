/** All the possible statuses of a server. */
export enum ServerStatus {
    /**
     * A "Pending Server", hidden to the public but visible to users with the `ManageServers` permission.
     *
     * This is the initial status of all servers.
     */
    Pending = 0,

    /**
     * A "Rejected Server", hidden to the public but visible to users with the `ManageServers` permission.
     *
     *
     * We keep a record of these servers (but do not update them) to stop them being submitted again.
     */
    Rejected = 1,

    /** A "Public Server", visible to the public (shocker I know). */
    Public = 2,

    /**
     * A "Withdrawn Server", hidden to the public but visible to users with the `ManageServers` permission.
     *
     * This is intended to be a temporary state between Public and Rejected, and we should still keep updating the
     * server since it could get reinstated.
     */
    Withdrawn = 3,

    /** A "Featured Server", visible and emphasized to the public. */
    Featured = 4,
}
