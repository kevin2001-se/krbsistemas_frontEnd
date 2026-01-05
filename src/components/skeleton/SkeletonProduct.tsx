import { Skeleton } from '../ui/skeleton'

export default function SkeletonProduct() {
    return (
        <div className="w-10/12 lg:w-[82%] m-auto space-y-2">
            <div className="flex flex-wrap justify-between gap-x-5 gap-y-10 mb-[77px]">
                <Skeleton className="h-80 xl:w-[388px]" />
                <Skeleton className="h-80 xl:w-[388px]" />
                <Skeleton className="h-80 xl:w-[388px]" />
                <Skeleton className="h-80 xl:w-[388px]" />
                <Skeleton className="h-80 xl:w-[388px]" />
                <Skeleton className="h-80 xl:w-[388px]" />
            </div>
        </div>
    )
}
