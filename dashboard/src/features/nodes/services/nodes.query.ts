import { NodeType } from "@marzneshin/features/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import {
    EntityQueryKeyType,
    UseEntityQueryProps
} from "@marzneshin/components";

export async function fetchNodes({ queryKey }: EntityQueryKeyType): Promise<{ entity: NodeType[], pageCount: number }> {
    return fetch(`/nodes?page=${queryKey[1]}&size=${queryKey[2]}`).then((result) => {
        return {
            entity: result.items,
            pageCount: result.pages,
        };
    });
}

export const NodesQueryFetchKey = "nodes";


export const useNodesQuery = ({ page, size }: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [NodesQueryFetchKey, page, size],
        queryFn: fetchNodes,
        initialData: { entity: [], pageCount: 0 },
    })
}
