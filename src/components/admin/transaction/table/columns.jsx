"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, CreditCard, Wallet, Building } from "lucide-react";
import { formatDate } from "@/lib/utils";
import EditTransactionStatusDialog from "../EditTransactionStatusDialog";

const getPaymentMethod = (paymentId) => {
	switch (paymentId) {
		case 1:
			return { label: "Transfer Bank", icon: Building };
		case 2:
			return { label: "Credit Card", icon: CreditCard };
		case 3:
			return { label: "E-Wallet", icon: Wallet };
		default:
			return { label: "Unknown", icon: null };
	}
};

export const columns = [
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "transaction_date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Transaction Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<span className="font-medium">
				{formatDate(row.getValue("transaction_date"))}
			</span>
		),
	},
	{
		id: "user",
		header: "Customer",
		// Menggunakan accessorKey untuk data user
		accessorKey: "user",
		cell: ({ row }) => {
			const user = row.original.user;
			return (
				<div className="font-medium">
					{user ? (
						<div className="flex flex-col">
							<span>{user.name}</span>
							<span className="text-xs text-gray-500">
								{user.email}
							</span>
						</div>
					) : (
						"N/A"
					)}
				</div>
			);
		},
		filterFn: (row, id, value) => {
			const user = row.original.user;
			if (!user) return false;

			const searchValue = value.toLowerCase();
			return (
				user.name?.toLowerCase().includes(searchValue) ||
				user.email?.toLowerCase().includes(searchValue)
			);
		},
	},
	{
		accessorKey: "payment_id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Payment Method
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const paymentId = row.getValue("payment_id");
			const payment = getPaymentMethod(paymentId);
			const Icon = payment.icon;

			return (
				<div className="flex items-center gap-2">
					{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
					<span className="font-medium">{payment.label}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.getValue("status");
			return (
				<Badge
					variant={
						status === "success"
							? "success"
							: status === "pending"
							? "warning"
							: "destructive"
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			return <EditTransactionStatusDialog transaction={row.original} />;
		},
		enableSorting: false,
		enableHiding: false,
	},
];