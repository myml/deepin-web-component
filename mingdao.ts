import axios from 'axios';
import { writeFile } from 'fs/promises';
import { config } from 'dotenv';

config();

main();

async function main() {
  const server = process.env['MD_SERVER'] || '';
  const key = process.env['MD_APP_KEY'] || '';
  const sign = process.env['MD_APP_SIGN'] || '';

  const nav = await footer({
    server: server,
    appKey: key,
    sign: sign,
    worksheetId: 'footer_zh',
    viewId: '62c294714f0cd46903deacc4',
  });

  await writeFile(
    'projects/dcomponents/src/lib/components/footer/nav_zh.json',
    JSON.stringify({ nav }, null, '  ')
  );

  const navEN = await footer({
    server: server,
    appKey: key,
    sign: sign,
    worksheetId: 'footer_en',
    viewId: '62c294e8d578c6f39c52d348',
  });

  await writeFile(
    'projects/dcomponents/src/lib/components/footer/nav_en.json',
    JSON.stringify({ nav: navEN }, null, '  ')
  );
}

async function footer(param: {
  server: string;
  appKey: string;
  sign: string;
  worksheetId: string;
  viewId: string;
}) {
  const url = `${param.server}/api/v2/open/worksheet/getFilterRows`;
  const body = {
    pageSize: 50,
    pageIndex: 1,
    ...param,
  };
  interface footerRow {
    rowid: string;
    parent: string;
    sort: number;
    children: string;
    title: string;
    link: string;
  }
  const resp = await axios.post<{ data: { rows: footerRow[] } }>(url, body);
  console.log(resp.data);
  const nav = resp.data?.data?.rows
    .filter((row) => row.parent === '[]')
    .sort((a, b) => a.sort - b.sort)
    .map((row) => {
      const children = JSON.parse(row.children) as string[];
      return {
        title: row.title,
        links: children
          .map(
            (id: string) =>
              resp.data.data.rows.find((row) => row.rowid === id) as footerRow
          )
          .filter((row) => row !== undefined)
          .sort((a, b) => a.sort - b.sort)
          .map((row) => ({ text: row.title, url: row.link })),
      };
    });
  return nav;
}
