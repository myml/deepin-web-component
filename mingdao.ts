import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import { config } from 'dotenv';

config();

main();

async function main() {
  const server = process.env['MD_SERVER'] || '';
  const key = process.env['MD_APP_KEY'] || '';
  const sign = process.env['MD_APP_SIGN'] || '';
  const menu = await header({
    server,
    appKey: key,
    sign,
    worksheetId: 'header_zh',
    viewId: '62be89614f0cd46903de555e',
  });
  await writeFile(
    'projects/dcomponents/src/lib/components/header/menu_zh.json',
    JSON.stringify({ menu }, null, '  ')
  );
  const menuEN = await header({
    server,
    appKey: key,
    sign,
    worksheetId: 'header_en',
    viewId: '62da413f5d203fc600b469d0',
  });
  await writeFile(
    'projects/dcomponents/src/lib/components/header/menu_en.json',
    JSON.stringify({ menu: menuEN }, null, '  ')
  );

  const nav = await footer({
    server: server,
    appKey: key,
    sign: sign,
    worksheetId: 'footer_zh',
    viewId: '62c2943c4f0cd46903deacbb',
  });

  await writeFile(
    'projects/dcomponents/src/lib/components/footer/nav_zh.json',
    JSON.stringify(nav, null, '  ')
  );

  const navEN = await footer({
    server: server,
    appKey: key,
    sign: sign,
    worksheetId: 'footer_en',
    viewId: '62c294e8d578c6f39c52d349',
  });

  await writeFile(
    'projects/dcomponents/src/lib/components/footer/nav_en.json',
    JSON.stringify(navEN, null, '  ')
  );
}

interface Row {
  rowid: string;
  parent: string;
  sort: number;
  children: string;
  title: string;
  link: string;
  type: string;
  img: string;
}

async function header(params: {
  server: string;
  appKey: string;
  sign: string;
  worksheetId: string;
  viewId: string;
}) {
  const url = `${params.server}/api/v2/open/worksheet/getFilterRows`;
  const body = {
    pageSize: 50,
    pageIndex: 1,
    ...params,
  };

  const resp = await fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await resp.json()) as { data: { rows: Row[] } };
  const nav = data.data?.rows
    .filter((row) => row.parent === '[]') // 选取一级菜单
    .sort((a, b) => a.sort - b.sort) // 排序
    .map((row) => {
      // 获取子菜单
      const children = JSON.parse(row.children) as string[];
      return {
        name: row.title,
        url: row.link || '',
        children: children
          .map(
            (id: string) =>
              data.data.rows.find((row) => row.rowid === id) as Row
          )
          .filter((row) => row !== undefined)
          .sort((a, b) => a.sort - b.sort)
          .map((row) => ({ name: row.title, url: row.link, children: [] })),
      };
    });
  return nav;
}

async function footer(params: {
  server: string;
  appKey: string;
  sign: string;
  worksheetId: string;
  viewId: string;
}) {
  const url = `${params.server}/api/v2/open/worksheet/getFilterRows`;
  const body = {
    pageSize: 50,
    pageIndex: 1,
    ...params,
  };

  const resp = await fetch(url, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await resp.json()) as { data: { rows: Row[] } };
  const navs = data.data?.rows
    .filter((row) => row.parent === '[]' && row.type === '链接') // 选取一级菜单
    .sort((a, b) => a.sort - b.sort) // 排序
    .map((row) => {
      // 获取子菜单
      const children = JSON.parse(row.children) as string[];
      return {
        title: row.title,
        links: children
          .map(
            (id: string) =>
              data.data.rows.find((row) => row.rowid === id) as Row
          )
          .filter((row) => row !== undefined)
          .sort((a, b) => a.sort - b.sort)
          .map((row) => ({ text: row.title, url: row.link })),
      };
    });

  const iconRow = data.data?.rows.find(
    (row) => row.parent === '[]' && row.type === '图标'
  );
  const icon = !iconRow
    ? undefined
    : {
        title: iconRow?.title,
        imgs: (JSON.parse(iconRow?.children ?? '[]') as string[])
          .map((id) => data.data.rows.find((row) => row.rowid === id) as Row)
          .filter((row) => row !== undefined)
          .sort((a, b) => a.sort - b.sort)
          .map((row) => ({ text: row.title, url: row.link, img: row.img })),
      };

  const qrRow = data.data?.rows.find(
    (row) => row.parent === '[]' && row.type === '二维码'
  );
  const qr = !qrRow
    ? undefined
    : {
        title: qrRow?.title,
        imgs: (JSON.parse(qrRow?.children ?? '[]') as string[])
          .map((id) => data.data.rows.find((row) => row.rowid === id) as Row)
          .filter((row) => row !== undefined)
          .sort((a, b) => a.sort - b.sort)
          .map((row) => ({ text: row.title, url: row.link, img: row.img })),
      };

  return { navs, qr, icon };
}
