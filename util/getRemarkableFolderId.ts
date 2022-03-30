import type { Remarkable } from "remarkable-typescript";
import { v4 as uuidv4 } from "uuid";

export const getRemarkableFolderId = async ({
  name,
  remarkableClient,
  parentFolderId,
}: {
  name: string;
  remarkableClient: Remarkable;
  parentFolderId?: string;
}) => {
  const items = await remarkableClient.getAllItems();

  if (parentFolderId) {
    const folder = items.find(
      item => item.VissibleName === name && item.Parent === parentFolderId
    );

    return (
      folder?.ID ??
      (await remarkableClient.createDirectory(name, uuidv4(), parentFolderId))
    );
  }

  const folder = items.find(
    item => item.VissibleName === name && item.Parent !== "trash"
  );

  return folder?.ID ?? (await remarkableClient.createDirectory(name, uuidv4()));
};
