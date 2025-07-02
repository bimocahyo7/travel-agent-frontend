"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Star, User, Package, MessageSquareText } from "lucide-react";

export default function ViewReviewDialog({ review }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-sky-700 border-sky-700 cursor-pointer"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Review Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="size-5 text-gray-500" />
              User Information
            </h3>
            <div className="pl-7">
              <p className="text-sm text-gray-600">Name: {review.user?.name}</p>
              <p className="text-sm text-gray-600">ID: {review.user_id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="size-5 text-gray-500" />
              Package Information
            </h3>
            <div className="pl-7">
              <p className="text-sm text-gray-600">
                Name: {review.package?.name}
              </p>
              <p className="text-sm text-gray-600">ID: {review.package?.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Star className="size-5 text-gray-500" />
              Rating
            </h3>
            <div className="pl-7">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-200">
                <span className="text-sm font-medium text-amber-900">
                  {review.rating}
                </span>
                <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquareText className="size-5 text-gray-500" />
              Comment
            </h3>
            <div className="pl-7">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {review.comment}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
