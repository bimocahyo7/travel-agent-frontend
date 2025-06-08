"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import EditBookingStatusDialog from "../EditBookingStatusDialog";
import Link from "next/link";

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
		accessorKey: "booking_date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Booking Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = row.getValue("booking_date");
			return value ? (
				<span className="font-medium">{formatDate(value)}</span>
			) : (
				"N/A"
			);
		},
	},
	{
		id: "customer",
		header: "Customer",
		accessorKey: "user", // Change this if the field name is different
		cell: ({ row }) => {
			const user = row.original.user; // And this
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
			const user = row.original.user; // And this
			if (!user) return false;

			const searchValue = value.toLowerCase();
			return (
				user.name?.toLowerCase().includes(searchValue) ||
				user.email?.toLowerCase().includes(searchValue)
			);
		},
	},
	{
		accessorKey: "package",
		header: "Package",
		cell: ({ row }) => {
			const package_data = row.original.package;
			return (
				<div className="font-medium">
					{package_data ? package_data.name : "N/A"}
				</div>
			);
		},
	},
	{
		accessorKey: "vehicle",
		header: "Vehicle",
		cell: ({ row }) => {
			const vehicle = row.original.vehicle;
			return (
				<div className="font-medium">
					{vehicle ? vehicle.name : "N/A"}
				</div>
			);
		},
	},
	{
		accessorKey: "jumlah_penumpang",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Passengers
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = parseInt(row.getValue("jumlah_penumpang"));
			return <div className="font-medium">{value}</div>;
		},
	},
	{
		accessorKey: "total_price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Total Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const amount = parseInt(row.getValue("total_price"));
			return <div className="font-medium">Rp {amount?.toLocaleString('id-ID')}</div>;
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
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
						status === "confirmed"
							? "success"
							: status === "pending"
							? "warning"
							: status === "cancelled"
							? "destructive"
							: status === "completed"
							? "default"
							: "secondary"
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
			return (
				<div className="flex gap-2 items-center">
					<EditBookingStatusDialog booking={row.original} />
					<Link
						href={`/admin/booking/${row.original.id}`}
						className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded"
					>
						Detail
					</Link>
				</div>
			);
		},
	},
];