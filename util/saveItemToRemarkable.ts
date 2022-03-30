import cheerio from "cheerio";
import type { Remarkable } from "remarkable-typescript";
import pdf from "html-pdf";
import { v4 as uuidv4 } from "uuid";

const elementsToRemove = [
  "script",
  "footer",
  "head",
  "svg",
  "nav",
  "input",
  "button",
  "img",
  "*[class*=menu]",
  "*[class*=navigation]",
  "*[class*=nav]",
  "*[class*=sidebar]",
  "*[class*=recommendation]",
  "*[class*=newsletter]",
  "*[class*=cookie]",
];

const pdfOptions = {
  border: "1cm",
};

export const saveItemToRemarkable = async ({
  item,
  remarkableClient,
  folderId,
}: {
  item: any;
  remarkableClient: Remarkable;
  folderId: string;
}) => {
  const response = await fetch(item.link);
  const rawHtml = await response.text();
  const $ = cheerio.load(rawHtml);
  $(elementsToRemove.join(", ")).remove();

  const minifiedBody = $.html().replace(/>\s+|\s+</g, m => m.trim());

  pdf.create(minifiedBody, pdfOptions).toBuffer(async function (err, buffer) {
    await remarkableClient.uploadPDF(
      item.title as string,
      uuidv4(),
      buffer,
      folderId
    );
  });

  return { title: item.title, minifiedBody };
};
