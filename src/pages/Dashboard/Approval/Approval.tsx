import { ErrorMessage, Loader } from "components";
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { ChainId } from 'types/moralis';
import { getEllipsisText } from "utils/formatters";
import { getApprovals, revoke } from './ApprovalHelp';
import { ApprovalTransactions } from "./types";



const Approval = () => {

    const { chainId, account } = useMoralis();

    const [isLoading, setIsLoading] = useState(true)
    const [approvals, setApprovals] = useState<ApprovalTransactions[]>([])

    const columns = [
        {
            title: 'Contract',
            render: (transaction: ApprovalTransactions) => getEllipsisText(transaction.contractAddress),
        },
        {
            title: 'Date',
            render: (transaction: ApprovalTransactions) => new Date(transaction.timestamp).toUTCString(),
        },
        {
            title: 'Approved Amount',
            render: (transaction: ApprovalTransactions) => (
                <>
                    {/* TODO: if allowance was unlimited write 'unlimited' */}
                    {transaction.allowance}
                </>
            ),
        },
        {
            title: 'Revoke',
            render: (transaction: ApprovalTransactions) => (
                <button className="text-black bg-extra-light  hover:bg-light  hover:text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => {
                        revoke(account, transaction.contractAddress, chainId as ChainId)
                    }}
                >
                    Revoke
                </button>
            ),
        },
    ]

    useEffect(() => {
        ; (async () => {
            if (!account || !chainId) {
                setIsLoading(false)
                return
            }
            const result = await getApprovals(account, chainId as ChainId)
            setIsLoading(false)
            if (result) {
                setApprovals(result)
            }
        })()
    }, [account, chainId])


    return (


        <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
            <div className="pb-10 xl:flex items-center">
                <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">Approvals</p>
            </div>
            {isLoading && <Loader />}
            {
                !isLoading && approvals && approvals.length > 0 && (
                    <div className="scrollable-table-wrapper">
                        <table className="table-auto w-full xl:mt-4">
                            <thead className="border-b border-black border-opacity-20 pb-10">
                                <tr>
                                    {columns.map(column => (
                                        <td key={column.title} className="pr-4">
                                            <span className="opacity-60 text-14 xl:text-16">{column.title}</span>
                                        </td>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {approvals.map(transaction => (
                                    <tr key={`${transaction.transactionHash}`}>
                                        {columns.map(column => (
                                            <td key={column.title}>{column.render(transaction)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
            {!isLoading && account && approvals.length === 0 && <ErrorMessage message="No approved contracts found for the address" />}
            {!isLoading && !account && <ErrorMessage message="Please connect your wallet" />}


        </div>
    )


}


export default Approval