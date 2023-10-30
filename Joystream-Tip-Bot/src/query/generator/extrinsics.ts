import { GraphQLClient } from "graphql-request";
import { decodeAddress } from "../../hook/formatAddress";

export interface ExtrinsicFregemnt {
  id: number;
  hash: string;
  call: {
    name: string;
    args: {
      dest: string;
      value: number;
    };
  };
  signature: any;
  block: {
    id: number;
    hash: string;
    height: number;
    timestamp: string;
    spec: {
      specVersion: number;
    };
  };
}

export interface Extrinsic {
  id: number;
  hash: string;
  name: string;
  account: string;
  value: number;
  dest: string;
  height: number;
  timestamp: string;
  specVersion: number;
}

interface ExtrinsicFilter {
  call: {
    name_eq: string;
    block: {
      timestamp_gt: Date;
    };
  };
}

export const asExtrinsic = (extrinsic: ExtrinsicFregemnt): Extrinsic => {
  return {
    id: extrinsic.id,
    hash: extrinsic.hash,
    name: extrinsic.call.name,
    account: extrinsic.signature.address,
    value: extrinsic.call.args.value,
    dest: extrinsic.call.args.dest,
    height: extrinsic.block.height,
    timestamp: extrinsic.block.timestamp,
    specVersion: extrinsic.block.spec.specVersion,
  };
};

export async function getExtrinsics(
  filter?: ExtrinsicFilter
): Promise<ExtrinsicFregemnt[]> {
  const graphQLClient = new GraphQLClient(
    "https://joystream.explorer.subsquid.io/graphql"
  );

  const query = `
    query GetExtrinsics($filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
      extrinsics(where: $filter, orderBy: $order, limit: 10000) {
        id
        hash
        call {
          name
          args
        }
        signature
        block {
          id
          hash
          height
          timestamp
          spec {
            specVersion
          }
        }
      }
    }
  `;

  const variables = {
    filter,
    order: "block_id_DESC",
  };

  try {
    const data: any = await graphQLClient.request(query, variables);

    return data.extrinsics;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const useGetTransfers = async (
  filter: ExtrinsicFilter,
  wallet: string
) => {
  const extrinsics = await getExtrinsics(filter);
  if (Array.isArray(extrinsics)) {
    const data = extrinsics.map(asExtrinsic);
    const decAddress = decodeAddress(wallet);
    const filter = data.filter((d) => {
      return d.account === decAddress
    });
    const decBaseAddress = decodeAddress(
      process.env.SERVER_WALLET_ADDRESS ?? ""
    );
    const result = filter.filter((d) => d.dest === decBaseAddress);
    return result;
  } else {
    return [];
  }
};
