/** Actions that can be taken on a server that pertain to its status. */
export enum ServerStatusAction {
    /** Pending -> Public */
    Accept = 0,

    /** Pending -> Rejected */
    Reject = 1,

    /** Public -> Withdrawn*/
    Withdraw = 2,

    /** Withdrawn -> Rejected */
    Delete = 3,

    /** Withdrawn -> Public */
    Reinstate = 4,

    /** Rejected -> Public */
    Reconsider = 5,

    /** Public -> Featured */
    Feature = 6,

    /** Featured -> Public */
    Unfeature = 7,
}
