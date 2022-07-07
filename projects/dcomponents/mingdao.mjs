import axios from "axios";
import fs from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

async function footer(server, appkey, sign, worksheetID, viewID) {
  const url = `${server}/api/v2/open/worksheet/getFilterRows`;
  const body = {
    appKey: appKey,
    sign: sign,
    worksheetId: worksheetID,
    pageSize: 50,
    pageIndex: 1,
    viewId: viewID,
  };
  const resp = await axios.post(url, body);
  const nav = resp.data?.data?.rows
    .filter((row) => row.parent === "[]")
    .sort((a, b) => a.sort - b.sort)
    .map((row) => {
      return {
        title: row.title,
        links: JSON.parse(row.children)
          .map((id) => resp.data.data.rows.find((row) => row.rowid === id))
          .sort((a, b) => a.sort - b.sort)
          .map((row) => ({ text: row.title, url: row.link })),
      };
    });
  return nav;
}

const server = process.env["MD_SERVER"];
const key = process.env["MD_APP_KEY"];
const sign = process.env["MD_APP_SIGN"];

const nav = await footer(
  server,
  key,
  sign,
  "footer_zh",
  "62c2943c4f0cd46903deacbb"
);

await fs.writeFile(
  "projects/dcomponents/src/lib/components/footer/nav_zh.json",
  JSON.stringify({ nav }, null, "  ")
);

const navEN = await footer(
  server,
  key,
  sign,
  "footer_en",
  "62c294e8d578c6f39c52d349"
);

await fs.writeFile(
  "projects/dcomponents/src/lib/components/footer/nav_en.json",
  JSON.stringify({ nav: navEN }, null, "  ")
);
